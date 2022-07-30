import { useState, useEffect } from "react";
import { listMedicalQuestions, getMedicalQuestion } from "./graphql/queries";
import { createAnnotationTask } from "./graphql/mutations";
import { Card, Grid, Segment, Label, Button, Icon, Message, Modal } from "semantic-ui-react"; 
import { API, Storage, Amplify, Auth } from "aws-amplify";
import { groupTasksByDocument, findCompletedTasks, createReassignedTasks } from "./documentUtils";
import { listCurators, fetchQuestions } from "./queryUtils";
//import * as queryUtils from "./queryUtils"
import { submitTask } from "./mutationUtils";
import Layout from "./Layout";



const ReassignTasks = () => {
    //const [questions, setQuestions ] = useState(null);
    const [incompleteQuestions, setIncompleteQuestions] = useState(null)
    const [groupedTasks, setGroupedTasks] = useState(null);
    const [chosenQuestion, setChosenQuestion] = useState(null);
    //object with full list of incomplete questions and tasks grouped by document
    const [allQuestionTasks, setAllQuestionTasks] = useState(null);
    const [warningMessage, setWarningMessage] = useState(false)
    const [open, setOpen] = useState(false)

    const minimumRequiredCurators = 2;

    useEffect(() => {
        //queryUtils.fetchQuestions().then(result => {
        fetchQuestions().then(result => {
            findIncompleteQuestions(result);
        })
    },[])

    // useEffect(() => {
    //     if (questions) {
    //         findIncompleteQuestions();
    //     }
    // }, [questions])




    // async function fetchQuestions() {
    //     const questionsData = await API.graphql({
    //         query: listMedicalQuestions,
    //         authMode: "AMAZON_COGNITO_USER_POOLS"

    //     })
    //     console.log("questions",questionsData.data.listMedicalQuestions.items);
    //     //setQuestions(questionsData.data.listMedicalQuestions.items);
    //     return questionsData.data.listMedicalQuestions.items

    // }

    // async function fetchQuestion() {
    //     const questionData = await API.graphql({
    //         query: getMedicalQuestion,
    //         variables: {id: chosenQuestion.id},
    //         authMode: "AMAZON_COGNITO_USER_POOLS"

    //     })
    //     console.log("tasks",questionData.data.getMedicalQuestion.tasks);
    //     return questionData.data.getMedicalQuestion.tasks.items
    //     //setQuestions(questionData.data.listMedicalQuestions.items);

    // }

    //used in question documents


    // async function submitNewTasks() {
    //     let newTasks = []
    //     //queryUtils.listCurators().then(curatorList => {
    //     listCurators().then(curatorList => {
    //         if (groupedTasks) {
    //             for (let i = 0; i < groupedTasks.length; i++) {
    //                 let numRequiredReassignments 
    //                 let numCompletedTasks = groupedTasks[i].filter(tasks =>tasks.completed === true).length;

    //                 if (numCompletedTasks < minimumRequiredCurators) {
    //                     numRequiredReassignments = minimumRequiredCurators - numCompletedTasks;
    //                 }
    //                 else {
    //                     continue;
    //                 }
    //                 let currentCurators = groupedTasks[i].map(item => item.owner);
    //                 let possibleCurators = curatorList.filter(curator => !currentCurators.includes(curator))
                    
    //                 if ( possibleCurators < numRequiredReassignments) {
    //                     console.log("insufficient curators")
    //                     console.log(groupedTasks[i][0].document_title,
    //                         groupedTasks[i][0].questionID,
    //                         groupedTasks[i][0].questionFormID,
    //                         possibleCurators)
    //                 }
    //                 for (let j = 0; j < numRequiredReassignments; i++) {
    //                     newTasks.push({
    //                         owner: possibleCurators[j],
    //                         document_title: groupedTasks[i][0].document_title,
    //                         questionID: groupedTasks[i][0].questionID,
    //                         questionFormID: groupedTasks[i][0].questionFormID

    //                     })

    //                     // submitTask({
    //                     //     owner: possibleCurators[j],
    //                     //     document_title: groupedTasks[i][0].document_title,
    //                     //     questionID: groupedTasks[i][0].questionID,
    //                     //     questionFormID: groupedTasks[i][0].questionFormID

    //                     // })
    
    //                 }


    //             }
    //         }
    //     })

    //     return newTasks

    // }

    //
    const findIncompleteQuestions = (questions) => {
        let questionItems = {};
        let tempIncompleteQuestions = []
      


        for (const question of questions) {
            let questionTasks = groupTasksByDocument(question.tasks.items)
            for (const tasks of questionTasks) {
                let numCompletedTasks = tasks.filter(task => task.completed === true).length;
                if (numCompletedTasks < minimumRequiredCurators) {
                    questionItems[question.id] = questionTasks;
                    tempIncompleteQuestions.push(question)
                    break;
                }
            }
        }
        console.log("find incomplete tasks", questionItems)
        setIncompleteQuestions(tempIncompleteQuestions)
        setAllQuestionTasks(questionItems)
    }



    // const findCompletedTasks = (groupedInputTasks, curatorNum) => {
    //     let completedTasks = 0
    //     // tasks.forEach((item, index) => {
    //     //     let numCompletedTasks = item.filter(task => task.completed === true).length;
    //     //     if (numCompletedTasks >= minimumRequiredCurators) {
    //     //         completedTasks++;
    //     //     }
    //     // })

    //     //let groupedInputTasks = allQuestionTasks[questionID];
    //     console.log("findCompletedtasks", groupedInputTasks)

    //     for (let i = 0; i < groupedInputTasks.length; i++) {
    //         let numCompletedTasks = groupedInputTasks[i].filter(item => item.completed === true).length;
    //         if (numCompletedTasks >= curatorNum) {
    //             completedTasks++;
    //         }
    //     }
    //     return completedTasks;
    // } 

    const findTotalTasks = (questionID) => {
        return allQuestionTasks[questionID].length;
    }
    return ( 
         
        <Layout>
          
                <Segment basic>
                <h4>Below are annotation question tasks which are yet to be completed</h4> 
                </Segment>
                {
            warningMessage && (
              <Message
                color="red"
                onDismiss={() => setWarningMessage(false)}
                content='Please choose a question to reassign.'
              />
            )
            }
              <Segment style={{textAlign: "left"}}>
              
              <p><Icon name='hand point right' />Please choose a task to reassign</p>
              <Segment style={{"overflow": "auto", "max-height": "30%"}}>
          <Card.Group>
             {incompleteQuestions && allQuestionTasks ?
                      incompleteQuestions.map((question,index) =>(
                      
                          <Card
                          fluid color={(chosenQuestion === question) ? "blue" : ""}
                          style={{"margin-top": 2, "margin-bottom": 2, "text-align": "left", "padding": "2%"}}
                          onClick={() => setChosenQuestion(question)}
      //href={`/annotation_tasks/${task.id}`}
      header={ `Question title: ${question.text}`   }
    //   meta={`Item ${index + 1}`}
      description={`Completed: ${findCompletedTasks(allQuestionTasks[question.id] , minimumRequiredCurators)} / ${findTotalTasks(question.id)}`}
    />
                          
                          
  
                          
                      ))
                      :"Loading annotation questions..."
                  }
  
  </Card.Group>
  

  </Segment>
  <p> Chosen question:  <Label color='grey' horizontal>
        {chosenQuestion ? chosenQuestion.text : "Please pick a question above"}
      </Label></p>
      <Segment style={{"overflow": "auto", "max-height": "30%"}}>
          <Card.Group>
             {chosenQuestion ?
                      allQuestionTasks[chosenQuestion.id].map((tasks,index) =>(
                      
                          <Card
                          fluid 
                          style={{"margin-top": 2, "margin-bottom": 2, "text-align": "left", "padding": "2%"}}
      header={ `Document title: ${tasks[0].document_title}`   }
    //   meta={`Item ${index + 1}`}
      description={`Completed: ${tasks.filter(task => task.completed === true).length} / ${tasks.length}`}
    />           
                      ))
                       : 
                       <Card
                       fluid
                       description={"Please select a document to view results"}>
                        
                       </Card>
                  }
  
  </Card.Group>
  

  </Segment>
  {/* <Button 
        color={chosenQuestion ? "blue" : "grey"}
        onClick={() => {
            if (chosenQuestion) {
                createReassignedTasks(allQuestionTasks[chosenQuestion.id]).forEach(result => submitTask(result))
            }
        }}
        >
            Reassign incomplete tasks
            </Button> */}
            { !chosenQuestion ?
      <Button 
        color='grey'
        onClick={() => {
            setWarningMessage(true);
        }}
        >
            Reassign tasks
            </Button>
      : 
      <Modal
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      trigger={<Button 
       color='blue' > 
           Reassign tasks
           </Button>}
      //content='You will not be able to make any more changes to this annotation task.'
      //actions={['Submit', { key: 'done', content: 'Back to annotating', positive: true }]}
    >
    <Modal.Header> Are you sure you want to reassign these tasks?</Modal.Header>
    <Modal.Actions>
        <Button color="green" onClick={() => {
            createReassignedTasks(allQuestionTasks[chosenQuestion.id]).forEach(result => submitTask(result))
        }}>
        Submit
        </Button>
        <Button
        color="red"
        labelPosition='right'
        icon='checkmark'
        onClick={() => setOpen(false)}>
          Back to form
        </Button>
    </Modal.Actions>

    </Modal>
      }
  </Segment>
  
              
  </Layout>
     );
}
 
export default ReassignTasks;

//let nextToken;

// async function listCurators(limit){
//     let apiName = 'AdminQueries';
//     let path = '/listUsersInGroup';
//     let myInit = { 
//         queryStringParameters: {
//           "groupname": "Curators",
//           "token": nextToken
//         },
//         headers: {
//           'Content-Type' : 'application/json',
//           Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
//         }
//     }
//     const { NextToken, ...rest } =  await API.get(apiName, path, myInit);
//     nextToken = NextToken;
//     let users = [];
//     rest.Users.map(user => users.push(user.Username))
//     console.log("curators")
//     console.log(users)
//     return users;
//   }

//   async function submitTask(task) {
//     let createdTasks = await API.graphql({
//       query: createAnnotationTask,
//       variables: {
//           input: task
//       },
//       authMode: "AMAZON_COGNITO_USER_POOLS"
//   })
//     console.log("this is the final submitted task", createdTasks)
  
//   }


//   const groupTasksByDocument = (tasks) => {
//     console.log("these are tasks",tasks);
// let finalGroupedTasks = [];

// for (let i = 0; i < tasks.length; i++) {
//     let duplicateDocument = false;
//     for (let j = 0; j < finalGroupedTasks.length; j++) {
//         if (finalGroupedTasks[j][0].document_title == tasks[i].document_title) {
//             duplicateDocument = true
//         }
//     }

//     if (!duplicateDocument) {
//         let groupedTasks = tasks.filter(task => task.document_title == tasks[i].document_title)
//         finalGroupedTasks.push(groupedTasks)
//     }
    

// }

// return finalGroupedTasks;

// // let tempGroupedTasks = tasks.group(({document_title}) => document_title)
// // for (var item in tempGroupedTasks) {
// //     finalGroupedTasks.push(tempGroupedTasks[item])
// // }
// //console.log("final grouped tasks", finalGroupedTasks)
// //setGroupedTasks(finalGroupedTasks);

// }