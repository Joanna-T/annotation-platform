/* Amplify Params - DO NOT EDIT
  API_ADMINQUERIES_APIID
  API_ADMINQUERIES_APINAME
  API_ANNOTATIONPLATFORM_GRAPHQLAPIENDPOINTOUTPUT
  API_ANNOTATIONPLATFORM_GRAPHQLAPIIDOUTPUT
  API_ANNOTATIONPLATFORM_GRAPHQLAPIKEYOUTPUT
  ENV
  REGION
Amplify Params - DO NOT EDIT */

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

const region = process.env.REGION
const AWS = require("aws-sdk");
AWS.config.update({ region: region });
const docClient = new AWS.DynamoDB.DocumentClient();
const dynamodb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });
const endpointID = process.env.API_ANNOTATIONPLATFORM_GRAPHQLAPIIDOUTPUT
const environment = process.env.ENV
const annotationTaskTable = `AnnotationTask-${endpointID}-${environment}`
const medicalQuestionTable = `MedicalQuestion-${endpointID}-${environment}`
const questionFormTable = `QuestionForm-${endpointID}-${environment}`



exports.handler = async (event) => {

  for (const record of event.Records) {

    const newImage = AWS.DynamoDB.Converter.unmarshall(record.dynamodb.NewImage)

    console.log('DynamoDB Record:', record.dynamodb);

    let taskID = newImage.id
    console.log("taskID")
    console.log(taskID)
    let medicalQuestionID = newImage.questionID
    console.log("medicalquestionId")
    console.log(medicalQuestionID)
    let questionFormID = newImage.questionFormID
    let medicalQuestion = {
      TableName: medicalQuestionTable,
      Key: {
        id: medicalQuestionID
      }
    }

    let questionForm = {
      TableName: questionFormTable,
      Key: {
        id: questionFormID
      }
    }

    var queryTasks = {
      KeyConditionExpression: 'questionID = :questionID',
      IndexName: 'byQuestion',
      ExpressionAttributeValues: {
        ':questionID': { 'S': medicalQuestionID }
      },
      ProjectionExpression: "question_answers, document_title",
      TableName: annotationTaskTable
    };

    await getItems(queryTasks)
      .then(result => {
        console.log("medicalQuestion", result.Items[0].question_answers)
      })
      .catch(error => console.log(error))

    await Promise.all([getItem(medicalQuestion), getItem(questionForm), getItems(queryTasks)])
      .then(async results => {
        console.log(results)
        const newTasks = results[2].Items.map(
          (result) => AWS.DynamoDB.Converter.unmarshall(result)
        );
        console.log("New results")
        console.log(newTasks)
        const convertedTasks = AWS.DynamoDB.Converter.unmarshall(results[2].Items)
        console.log(convertedTasks)
        await updateQuestionCurationResults(results[0].Item, results[1].Item, newTasks)
      })
      .then()
      .catch(error => console.log(error))

  }
  return `Successfully processed ${event.Records.length} records.`;
};

async function getItems(item) {
  try {
    const data = await dynamodb.query(item).promise()
    return data
  } catch (err) {
    console.log(err)
    return err
  }
}


async function getItem(item) {
  try {
    const data = await docClient.get(item).promise()
    return data
  } catch (err) {
    console.log(err)
    return err
  }
}

async function updateItem(item) {
  try {
    const data = await docClient.update(item).promise()
    return data
  } catch (err) {
    console.log(err)
    return err
  }
}

async function updateQuestionCurationResults(question, questionForm, tasks) {
  try {
    var queryTasks = {
      KeyConditionExpression: 'questionID = :questionID',
      ExpressionAttributeValues: {
        ':questionID': { 'S': question.id }
      },
      TableName: annotationTaskTable
    };

    let groupedTasks = groupTasksByDocument(tasks)
    console.log(groupedTasks)
    let result = calculateAllFleissKappa(
      groupAnswers(questionForm.questions, groupedTasks)
    )

    const updatedQuestion = {
      TableName: medicalQuestionTable,
      Key: {
        "id": question.id
      },
      UpdateExpression: "set aggregatedAnswers = :aggregatedAnswers, interannotatorAgreement = :interannotatorAgreement",
      ExpressionAttributeValues: {
        ":aggregatedAnswers": JSON.stringify(result["aggregatedBarData"]),
        ":interannotatorAgreement": JSON.stringify(result["kappaValues"])
      }
    }

    await updateItem(updatedQuestion)

    return {
      id: question.id,
      interannotatorAgreement: JSON.stringify(result["kappaValues"]),
      aggregatedAnswers: JSON.stringify(result["aggregatedBarData"])

    }
  } catch (err) {
    console.log(err)
    return err
  }



}

///////////Inter annotator calculation functions

const numAnnotators = 2;

//questions is questionForm data item
//grouped_tasks is list of task data items grouped by document title
const groupAnswers = (questions, grouped_tasks) => {
  console.log("groupAnswers tasks")
  console.log(grouped_tasks)
  //groups answers into form :
  // {
  //     "category 1": [
  //         {
  //             "option1": 0, //for document 1
  //             "option2": 2,
  //             "option3": 0
  //         },
  //         {
  //             "option1": 2, //for document 2
  //             "option2": 0,
  //             "option3": 0
  //         }
  //     ],
  //      "category 2": [
  //         {
  //             "option1": 0, //for document 1
  //             "option2": 2,
  //             "option3": 0
  //         },
  //         {
  //             "option1": 2, //for document 2
  //             "option2": 0,
  //             "option3": 0
  //         }
  //]
  // }
  let answerObj = {}
  for (let i = 0; i < questions.length; i++) {

    answerObj[questions[i].question_description] = []
    for (let j = 0; j < grouped_tasks.length; j++) {// per document
      let tempOptions = {}
      questions[i].options.forEach(item => {
        tempOptions[item] = 0;
      })
      let totalAnnotations = 0

      for (let k = 0; k < grouped_tasks[j].length; k++) { //per task
        let taskAnswers = grouped_tasks[j][k].question_answers

        console.log("taskAnswer", taskAnswers)
        if (totalAnnotations == numAnnotators) {
          break;
        }
        if (taskAnswers == null) {
          continue;
        }
        for (const [key, value] of Object.entries(taskAnswers)) {
          console.log("taskAnswers", key, value)
          if (value in tempOptions) {
            tempOptions[value]++;
            totalAnnotations++;
          }

        }
      }
      answerObj[questions[i].question_description].push(tempOptions)
    }
  }

  console.log("answerObj", answerObj)

  return answerObj
}


const calculateAllFleissKappa = (results, tasks) => {
  let kappaValues = {}
  let aggregatedBarData = []

  for (const [key, value] of Object.entries(results)) {
    let result = calculateFleissKappa(key, value, tasks)
    kappaValues[key] = result["kappaValue"]
    aggregatedBarData.push(result["aggregatedCategoryData"])

  }

  console.log("calculateallFleissKappa", kappaValues, aggregatedBarData)

  return {
    "aggregatedBarData": aggregatedBarData,
    "kappaValues": kappaValues
  }

}

const calculateFleissKappa = (category, values, tasks) => {
  //calculates fleiss kappa values and aggregates annotator answer choices

  //values is list of objects of form:
  // {
  //     "option1": 1,
  //     "option2": 0
  // }

  //tasks is annotation tasks grouped by document

  console.log("Values", values)
  let tempBarData = [];

  var numInstances = values.length;

  let I = []
  let P = []

  let resultTotals = {}
  Object.keys(values[0]).map(result => {
    resultTotals[result] = 0;
  })
  console.log("results", resultTotals)

  for (let i = 0; i < values.length; i++) {
    let temp = 0
    let singleCategory = false;

    let numAnnotationsForInstance = 0;
    for (const [key, value] of Object.entries(values[i])) {
      numAnnotationsForInstance += value;
    }

    console.log("numAnnotationsForInstance", numAnnotationsForInstance)

    if (numAnnotationsForInstance < numAnnotators) {
      numInstances -= 1;
      continue
    }


    for (const [key, value] of Object.entries(values[i])) {
      resultTotals[key] += value;
      if (value >= numAnnotators) {
        //if all required annotators voted for the same category,
        //Pi value is one
        singleCategory = true
        I.push(1)
        continue;
      }
      temp += (value * value);



    }
    if (singleCategory) {
      continue;
    }
    let multiplier = 1 / (numAnnotators * (numAnnotators - 1))
    temp = multiplier * (temp - numAnnotators)
    I.push(temp)
  }

  console.log("numInstances", numInstances)

  let numAnnotations = numAnnotators * numInstances

  console.log("I", I)
  console.log("resultTotals", resultTotals)

  let aggregatedCategoryData = {
    ...resultTotals,
    "category": category
  }
  if (numInstances === 0) {
    return {
      "kappaValue": "Incomplete Data",
      "aggregatedCategoryData": aggregatedCategoryData
    }
  }

  var actualAnnotation = 0

  for (const [key, value] of Object.entries(aggregatedCategoryData)) {
    if (key !== "category") {
      actualAnnotation += aggregatedCategoryData
    }
  }

  let P_e_mean = 0
  for (const [key, value] of Object.entries(resultTotals)) {
    let temp = value / numAnnotations;
    P_e_mean += temp * temp;

  }
  console.log("pemean", P_e_mean)

  let tempTot = I.reduce((partialSum, a) => partialSum + a, 0);

  let Pmean = tempTot / numInstances

  console.log("pmean", Pmean)

  let kappa = (Pmean - P_e_mean) / (1 - P_e_mean);

  if ((numInstances < (values.length)) && !kappa) {
    return {
      "kappaValue": "-1 (Incomplete Data)",
      "aggregatedCategoryData": aggregatedCategoryData
    }
  }

  if (numInstances < (values.length) && kappa) {
    return {
      "kappaValue": kappa.toFixed(3) + " (Incomplete Data)",
      "aggregatedCategoryData": aggregatedCategoryData
    }
  }
  if (!kappa) {
    return {
      "kappaValue": "-1 (Poor Agreement)",
      "aggregatedCategoryData": aggregatedCategoryData
    }
  }
  return {
    "kappaValue": kappa.toFixed(3),
    "aggregatedCategoryData": aggregatedCategoryData
  }


}

const groupTasksByDocument = (tasks) => {
  console.log("tasks to group", tasks);
  let finalGroupedTasks = [];

  for (let i = 0; i < tasks.length; i++) {
    let duplicateDocument = false;
    for (let j = 0; j < finalGroupedTasks.length; j++) {
      if (finalGroupedTasks[j][0].document_title == tasks[i].document_title) {
        duplicateDocument = true
      }
    }

    if (!duplicateDocument) {
      let groupedTasks = tasks.filter(task => task.document_title == tasks[i].document_title)
      finalGroupedTasks.push(groupedTasks)
    }


  }
  return finalGroupedTasks
}
