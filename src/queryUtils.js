import { API, Storage, Amplify, Auth } from "aws-amplify";
import { listMedicalQuestions, getMedicalQuestion } from "./graphql/queries";

let nextToken;

export async function listCurators(limit){
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
