import { useEffect, useState } from "react";
import { API, Storage } from "aws-amplify";
import { getQuestionForm } from "./graphql/queries";

const InterannotatorAgreement = ({grouped_tasks}) => {
    const [groupedAnswers, setGroupedAnswers] = useState([]);
    const [questionForm, setQuestionForm] = useState(null);
    const [fleissKappa, setFleissKappa] = useState()

    const numAnnotators = 14;

    useEffect(() => {
        console.log("grouped_tasks", grouped_tasks)
        fetchQuestionForm()
        .then(result => {
            let answers =  groupAnswers(JSON.parse(result.questions))
            calculateAllFleissKappa(answers, grouped_tasks)
        })
    }, [grouped_tasks])

    async function fetchQuestionForm() {
        const form = await API.graphql({
            query: getQuestionForm,
            variables: { id: grouped_tasks[0][0].questionFormID },
            authMode: "AMAZON_COGNITO_USER_POOLS"
        })
        console.log(form);
        setQuestionForm(form.data.getQuestionForm);
        return form.data.getQuestionForm
      }

    const groupAnswers = (questions) => {
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
                    console.log("taskAnswers", taskAnswers)

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

        console.log("asnwerObj", answerObj)
        setGroupedAnswers(answerObj)
        return answerObj
    }

    const calculateAllFleissKappa  = (results, tasks) => {
        let kappaValues = {

        }

        for (const [key,value] of Object.entries(results)) {
            kappaValues[key] = calculateFleissKappa(value, tasks)
        }

        console.log(kappaValues)
    }

    const calculateFleissKappa = (values1, tasks1) => {
        //values is list of objects of form:
        // {
        //     "option1": 1,
        //     "option2": 0
        // }
        //tasks is annotation tasks grouped by document

        let values = [
            {"1": 0, "2": 0, "3": 0,"4": 0, "5": 14},
            {"1": 0, "2": 2, "3": 6,"4": 4, "5": 2},
            {"1": 0, "2": 0, "3": 3,"4": 5, "5": 6},
            {"1": 0, "2": 3, "3": 9,"4": 2, "5": 0},
            {"1": 2, "2": 2, "3": 8,"4": 1, "5": 1},
            {"1": 7, "2": 7, "3": 0,"4": 0, "5": 0},
            {"1": 3, "2": 2, "3": 6,"4": 3, "5": 0},
            {"1": 2, "2": 5, "3": 3,"4": 2, "5": 2},
            {"1": 6, "2": 5, "3": 2,"4": 1, "5": 0},
            {"1": 0, "2": 2, "3": 2,"4": 3, "5": 7}

        ]
        //console.log("fliss",tasks)
        console.log(values)

        

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

        let P_e_mean = 0
        for ( const [key, value] of Object.entries(resultTotals)) {
            let temp = value / numAnnotations;
            P_e_mean += temp * temp;

        }
        console.log("pemean", P_e_mean)

        let tempTot = I.reduce((partialSum, a) => partialSum + a, 0);
        //let Pmean = tempTot / tasks.length;
        let Pmean = tempTot / values.length

        console.log("pmean", Pmean)

        let kappa = (Pmean - P_e_mean)/(1 - P_e_mean);

        if (!kappa) {
            return 0;
        }
        return kappa


    }


    return ( 
        <div>Interannotator agreement</div>
     );
}
 
export default InterannotatorAgreement;