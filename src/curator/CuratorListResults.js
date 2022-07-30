import { useState, useEffect } from "react";
import CompletedTasks from "../admin/CompletedTasks";
import { API, Auth } from "aws-amplify";
import { listAnnotationTasks,listQuestionForms } from "../graphql/queries";
import { Link } from "react-router-dom";
import { List, Segment, Grid, Image, Card } from "semantic-ui-react";
import Layout from "../Layout";
import { fetchTasks } from "../queryUtils";

const CuratorListResults = () => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        fetchTasks()
        .then(result => {
            setTasks(result.filter(task => task.completed === true));
        })
        //fetchQuestions();
    },[])

    // async function fetchTasks() {
    //     const taskData = await API.graphql({
    //         query: listAnnotationTasks,
    //         authMode: "AMAZON_COGNITO_USER_POOLS"

    //     })
    //     console.log("tasks",taskData.data.listAnnotationTasks.items);
    //     return taskData.data.listAnnotationTasks.items

    // }
    return ( 
        <div className="completed-tasks">
            
        <Layout>
        <Segment inverted color="blue" tertiary>
            The following are previously completed tasks.
        </Segment>
    <Card.Group>
            {
                tasks.map((task,index) =>(
                
                    <Card
                    fluid color="blue"
                    style={{"margin-top": 5, "margin-bottom": 5, "text-align": "left", "padding": "2%"}}
                    href={`/completed_curator_tasks/${task.id}`}
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
 
export default CuratorListResults;