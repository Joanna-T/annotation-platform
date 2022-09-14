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

    var deletedTask

    try {
        deletedTask = await API.graphql({
            query: deleteAnnotationTask,
            variables: {
                input: deleteObj
            },
            authMode: authMethod
        })
    } catch (err) {
        console.log(err)
    }

    return deletedTask

}

export async function deleteQuestion(questionID, authMethod) {
    if (!authMethod) {
        authMethod = "AMAZON_COGNITO_USER_POOLS"
    }
    let deleteObj = {
        id: questionID
    }

    var deletedQuestion
    try {
        deletedQuestion = await API.graphql({
            query: deleteMedicalQuestion,
            variables: {
                input: deleteObj
            },
            authMode: authMethod
        })
    } catch (err) {
        console.log(err)
    }

    return deletedQuestion

}

export async function deleteSuggestion(suggestionID, authMethod) {
    if (!authMethod) {
        authMethod = "AMAZON_COGNITO_USER_POOLS"
    }
    let deleteObj = {
        id: suggestionID
    }

    var deletedSuggestion
    try {
        deletedSuggestion = await API.graphql({
            query: deleteQuestionSuggestions,
            variables: {
                input: deleteObj
            },
            authMode: authMethod
        })
    } catch (err) {
        console.log(err)
    }

    return deletedSuggestion

}

export async function submitSuggestion(suggestion, authMethod) {
    if (!authMethod) {
        authMethod = "AMAZON_COGNITO_USER_POOLS"
    }

    var submittedSuggestion

    try {
        submittedSuggestion = await API.graphql({
            query: createQuestionSuggestions,
            variables: {
                input: suggestion
            },
            authMode: authMethod
        })
    } catch (err) {
        console.log(err)
    }

    return submittedSuggestion

}

export async function submitTask(task, authMethod) {
    if (!authMethod) {
        authMethod = "AMAZON_COGNITO_USER_POOLS"
    }

    var createdTask
    try {
        createdTask = await API.graphql({
            query: createAnnotationTask,
            variables: {
                input: task
            },
            authMode: authMethod
        })
    } catch (err) {
        console.log(err)
    }

    return createdTask

}

export async function submitForm(form, authMethod) {
    if (!authMethod) {
        authMethod = "AMAZON_COGNITO_USER_POOLS"
    }

    var createdForm
    try {
        createdForm = await API.graphql({
            query: createQuestionForm,
            variables: {
                input: form
            },
            authMode: authMethod
        })
    } catch (err) {
        console.log(err)
    }

    return createdForm

}

export async function updateTask(inputTask) {

    try {
        await API.graphql({
            query: updateAnnotationTask,
            variables: {
                input: inputTask
            },
            authMode: "AMAZON_COGNITO_USER_POOLS"
        })
    } catch (err) {
        console.log(err)
    }
}

export async function submitQuestion(question, authMethod) {
    if (!authMethod) {
        authMethod = "AMAZON_COGNITO_USER_POOLS"
    }

    var createdQuestion
    try {
        createdQuestion = await API.graphql({
            query: createMedicalQuestion,
            variables: {
                input: question
            },
            authMode: authMethod
        })
    } catch (err) {
        console.log(err)
    }

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

