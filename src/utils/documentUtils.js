import { listCurators } from "./queryUtils";
import { submitTask } from "./mutationUtils";

//returns arrays of tasks grouped by document
export const groupTasksByDocument = (tasks) => {
    //console.log("groupTasksByDocument", tasks);
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

}

//Find number of completed annotation questions
export const findCompletedTasks = (groupedInputTasks) => {
    var completedTasks = 0
    const curatorNum = process.env.REACT_APP_NUMBER_CURATORS

    //console.log("findCompletedtasks", groupedInputTasks)

    for (let i = 0; i < groupedInputTasks.length; i++) {
        let numCompletedTasks = groupedInputTasks[i].filter(item => item.completed === true).length;
        if (numCompletedTasks >= curatorNum) {
            completedTasks++;
        }
    }
    return completedTasks;
}

//creates and submits reassigned tasks
export async function createReassignedTasks(groupedTasks) {

    //console.log("createReassignedTasks", groupedTasks)

    const minimumRequiredCurators = process.env.REACT_APP_NUMBER_CURATORS
    let newTasks = []
    let errorMessage = ""
    await listCurators()
        .then(async curatorList => {

            //console.log("curatorList", curatorList)
            for (let i = 0; i < groupedTasks.length; i++) {
                //console.log(i, groupedTasks[i])
                let numRequiredReassignments
                let numCompletedTasks = groupedTasks[i].filter(tasks => tasks.completed === true).length;

                if (numCompletedTasks < minimumRequiredCurators) {
                    numRequiredReassignments = minimumRequiredCurators - numCompletedTasks;
                }
                else {
                    continue;
                }
                let currentCurators = groupedTasks[i].map(item => item.owner);
                let possibleCurators = curatorList.filter(curator => !currentCurators.includes(curator))
                //console.log("possible curators", possibleCurators)

                if (possibleCurators < numRequiredReassignments) {
                    throw "Insufficient curators to reassign tasks"

                }
                for (let j = 0; j < numRequiredReassignments; j++) {
                    //console.log(groupedTasks[i])
                    //console.log(groupedTasks[i][0])
                    let newTask = {
                        owner: possibleCurators[j],
                        document_title: groupedTasks[i][0].document_title,
                        questionID: groupedTasks[i][0].questionID,
                        questionFormID: groupedTasks[i][0].questionFormID,
                        completed: false,
                        labels: "[]"

                    }
                    newTasks.push(newTask)

                }
            }

            newTasks.forEach(async (task) => { await submitTask(task, "AMAZON_COGNITO_USER_POOLS") })
            //console.log("New tasks for reassigned tasks", newTasks)
            return newTasks
        })
        .catch(err => {
            errorMessage = err
        })

    return errorMessage

}

export const parseDocumentContents = (string) => {

    var lines = string.split('\n');

    var titleIndex = lines.findIndex(element => element.includes("# Title"))
    var title = lines[titleIndex + 2]

    var abstractIndex = lines.findIndex(element => element.includes("# Abstract"))
    var abstract = lines[abstractIndex + 2]

    var mainTextIndex = lines.findIndex(element => element.includes("# Main text"))
    var mainText = lines.slice(mainTextIndex + 2)
    var joinedMainText = mainText.join('\n')

    return {
        title: title,
        abstract: abstract,
        mainText: joinedMainText
    }

}



export const returnActiveQuestions = (result) => {
    let questionsArray = []
    result.forEach(item => {
        //console.log("activetasks for question", item, item.tasks)
        let groupedTasks = groupTasksByDocument(item.tasks.items);
        let completedTasks = findCompletedTasks(groupedTasks)
        if (completedTasks < groupedTasks.length) { //length of grouped tasks is number of documents
            item["total_tasks"] = groupedTasks.length;
            item["complete_tasks"] = completedTasks
            questionsArray.push(item)
        }
    })
    return questionsArray
}

export const returnCompletedQuestions = (result) => {
    let questionsArray = []
    result.forEach(item => {
        let groupedTasks = groupTasksByDocument(item.tasks.items);
        let completedTasks = findCompletedTasks(groupedTasks)
        if (completedTasks === groupedTasks.length) {
            item["total_tasks"] = groupedTasks.length;
            item["complete_tasks"] = completedTasks
            questionsArray.push(item)
        }
    })

    return questionsArray
}