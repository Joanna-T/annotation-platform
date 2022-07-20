import { useState, useEffect } from "react";
import { API, Auth } from "aws-amplify";
import { listAnnotationTasks,listQuestionForms } from "./graphql/queries";
import { Link } from "react-router-dom";
import { List, Segment, Grid, Image, Card } from "semantic-ui-react";
import { tasksByUsername } from "./graphql/queries";
const Tasks = () => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        fetchTasks();
        //fetchQuestions();
    },[])

    async function fetchTasks() {
        const taskData = await API.graphql({
            query: listAnnotationTasks,
            authMode: "AMAZON_COGNITO_USER_POOLS"

        })
        console.log("tasks",taskData.data.listAnnotationTasks.items);
        setTasks(taskData.data.listAnnotationTasks.items);

    }

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
            <p>No tasks currently available</p>
        )
    }

    return ( 
        <div className="tasks">
            
            <Grid padded style={{height: '100vh'}}>
      <Grid.Row style={{height: '15%'}}>
      <Grid.Column width={3}>
        </Grid.Column>
        <Grid.Column width={10}>
            <Segment tertiary color="blue" inverted>
        <p>The following are all the documents currently available for annotation. 
            Please annotate the following with respect to the given medical question.
            Please pick one below to get started. 

            
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
    <Card href="#" style={{ "margin-bottom": 5, "text-align": "left", "padding": "2%"}}fluid color='blue' header='Option 1' />
    <Card href="#" style={{"margin-top": 5, "margin-bottom": 5, "text-align": "left", "padding": "2%"}} fluid color='blue' header='Option 2' />
    <Card href="#" style={{"margin-top": 5, "margin-bottom": 5, "text-align": "left", "padding": "2%"}} fluid color='blue' header='Option 3' />

    
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

            
        </Grid.Column>
        <Grid.Column width={3}>
        </Grid.Column>
      </Grid.Row>
    </Grid>
            
        </div>
        
     );
}
 
export default Tasks;