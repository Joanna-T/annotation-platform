import {  useParams } from "react-router-dom";
import { useState,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import React from 'react';
import {
    Segment,
    Card
  } from 'semantic-ui-react';
import { fetchQuestion } from "./queryUtils";
import Layout from "./Layout";
import { groupTasksByDocument } from "./documentUtils";



const QuestionDocuments = () => {
    const { id } = useParams();
    let navigate = useNavigate();

    const [groupedTasks, setGroupedTasks]  = useState([]);
    const [question, setQuestion ] = useState(null);

    useEffect(() => {
        fetchQuestion(id)
        .then(question => {
            setQuestion(question)
            setGroupedTasks(
                groupTasksByDocument(question.tasks.items)
            )

        })
        //fetchTasks();
    }, [])

    // async function fetchTasks() {
    //     console.log("id", id)
    //     const questionData = await API.graphql({
    //         query: getMedicalQuestion,
    //         variables: { id },
    //         authMode: "AMAZON_COGNITO_USER_POOLS"
    //     })
    //     console.log("fetch", questionData);
    //     return questionData.data
    //     setQuestion(questionData.data);
    //     setGroupedTasks(
    //         groupTasksByDocument(questionData.data.getMedicalQuestion.tasks.items)
    //     )
    
    //     //setTasks(taskData.data.getMedicalQuestion.tasks);
    //     //setDocuments(taskData.data.getAnnotationTask.tasks)
        
    // }

    // const groupTasksByDocument = (tasks) => {
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

    // }

    // const sortTasks = (tasks) => {
    //     let groupedTasks = []
    //     for (let i = 0; i < tasks.length; i++) {
    //         if (i > 0 && tasks[i].document_title === tasks[i-1].document_title) {
    //             groupedTasks[groupedTasks.length-1].push(tasks[i])
    //         }
    //         else {
    //             groupedTasks.push([tasks[i]])
    //         }
    //     }
    //     console.log("grouped task",groupedTasks)
    //     setGroupedTasks(groupedTasks)
    // }

    const handleNavigate = (tasks) => {
        var s = tasks[0].document_title;
        s = s.substring(s.indexOf("/")+1);
        if (groupedTasks) {
            //navigate(`${s}`, {state: {annotation_tasks: tasks, grouped_tasks: groupedTasks}})
            navigate(`results`, {state: {annotation_tasks: tasks, grouped_tasks: groupedTasks}})
        }
        
    }

    // const handleNavigateTest = () => {
    //     navigate("123")
    // }

    

    return ( 
        <Layout>
            <Segment tertiary color="blue" inverted>
                Select a document below to view annotation results
            </Segment>
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

                  
  
  </Card.Group>
  
  </Layout>
    );
}
 
export default QuestionDocuments;