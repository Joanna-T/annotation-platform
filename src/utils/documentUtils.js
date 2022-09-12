import { listCurators } from "./queryUtils";
import { submitTask } from "./mutationUtils";

//returns arrays of tasks grouped by document
export const groupTasksByDocument = (tasks) => {
    //console.log("groupTasksByDocument", tasks);
    let finalGroupedTasks = [];

    for (let i = 0; i < tasks.length; i++) {
        let duplicateDocument = false;
        for (let j = 0; j < finalGroupedTasks.length; j++) {
            if (finalGroupedTasks[j][0].documentFileName == tasks[i].documentFileName) {
                duplicateDocument = true
            }
        }

        if (!duplicateDocument) {
            let groupedTasks = tasks.filter(task => task.documentFileName == tasks[i].documentFileName)
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