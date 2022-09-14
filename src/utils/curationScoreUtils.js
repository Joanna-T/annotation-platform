const numAnnotators = process.env.REACT_APP_NUMBER_CURATORS;

//moved to lambda function
//questions is questionForm data item
//grouped_tasks is list of task data items grouped by document title
export const groupAnswers = (questions, grouped_tasks) => {
    //groups answers into form 
    // {
    //     "category 1": [
    //         {
    //             "option1": 0,
    //             "option2": 2,
    //             "option3": 0
    //         },
    //         {
    //             "option1": 2,
    //             "option2": 0,
    //             "option3": 0
    //         }
    //     ]
    // }
    let answerObj = {}
    for (let i = 0; i < questions.length; i++) {

        answerObj[questions[i].question_description] = []
        for (let j = 0; j < grouped_tasks.length; j++) {
            let tempOptions = {}

            questions[i].options.forEach(item => {
                tempOptions[item] = 0;
            })
            for (let k = 0; k < grouped_tasks[j].length; k++) {
                let taskAnswers = JSON.parse(grouped_tasks[j][k].question_answers)

                if (taskAnswers == null) {
                    continue;
                }
                for (const [key, value] of Object.entries(taskAnswers)) {

                    if (value in tempOptions) {
                        tempOptions[value]++;
                    }
                }
            }
            answerObj[questions[i].question_description].push(tempOptions)
        }
    }


    return answerObj
}


export const calculateAllFleissKappa = (results, tasks) => {
    let kappaValues = {}
    let aggregatedBarData = []

    for (const [key, value] of Object.entries(results)) {
        let result = calculateFleissKappa(key, value, tasks)
        kappaValues[key] = result["kappaValue"]
        aggregatedBarData.push(result["aggregatedCategoryData"])
    }


    return {
        "aggregatedBarData": aggregatedBarData,
        "kappaValues": kappaValues
    }
}

const calculateFleissKappa = (category, values, tasks) => {
    //values is list of objects of form:
    // {
    //     "option1": 1,
    //     "option2": 0
    // }
    //tasks is annotation tasks grouped by document

    let tempBarData = [];

    let numInstances = values.length;

    let I = []
    let P = []

    let numAnnotations = numAnnotators * values.length

    let resultTotals = {}
    Object.keys(values[0]).map(result => {
        resultTotals[result] = 0;
    })


    for (let i = 0; i < values.length; i++) {
        let temp = 0
        let singleCategory = false;

        let numAnnotationsForInstance
        for (const [key, value] of Object.entries(values[i])) {
            numAnnotations += value;
        }

        if (numAnnotations < numAnnotators) {
            numInstances--;
            continue;
        }


        for (const [key, value] of Object.entries(values[i])) {
            resultTotals[key] += value;
            if (value >= numAnnotators) {
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


    let aggregatedCategoryData = {
        ...resultTotals,
        "category": category
    }

    let P_e_mean = 0
    for (const [key, value] of Object.entries(resultTotals)) {
        let temp = value / numAnnotations;
        P_e_mean += temp * temp;

    }


    let tempTot = I.reduce((partialSum, a) => partialSum + a, 0);
    let Pmean = tempTot / numInstances

    let kappa = (Pmean - P_e_mean) / (1 - P_e_mean);

    if (!kappa) {
        return 0;
    }

    return {
        "kappaValue": kappa.toFixed(3),
        "aggregatedCategoryData": aggregatedCategoryData
    }


}

