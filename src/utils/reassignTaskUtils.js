import { listCurators } from "./queryUtils"
import { submitTask } from "./mutationUtils"

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
                        documentTitle: groupedTasks[i][0].documentTitle,
                        documentFileName: groupedTasks[i][0].documentFileName,
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