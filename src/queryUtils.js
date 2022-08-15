import { API, Storage, Amplify, Auth } from "aws-amplify";
import {
  listMedicalQuestions,
  getMedicalQuestion,
  listAnnotationTasks,
  getAnnotationTask,
  listQuestionForms,
  getQuestionForm
} from "./graphql/queries";
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
  console.log("curators")
  console.log(users)
  return users;
}

export async function fetchQuestions(authMethod) {
  if (!authMethod) {
    authMethod = "AMAZON_COGNITO_USER_POOLS"
  }
  const questionsData = await API.graphql({
    query: listMedicalQuestions,
    authMode: authMethod

  })
  console.log("questions", questionsData.data.listMedicalQuestions.items);
  return questionsData.data.listMedicalQuestions.items

}

export async function fetchTasks() {
  const taskData = await API.graphql({
    query: listAnnotationTasks,
    authMode: "AMAZON_COGNITO_USER_POOLS"

  })
  console.log("tasks", taskData.data.listAnnotationTasks.items);
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
  console.log("document text", text)
  const finalString = await text.Body.text();

  const formattedText = parseDocumentContents(finalString)

  return formattedText

}

export async function fetchQuestionForms() {
  const formData = await API.graphql({
    query: listQuestionForms,
    authMode: "AMAZON_COGNITO_USER_POOLS"

  })
  console.log("question forms", formData.data.listQuestionForms.items);
  return formData.data.listQuestionForms.items
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
  console.log("fetch", questionData);
  return questionData.data.getMedicalQuestion
}

export async function fetchQuestionForm(questionFormId, authMethod) {
  if (!authMethod) {
    authMethod = "AMAZON_COGNITO_USER_POOL"
  }
  const form = await API.graphql({
    query: getQuestionForm,
    variables: { id: questionFormId },
    authMode: authMethod
  })
  console.log("setQuestionForm", form.data.getQuestionForm);
  return form.data.getQuestionForm
}

export async function getTaskDocumentTitles(tasks) {
  let taskDocumentTitles = {}
  await Promise.all(tasks.map(async task => {
    let formattedString = await fetchDocument(task.document_title)
    taskDocumentTitles[task.id] = formattedString["title"]
  }))
  return taskDocumentTitles
}