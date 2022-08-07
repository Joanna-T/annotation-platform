import { useState, useEffect } from "react";
import { API, Auth } from "aws-amplify";
import { listAnnotationTasks,listQuestionForms } from "./graphql/queries";
import { Link } from "react-router-dom";
import { List, Segment, Grid, Image, Card } from "semantic-ui-react";
import { tasksByUsername } from "./graphql/queries";
import Layout from "./Layout";
import {fetchTasks} from "./queryUtils"
import { fetchDocument, getTaskDocumentTitles } from "./queryUtils";

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [documentTitles, setDocumentTitles] = useState({})

    useEffect(() => {
        fetchTasks()
        .then(results => {
            const incompleteTasks = results.filter(result => result.completed === false)
            setTasks(incompleteTasks);
            return incompleteTasks
        })
        .then(tasks => {
            //return fetchDocument(tasks[2].document_title)
            return getTaskDocumentTitles(tasks)
        })
        .then(result => {
            console.log("getDocumentTitle",result)
            setDocumentTitles(result)
        })

        //fetchQuestions();
    },[])

    

    const sampleText = ["hello", "there"]

    // async function fetchQuestions() {
    //     const taskData = await API.graphql({
    //         query: listQuestionForms
    //     })
    //     console.log("question",taskData.data.listQuestionForms.items);
    // }

    // async function fetchTasks() {
    //     const { username } = await Auth.currentAuthenticatedUser();
    //     const postData = await API.graphql({
    //       query: tasksByUsername,
    //       variables: { username },
    //       authMode: "AMAZON_COGNITO_USER_POOLS"
    //     });
    //     console.log(postData.data.tasksByUsername)


    // }

    if (!tasks) {
        return (
            <Layout>
                <Segment>
                    No tasks currently available.
                </Segment>
            </Layout>
        )
    }

    return ( 
        <div className="tasks">
            
            <Layout>
            <Segment tertiary inverted color="blue">
            <p>The following are all the documents currently available for annotation. 
            Please annotate the following with respect to the given medical question.
            Please pick one below to get started. 

            
        </p>
            </Segment>
        <Card.Group>
 
    
                {
                    tasks.map((task,index) =>(
                    
                        <Card
                        fluid color="blue"
                        style={{"margin-top": 5, "margin-bottom": 5, "text-align": "left", "padding": "2%"}}
    href={`/annotation_tasks/${task.id}`}
    header={ `Document title: ${documentTitles[task.id]}`   }
    meta={`Created ${task.createdAt.substring(0,10)}`}
    description={`Question: ${task.question.text}`}
  />
                        
                        

                        
                    ))
                }

</Card.Group>

            
</Layout>
            
        </div>
        
     );
}
 
export default Tasks;

// async function fetchTasks() {
//     const taskData = await API.graphql({
//         query: listAnnotationTasks,
//         authMode: "AMAZON_COGNITO_USER_POOLS"

//     })
//     console.log("tasks",taskData.data.listAnnotationTasks.items);
//     return taskData.data.listAnnotationTasks.items
    

// }

