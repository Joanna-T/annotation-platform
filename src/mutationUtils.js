import { API, Storage, Amplify, Auth } from "aws-amplify";
import { createAnnotationTask,updateAnnotationTask } from "./graphql/mutations";

export async function submitTask(task) {
    let createdTasks = await API.graphql({
      query: createAnnotationTask,
      variables: {
          input: task
      },
      authMode: "AMAZON_COGNITO_USER_POOLS"
  })
    console.log("this is the final submitted task", createdTasks)
  
}

export async function updateTask(inputTask) {
    await API.graphql({
        query: updateAnnotationTask,
        variables: {
            input: inputTask
        },
        authMode: "AMAZON_COGNITO_USER_POOLS"
    })
}