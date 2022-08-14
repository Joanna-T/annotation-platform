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
// exports.handler = event => {
//   console.log(`EVENT: ${JSON.stringify(event)}`);
//   event.Records.forEach(record => {
//     console.log(record.eventID);
//     console.log(record.eventName);
//     console.log('DynamoDB Record: %j', record.dynamodb);
//   });
//   return Promise.resolve('Successfully processed DynamoDB record');
// };
const region = process.env.REGION
console.log('Loading function');
const AWS = require("aws-sdk");
AWS.config.update({ region: region });
const docClient = new AWS.DynamoDB.DocumentClient();
const dynamodb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });
//import {calculateAllFleissKappa, groupTasksByDocument, groupAnswers} from "curationMetricUtils.js"
const endpointID = process.env.API_ANNOTATIONPLATFORM_GRAPHQLAPIIDOUTPUT
const environment = process.env.ENV
const annotationTaskTable = `AnnotationTask-${endpointID}-${environment}`
const medicalQuestionTable = `MedicalQuestion-${endpointID}-${environment}`
const questionFormTable = `QuestionForm-${endpointID}-${environment}`
exports.handler = async (event) => {
  //console.log('Received event:', JSON.stringify(event, null, 2));

  for (const record of event.Records) {
    //const newImages = event.Records.map(
    //    (record) => AWS.DynamoDB.Converter.unmarshall(record.dynamodb.NewImage)
    //);
    const newImage = AWS.DynamoDB.Converter.unmarshall(record.dynamodb.NewImage)
    //console.log(newImages);
    console.log(record.eventID);
    console.log(record.eventName);
    console.log('DynamoDB Record: %j', record.dynamodb);
    //let taskID = record.dynamodb.Keys.id.S
    //console.log('DynamoDB Record: %j', record.dynamodb.NewImage.questionID);
    //let medicalQuestionID = record.dynamodb.NewImage.questionID.S
    //let questionFormID = record.dynamodb.NewImage.questionFormID.S
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
        console.log("getItem executed")
        //return {
        //    "body": JSON.stringify(result)
        //}
        console.log("medicalQuestion", result.Items[0].question_answers)
      })
      .catch(error => console.log(error))

    await Promise.all([getItem(medicalQuestion), getItem(questionForm), getItems(queryTasks)])
      .then(async results => {
        console.log(results)
        //const newResults = results.map(
        //(result) => {
        //    if (result.Item) {
        //        return AWS.DynamoDB.Converter.unmarshall(result.Item)
        //    }
        //    else if (result.Items) {
        //        return AWS.DynamoDB.Converter.unmarshall(result.Items)
        //    }
        //}
        //);
        const newTasks = results[2].Items.map(
          (result) => AWS.DynamoDB.Converter.unmarshall(result)
        );
        console.log("New results")
        //console.log(newResults)
        console.log(newTasks)
        const convertedTasks = AWS.DynamoDB.Converter.unmarshall(results[2].Items)
        console.log(convertedTasks)
        //await updateQuestionCurationResults(newResults[0], newResults[1], newResults[2])
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
    //console.log(data)
    return data
  } catch (err) {
    console.log(err)
    return err
  }
}


async function getItem(item) {
  console.log("getItem")
  //return await docClient.get(item).promise()
  try {
    const data = await docClient.get(item).promise()
    //console.log(data)
    return data
  } catch (err) {
    console.log(err)
    return err
  }
}

async function updateItem(item) {
  console.log("getItem")
  //return await docClient.get(item).promise()
  try {
    const data = await docClient.update(item).promise()
    //console.log(data)
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

    //await dynamodb.query(queryTasks).promise()
    //.then(result => console.log(result))

    //console.log(data)
    //console.log()
    //var formattedTasks = tasks.map(task => ({ 
    //    document_title: task.document_title.S,
    //    question_answers: task.question_answers.M 
    //}));

    let groupedTasks = groupTasksByDocument(tasks)
    console.log(groupedTasks)
    let result = calculateAllFleissKappa(
      groupAnswers(questionForm.questions, groupedTasks)
    )
    console.log("this is the final result")
    console.log(result["aggregatedBarData"])
    console.log(result["kappaValues"])


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
    //await docClient.update(updatedQuestion, function(err, data) {
    //    if (err){
    //        console.log(err);
    //    }
    //    else {  
    //        console.log("data submitted")
    //        console.log(data);
    //    }
    //})

    return {
      id: question.id,
      interannotatorAgreement: result["kappaValues"],
      aggregatedAnswers: result["aggregatedBarData"]

    }
  } catch (err) {
    console.log(err)
    return err
  }


  //updateQuestion(questionUpdate)
}

////////////PUT INTO SEPARATE FILE

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
      console.log(tempOptions)
      questions[i].options.forEach(item => {
        //console.log("item", item)
        tempOptions[item] = 0;
      })
      let totalAnnotations = 0
      //console.log("options",i, tempOptions)
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
          console.log("pairs", key, value)
          if (value in tempOptions) {
            tempOptions[value]++;
            totalAnnotations++;
          }
          //tempOptions[value]++;
        }
      }
      answerObj[questions[i].question_description].push(tempOptions)
    }
  }

  console.log("answerObj", answerObj)
  //setGroupedAnswers(answerObj)
  return answerObj
}


const calculateAllFleissKappa = (results, tasks) => {
  let kappaValues = {}
  let aggregatedBarData = []

  for (const [key, value] of Object.entries(results)) {
    let result = calculateFleissKappa(key, value, tasks)
    kappaValues[key] = result["kappaValue"]
    aggregatedBarData.push(result["aggregatedCategoryData"])
    //kappaValues[key] = calculateFleissKappa(key, value, tasks)
  }

  console.log("calculateallFleissKappa", kappaValues, aggregatedBarData)

  return {
    "aggregatedBarData": aggregatedBarData,
    "kappaValues": kappaValues
  }
  // setAggregatedBarData(aggregatedBarData)
  // setFleissKappa(kappaValues)
}

const calculateFleissKappa = (category, values, tasks) => {
  //calculates fleiss kappa values and aggregates annotator answer choices

  //values is list of objects of form:
  // {
  //     "option1": 1,
  //     "option2": 0
  // }

  //tasks is annotation tasks grouped by document
  // let values = [
  //     {"1": 0, "2": 0, "3": 0,"4": 0, "5": 14},
  //     {"1": 0, "2": 2, "3": 6,"4": 4, "5": 2},
  //     {"1": 0, "2": 0, "3": 3,"4": 5, "5": 6},
  //     {"1": 0, "2": 3, "3": 9,"4": 2, "5": 0},
  //     {"1": 2, "2": 2, "3": 8,"4": 1, "5": 1},
  //     {"1": 7, "2": 7, "3": 0,"4": 0, "5": 0},
  //     {"1": 3, "2": 2, "3": 6,"4": 3, "5": 0},
  //     {"1": 2, "2": 5, "3": 3,"4": 2, "5": 2},
  //     {"1": 6, "2": 5, "3": 2,"4": 1, "5": 0},
  //     {"1": 0, "2": 2, "3": 2,"4": 3, "5": 7}

  // ]
  //console.log("fliss",tasks)
  console.log("values________", values)
  let tempBarData = [];

  var numInstances = values.length;

  let I = []
  let P = []

  let resultTotals = {}
  Object.keys(values[0]).map(result => {
    resultTotals[result] = 0;
  })
  console.log("resulttsl", resultTotals)

  for (let i = 0; i < values.length; i++) {
    let temp = 0
    let singleCategory = false;

    let numAnnotationsForInstance = 0;
    for (const [key, value] of Object.entries(values[i])) {
      numAnnotationsForInstance += value;
    }

    console.log("NUMANNOTATIONSFORINSTANCE", numAnnotationsForInstance)

    if (numAnnotationsForInstance < numAnnotators) {
      console.log("DECREMENTING INSTANCES ")
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

  console.log("NUMINSTANCES", numInstances)

  let numAnnotations = numAnnotators * numInstances

  console.log("I", I)
  console.log("results", resultTotals)

  //setAggregatedBarData(state => [...state, {...resultTotals, "category": category}]);
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
  //let Pmean = tempTot / tasks.length;
  let Pmean = tempTot / numInstances

  console.log("pmean", Pmean)

  let kappa = (Pmean - P_e_mean) / (1 - P_e_mean);

  if (!kappa) {
    return 0;
  }
  // if (kappa < 0) {
  //     return "-"
  // }
  if (numInstances < (values.length)) {
    return {
      "kappaValue": kappa.toFixed(3) + "(Incomplete Data)",
      "aggregatedCategoryData": aggregatedCategoryData
    }
  }
  return {
    "kappaValue": kappa.toFixed(3),
    "aggregatedCategoryData": aggregatedCategoryData
  }


}

const groupTasksByDocument = (tasks) => {
  console.log("these are tasks", tasks);
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
