import { listMedicalQuestions } from "./graphql/queries";
import { useState, useEffect } from "react";
import { API, Auth } from "aws-amplify";
import { listAnnotationTasks,listQuestionForms } from "./graphql/queries";
import { Link } from "react-router-dom";
import { List, Segment, Grid, Image, Card } from "semantic-ui-react";

const ActiveTasks = () => {
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        fetchQuestions();
        //fetchQuestions();
    },[])

    async function fetchQuestions() {
        const questionData = await API.graphql({
            query: listMedicalQuestions,
            authMode: "AMAZON_COGNITO_USER_POOLS"

        })
        console.log("question",questionData.data.listMedicalQuestions.items);
        setQuestions(questionData.data.listMedicalQuestions.items);

    }

    return ( 
        <div className="tasks">
            
            <Grid padded style={{height: '100vh'}}>
      <Grid.Row style={{height: '15%'}}>
      <Grid.Column width={3}>
        </Grid.Column>
        <Grid.Column width={10}>
            <Segment tertiary color="blue" inverted>
        <p>The following are all annotation tasks that are currently in progress.
            
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
                    questions.map((question,index) =>(
                    
                        <Card
                        fluid color="blue"
                        style={{"margin-top": 5, "margin-bottom": 5, "text-align": "left", "padding": "2%"}}
    href={`/active_tasks/${question.id}`}
    header={ `Question title: ${question.text}`   }
    meta={`Question ${index + 1}`}
    description={"Progress: 2/10 completed"}
  />
                        
                        

                        
                    ))
                }
    <Card href="#" style={{ "margin-bottom": 5, "text-align": "left", "padding": "2%"}}fluid color='blue' header='Option 1' />
    <Card href="#" style={{"margin-top": 5, "margin-bottom": 5, "text-align": "left", "padding": "2%"}} fluid color='blue' header='Option 2' />
    <Card href="#" style={{"margin-top": 5, "margin-bottom": 5, "text-align": "left", "padding": "2%"}} fluid color='blue' header='Option 3' />

    
                

</Card.Group>

            
        </Grid.Column>
        <Grid.Column width={3}>
        </Grid.Column>
      </Grid.Row>
    </Grid>
            
        </div>
        
     );
}
 
export default ActiveTasks;