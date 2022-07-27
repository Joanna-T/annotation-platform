import { API, Storage } from "aws-amplify";
//import ReactMarkDown from "react-markdown"
import awsmobile from "./aws-exports";
import { getAnnotationTask, getMedicalQuestion } from "./graphql/queries"
import { createAnnotationResult, updateAnnotationTask } from "./graphql/mutations";
import { useHistory, useParams, useLocation } from "react-router-dom";
import { ComponentPropsToStylePropsMap, Divider } from "@aws-amplify/ui-react";
import { useState,useEffect,useRef } from "react";
import AnnotationPage from "./AnnotationPage";
import AnnotationQuestions from "./AnnotationQuestions";
import { useNavigate, Link } from "react-router-dom";
import React from 'react';
import {
    Button,
    Checkbox,
    Grid,
    Header,
    Icon,
    Image,
    Menu,
    Segment,
    Sidebar,
    Form,
    Transition,
    Modal,
    Popup,
    Card
  } from 'semantic-ui-react';
import { Navigate } from "react-router-dom";



const QuestionDocuments = () => {
    const { id } = useParams();
    let navigate = useNavigate();

    const [groupedTasks, setGroupedTasks]  = useState([]);
    const [question, setQuestion ] = useState(null);

    useEffect(() => {
        fetchTasks();
    }, [])

    async function fetchTasks() {
        console.log("id", id)
        const questionData = await API.graphql({
            query: getMedicalQuestion,
            variables: { id },
            authMode: "AMAZON_COGNITO_USER_POOLS"
        })
        console.log("fetch", questionData);
        setQuestion(questionData.data);
        setGroupedTasks(
            groupTasksByDocument(questionData.data.getMedicalQuestion.tasks.items)
        )
    
        //setTasks(taskData.data.getMedicalQuestion.tasks);
        //setDocuments(taskData.data.getAnnotationTask.tasks)
        
    }

    const groupTasksByDocument = (tasks) => {
        console.log("these are tasks",tasks);
    let finalGroupedTasks = [];

    for (let i = 0; i < tasks.length; i++) {
        let duplicateDocument = false;
        for (let j = 0; j < finalGroupedTasks.length; j++) {
            if (finalGroupedTasks[j][0].document_title == tasks[i].document_title) {
                duplicateDocument = true
            }
        }

        if (!duplicateDocument) {
            let groupedTasks = tasks.filter(task => task.document_title == tasks[i].document_title)
            finalGroupedTasks.push(groupedTasks)
        }
        

    }

    return finalGroupedTasks;

    }

    const sortTasks = (tasks) => {
        let groupedTasks = []
        for (let i = 0; i < tasks.length; i++) {
            if (i > 0 && tasks[i].document_title === tasks[i-1].document_title) {
                groupedTasks[groupedTasks.length-1].push(tasks[i])
            }
            else {
                groupedTasks.push([tasks[i]])
            }
        }
        console.log("grouped task",groupedTasks)
        setGroupedTasks(groupedTasks)
    }

    const handleNavigate = (tasks) => {
        var s = tasks[0].document_title;
        s = s.substring(s.indexOf("/")+1);
        if (groupedTasks) {
            navigate(`${s}`, {state: {annotation_tasks: tasks, grouped_tasks: groupedTasks}})
        }
        
    }

    const handleNavigateTest = () => {
        navigate("123")
    }

    

    return ( 
        <Grid padded style={{height: '100vh'}}>
        <Grid.Row style={{height: '15%'}}>
        <Grid.Column width={3}>
          </Grid.Column>
          <Grid.Column width={10}>
              <Segment tertiary color="blue" inverted>
          <p>Select a document below to view annotation results
              
          </p>
          </Segment>
          </Grid.Column>
          <Grid.Column width={3}>
          </Grid.Column>
        </Grid.Row>
  
        <Grid.Row style={{height: '85%'}}>
        <Grid.Column width={3}>
          </Grid.Column>
          <Grid.Column width={10}>
          <Card.Group>
          {
                      question && groupedTasks.map((tasks,index) =>(
                      
                          <Card
                          fluid color="blue"
                          style={{"margin-top": 5, "margin-bottom": 5, "text-align": "left", "padding": "2%"}}
    //   href={`/active_tasks/questions/${task.document_title}`}
      onClick={() => handleNavigate(tasks)}
      header={ `Document title: ${tasks[0].document_title}`   }
      meta={`Question ${index + 1}`}
      description={`Question title: ${question.text}`}
    />
                          
                                  
                      ))
                  }
      {/* <Card onClick={() => handleNavigateTest()} href="#" style={{ "margin-bottom": 5, "text-align": "left", "padding": "2%"}}fluid color='blue' header='Option 1' />
      <Card href="#" style={{"margin-top": 5, "margin-bottom": 5, "text-align": "left", "padding": "2%"}} fluid color='blue' header='Option 2' />
      <Card href="#" style={{"margin-top": 5, "margin-bottom": 5, "text-align": "left", "padding": "2%"}} fluid color='blue' header='Option 3' />
  
       */}
                  
  
  </Card.Group>
  
              
          </Grid.Column>
          <Grid.Column width={3}>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
}
 
export default QuestionDocuments;