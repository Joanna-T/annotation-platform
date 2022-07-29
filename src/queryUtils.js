import { API, Storage, Amplify, Auth } from "aws-amplify";
import { listMedicalQuestions, getMedicalQuestion,listAnnotationTasks, getAnnotationTask } from "./graphql/queries";

let nextToken;

export async function listCurators(){
    let apiName = 'AdminQueries';
    let path = '/listUsersInGroup';
    let myInit = { 
        queryStringParameters: {
          "groupname": "Curators",
          "token": nextToken
        },
        headers: {
          'Content-Type' : 'application/json',
          Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
        }
    }
    const { NextToken, ...rest } =  await API.get(apiName, path, myInit);
    nextToken = NextToken;
    let users = [];
    rest.Users.map(user => users.push(user.Username))
    console.log("curators")
    console.log(users)
    return users;
  }

  export async function fetchQuestions() {
    const questionsData = await API.graphql({
        query: listMedicalQuestions,
        authMode: "AMAZON_COGNITO_USER_POOLS"

    })
    console.log("questions",questionsData.data.listMedicalQuestions.items);
    //setQuestions(questionsData.data.listMedicalQuestions.items);
    return questionsData.data.listMedicalQuestions.items

}

export async function fetchTasks() {
  const taskData = await API.graphql({
      query: listAnnotationTasks,
      authMode: "AMAZON_COGNITO_USER_POOLS"

  })
  console.log("tasks",taskData.data.listAnnotationTasks.items);
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
