import { API, Storage, Amplify, Auth } from "aws-amplify";
import { createAnnotationTask,
         updateAnnotationTask,
         createMedicalQuestion } from "./graphql/mutations";

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

export async function submitQuestion(question) {
    const questionObj = {
      text: question
    }
  
    const createdQuestion  = await API.graphql({
      query: createMedicalQuestion,
      variables: {
          input: questionObj
      },
      authMode: "AMAZON_COGNITO_USER_POOLS"
  })
    console.log("this is the created question", createdQuestion.data.createMedicalQuestion);
    return createdQuestion.data.createMedicalQuestion
  }