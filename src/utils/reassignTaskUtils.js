import { listCurators } from "./queryUtils"
import { submitTask } from "./mutationUtils"

//creates and submits reassigned tasks
export async function createReassignedTasks(groupedTasks) {

    const minimumRequiredCurators = process.env.REACT_APP_NUMBER_CURATORS
    let newTasks = []
    let curatorList = await listCurators()

    for (let i = 0; i < groupedTasks.length; i++) {

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

        if (possibleCurators < numRequiredReassignments) {
            throw new Error("Insufficient curators to reassign tasks")

        }
        for (let j = 0; j < numRequiredReassignments; j++) {

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

    return newTasks

}