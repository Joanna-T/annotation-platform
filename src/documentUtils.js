import { listCurators } from "./queryUtils";
//import * as queryUtils from "./queryUtils"

export const groupTasksByDocument = (tasks) => {
    console.log("these are tasks",tasks);
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

return finalGroupedTasks;

// let tempGroupedTasks = tasks.group(({document_title}) => document_title)
// for (var item in tempGroupedTasks) {
//     finalGroupedTasks.push(tempGroupedTasks[item])
// }
//console.log("final grouped tasks", finalGroupedTasks)
//setGroupedTasks(finalGroupedTasks);

}
export const findCompletedTasks = (groupedInputTasks, curatorNum) => {
    let completedTasks = 0
    // tasks.forEach((item, index) => {
    //     let numCompletedTasks = item.filter(task => task.completed === true).length;
    //     if (numCompletedTasks >= minimumRequiredCurators) {
    //         completedTasks++;
    //     }
    // })

    //let groupedInputTasks = allQuestionTasks[questionID];
    console.log("findCompletedtasks", groupedInputTasks)

    for (let i = 0; i < groupedInputTasks.length; i++) {
        let numCompletedTasks = groupedInputTasks[i].filter(item => item.completed === true).length;
        if (numCompletedTasks >= curatorNum) {
            completedTasks++;
        }
    }
    return completedTasks;
} 


export async function createReassignedTasks(groupedTasks ) {
    console.log("createReassignedTasks", groupedTasks)
    const minimumRequiredCurators = process.env.REACT_APP_NUMBER_CURATORS
    let newTasks = []
    //queryUtils.listCurators().then(curatorList => {
    listCurators().then(curatorList => {
    //queryUtils.listCurators().then(curatorList => {
            console.log("curatorList", curatorList)
            for (let i = 0; i < groupedTasks.length; i++) {
                console.log(i, groupedTasks[i])
                let numRequiredReassignments 
                let numCompletedTasks = groupedTasks[i].filter(tasks =>tasks.completed === true).length;

                if (numCompletedTasks < minimumRequiredCurators) {
                    numRequiredReassignments = minimumRequiredCurators - numCompletedTasks;
                }
                else {
                    continue;
                }
                let currentCurators = groupedTasks[i].map(item => item.owner);
                let possibleCurators = curatorList.filter(curator => !currentCurators.includes(curator))
                
                if ( possibleCurators < numRequiredReassignments) {
                    console.log("insufficient curators")
                    console.log(groupedTasks[i][0].document_title,
                        groupedTasks[i][0].questionID,
                        groupedTasks[i][0].questionFormID,
                        possibleCurators)
                }
                for (let j = 0; j < numRequiredReassignments; j++) {
                    console.log(groupedTasks[i])
                    console.log(groupedTasks[i][0])
                    newTasks.push({
                        owner: possibleCurators[j],
                        document_title: groupedTasks[i][0].document_title,
                        questionID: groupedTasks[i][0].questionID,
                        questionFormID: groupedTasks[i][0].questionFormID

                    })

                    // submitTask({
                    //     owner: possibleCurators[j],
                    //     document_title: groupedTasks[i][0].document_title,
                    //     questionID: groupedTasks[i][0].questionID,
                    //     questionFormID: groupedTasks[i][0].questionFormID

                    // })

                }


            }
        
    })
    console.log("newTasks", newTasks)

    return newTasks

}