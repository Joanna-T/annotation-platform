import { API, Storage, Auth } from "aws-amplify";
import {
  listMedicalQuestions,
  getMedicalQuestion,
  listAnnotationTasks,
  getAnnotationTask,
  listQuestionForms,
  getQuestionForm,
  listQuestionSuggestions
} from "../graphql/queries";
import { parseDocumentContents } from "./documentUtils"

let nextToken;

export async function listCurators() {
  let apiName = 'AdminQueries';
  let path = '/listUsersInGroup';
  let myInit = {
    queryStringParameters: {
      "groupname": "Curators",
      "token": nextToken
    },
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
    }
  }
  const { NextToken, ...rest } = await API.get(apiName, path, myInit);
  nextToken = NextToken;
  let users = [];
  rest.Users.map(user => users.push(user.Username))

  return users;
}

export async function fetchSuggestions(authMethod) {
  if (!authMethod) {
    authMethod = "AMAZON_COGNITO_USER_POOLS"
  }
  const suggestionsData = await API.graphql({
    query: listQuestionSuggestions,
    authMode: authMethod

  })

  return suggestionsData.data.listQuestionSuggestions.items

}

export async function fetchQuestions(authMethod) {
  if (!authMethod) {
    authMethod = "AMAZON_COGNITO_USER_POOLS"
  }
  const questionsData = await API.graphql({
    query: listMedicalQuestions,
    authMode: authMethod

  })

  return questionsData.data.listMedicalQuestions.items

}

export async function fetchTasks() {
  const taskData = await API.graphql({
    query: listAnnotationTasks,
    authMode: "AMAZON_COGNITO_USER_POOLS"

  })

  return taskData.data.listAnnotationTasks.items


}

export async function fetchTask(taskId) {
  const taskData = await API.graphql({
    query: getAnnotationTask,
    variables: { id: taskId },
    authMode: "AMAZON_COGNITO_USER_POOLS"
  })

  return taskData.data.getAnnotationTask;

}


export async function fetchDocument(documentTitle) {

  const text = await Storage.get(documentTitle, { download: true });

  const finalString = await text.Body.text();

  const formattedText = parseDocumentContents(finalString)

  return formattedText

}

export async function fetchQuestionForms() {
  const formsData = await API.graphql({
    query: listQuestionForms,
    authMode: "AMAZON_COGNITO_USER_POOLS"

  })

  return formsData.data.listQuestionForms.items
}


export async function fetchQuestion(questionId, authMethod) {
  if (!authMethod) {
    authMethod = "AMAZON_COGNITO_USER_POOL"
  }
  const questionData = await API.graphql({
    query: getMedicalQuestion,
    variables: { id: questionId },
    authMode: authMethod
  })

  return questionData.data.getMedicalQuestion
}

export async function fetchQuestionForm(questionFormId, authMethod) {
  if (!authMethod) {
    authMethod = "AMAZON_COGNITO_USER_POOL"
  }
  const formData = await API.graphql({
    query: getQuestionForm,
    variables: { id: questionFormId },
    authMode: authMethod,
  })

  return formData.data.getQuestionForm
}

export async function getTaskDocumentTitles(tasks) {
  let taskDocumentTitles = {}
  await Promise.all(tasks.map(async task => {
    let formattedString = await fetchDocument(task.documentFileName)
    taskDocumentTitles[task.id] = formattedString["title"]
  }))
  return taskDocumentTitles
}