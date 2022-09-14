import { API } from "aws-amplify";
import {
    createAnnotationTask,
    updateAnnotationTask,
    createMedicalQuestion,
    updateMedicalQuestion,
    createQuestionSuggestions,
    deleteQuestionSuggestions,
    deleteMedicalQuestion,
    deleteAnnotationTask,
    createQuestionForm
} from "../graphql/mutations";

export async function deleteTask(taskID, authMethod) {
    if (!authMethod) {
        authMethod = "AMAZON_COGNITO_USER_POOLS"
    }
    let deleteObj = {
        id: taskID
    }

    let deletedTask = await API.graphql({
        query: deleteAnnotationTask,
        variables: {
            input: deleteObj
        },
        authMode: authMethod
    })

    return deletedTask

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

    return deletedQuestion

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

    return deletedSuggestion

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

    return submittedSuggestion

}

export async function submitTask(task, authMethod) {
    if (!authMethod) {
        authMethod = "AMAZON_COGNITO_USER_POOLS"
    }
    let createdTask = await API.graphql({
        query: createAnnotationTask,
        variables: {
            input: task
        },
        authMode: authMethod
    })

    return createdTask

}

export async function submitForm(form, authMethod) {
    if (!authMethod) {
        authMethod = "AMAZON_COGNITO_USER_POOLS"
    }
    let createdForm = await API.graphql({
        query: createQuestionForm,
        variables: {
            input: form
        },
        authMode: authMethod
    })

    return createdForm

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

    const createdQuestion = await API.graphql({
        query: createMedicalQuestion,
        variables: {
            input: question
        },
        authMode: authMethod
    })

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

