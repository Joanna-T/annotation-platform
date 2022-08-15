import { API } from "aws-amplify";
import {
    createAnnotationTask,
    updateAnnotationTask,
    createMedicalQuestion,
    updateMedicalQuestion
} from "./graphql/mutations";

export async function submitTask(task, authMethod) {
    if (!authMethod) {
        authMethod = "AMAZON_COGNITO_USER_POOLS"
    }
    let createdTasks = await API.graphql({
        query: createAnnotationTask,
        variables: {
            input: task
        },
        authMode: authMethod
    })
    console.log("this is the final submitted task", createdTasks)
    //return createdTasks

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

export async function submitQuestion(question, authMethod) {
    if (!authMethod) {
        authMethod = "AMAZON_COGNITO_USER_POOLS"
    }
    const questionObj = {
        text: question
    }

    const createdQuestion = await API.graphql({
        query: createMedicalQuestion,
        variables: {
            input: questionObj
        },
        authMode: authMethod
    })
    console.log("this is the created question", createdQuestion.data.createMedicalQuestion);
    return createdQuestion.data.createMedicalQuestion
}

export async function updateQuestion(inputQuestion) {
    try {
        await API.graphql({
            query: updateMedicalQuestion,
            variables: {
                input: inputQuestion
            },
            authMode: "AMAZON_COGNITO_USER_POOLS"
        })
    } catch (err) {
        console.log(err)
    }

}

