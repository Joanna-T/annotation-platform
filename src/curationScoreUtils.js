const numAnnotators = process.env.REACT_APP_NUMBER_CURATORS;

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
            console.log(tempOptions)
            questions[i].options.forEach(item => {
                //console.log("item", item)
                tempOptions[item] = 0;
            })
            //console.log("options",i, tempOptions)
            for (let k = 0; k < grouped_tasks[j].length; k++) {
                let taskAnswers = JSON.parse(grouped_tasks[j][k].question_answers)
                console.log("taskAnswer", taskAnswers)
                if (taskAnswers == null) {
                    continue;
                }
                for (const [key,value] of Object.entries(taskAnswers)) {
                    console.log("pairs",key,value)
                    if (value in tempOptions) {
                        tempOptions[value]++;
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


export const calculateAllFleissKappa  = (results, tasks) => {
    let kappaValues = {}
    let aggregatedBarData = []

    for (const [key,value] of Object.entries(results)) {
        let result = calculateFleissKappa(key, value, tasks)
        kappaValues[key] = result["kappaValue"]
        aggregatedBarData.push(result["aggregatedCategoryData"])
        //kappaValues[key] = calculateFleissKappa(key, value, tasks)
    }

    console.log("calculateallFleissKappa",kappaValues,aggregatedBarData)

    return {
        "aggregatedBarData": aggregatedBarData,
        "kappaValues":kappaValues
    }
    // setAggregatedBarData(aggregatedBarData)
    // setFleissKappa(kappaValues)
}

const calculateFleissKappa = (category,values, tasks) => {
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
    console.log("values________",values)
    let tempBarData = [];

    let numInstances = values.length;

    let I = []
    let P = []

    let numAnnotations = numAnnotators * values.length

    let resultTotals = {}
    Object.keys(values[0]).map(result => {
        resultTotals[result] = 0;
    })
    console.log("resulttsl", resultTotals)

    for (let i = 0; i < values.length; i++ ) {
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
        let multiplier = 1/(numAnnotators * (numAnnotators - 1))
        temp = multiplier * (temp - numAnnotators)
        I.push(temp)
    }

    console.log("I",I)
    console.log("results",resultTotals)

    //setAggregatedBarData(state => [...state, {...resultTotals, "category": category}]);
    let aggregatedCategoryData = {
        ...resultTotals,
        "category": category
    }

    let P_e_mean = 0
    for ( const [key, value] of Object.entries(resultTotals)) {
        let temp = value / numAnnotations;
        P_e_mean += temp * temp;

    }
    console.log("pemean", P_e_mean)

    let tempTot = I.reduce((partialSum, a) => partialSum + a, 0);
    //let Pmean = tempTot / tasks.length;
    let Pmean = tempTot / numInstances

    console.log("pmean", Pmean)

    let kappa = (Pmean - P_e_mean)/(1 - P_e_mean);

    if (!kappa) {
        return 0;
    }
    // if (kappa < 0) {
    //     return "-"
    // }
    return {
        "kappaValue": kappa.toFixed(3),
        "aggregatedCategoryData": aggregatedCategoryData 
    }


}