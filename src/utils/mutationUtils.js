import { API } from "aws-amplify";
import {
    createAnnotationTask,
    updateAnnotationTask,
    createMedicalQuestion,
    updateMedicalQuestion,
    createQuestionSuggestions,
    deleteQuestionSuggestions,
    deleteMedicalQuestion,
    deleteAnnotationTask
} from "../graphql/mutations";

export async function deleteTask(taskID, authMethod) {
    if (!authMethod) {
        authMethod = "AMAZON_COGNITO_USER_POOLS"
    }
    let deleteObj = {
        id: taskID
    }
    let deletedQuestion = await API.graphql({
        query: deleteAnnotationTask,
        variables: {
            input: deleteObj
        },
        authMode: authMethod
    })
    console.log("this is the final deleted question task", deletedQuestion)
    //return createdTasks

}

export async function deleteQuestion(questionID, authMethod) {
    if (!authMethod) {
        authMethod = "AMAZON_COGNITO_USER_POOLS"
    }
    let deleteObj = {
        id: questionID
    }
    let deletedQuestion = await API.graphql({
        query: deleteMedicalQuestion,
        variables: {
            input: deleteObj
        },
        authMode: authMethod
    })
    console.log("this is the final deleted question task", deletedQuestion)
    //return createdTasks

}

export async function deleteSuggestion(suggestionID, authMethod) {
    if (!authMethod) {
        authMethod = "AMAZON_COGNITO_USER_POOLS"
    }
    let deleteObj = {
        id: suggestionID
    }
    let deletedSuggestion = await API.graphql({
        query: deleteQuestionSuggestions,
        variables: {
            input: deleteObj
        },
        authMode: authMethod
    })
    console.log("this is the final submitted task", deletedSuggestion)
    //return createdTasks

}

export async function submitSuggestion(suggestion, authMethod) {
    if (!authMethod) {
        authMethod = "AMAZON_COGNITO_USER_POOLS"
    }
    let submittedSuggestion = await API.graphql({
        query: createQuestionSuggestions,
        variables: {
            input: suggestion
        },
        authMode: authMethod
    })
    console.log("this is the final submitted task", submittedSuggestion)
    //return createdTasks

}

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
    // const questionObj = {
    //     text: question
    // }

    const createdQuestion = await API.graphql({
        query: createMedicalQuestion,
        variables: {
            input: question
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

