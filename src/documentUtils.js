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