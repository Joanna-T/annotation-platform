import { useState, useEffect } from "react";
import { API, Auth } from "aws-amplify";
import { listAnnotationTasks,listQuestionForms } from "./graphql/queries";
import { Link } from "react-router-dom";
import { List, Segment, Grid, Image, Card } from "semantic-ui-react";
import { tasksByUsername } from "./graphql/queries";
import Layout from "./Layout";
import {fetchTasks} from "./queryUtils"

const Tasks = () => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        fetchTasks()
        .then(results => {
            setTasks(results.filter(result => result.completed === false));
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
    header={ `Document title: ${task.document_title}`   }
    meta={`Task ${index + 1}`}
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