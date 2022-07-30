import { useEffect, useState } from "react";
import TextHeatMap from "../TextHeatMap";
import { API, Auth, Storage } from "aws-amplify";
import { listQuestionForms, getAnnotationTask, getQuestionForm } from "../graphql/queries";
import { Link } from "react-router-dom";
import { List, Segment, Grid, Image, Card, Button } from "semantic-ui-react";
import { useParams } from "react-router-dom";
import { fetchTask, fetchDocument } from "../queryUtils";

const CuratorViewResults = () => {
    const { id } = useParams();
    const [tag, setTag] = useState("Summary")
    const [task, setTask] = useState(null);
    const [documentLabels, setDocumentLabels] = useState(null);
    const [questionAnswers, setQuestionAnswers] = useState(null);
    const [documentText, setDocumentText] = useState(null);

  
    useEffect(() => {
        fetchTask(id).then((result) => {
          setTask(result);
          setDocumentLabels(JSON.parse(result.labels))
          setQuestionAnswers(JSON.parse(result.question_answers))
        
          console.log("tasks",result)
          return fetchDocument(result.document_title)
          //fetchQuestionForm(result.questionFormID)
        }).then((documentString) => {
          setDocumentText(documentString)
        })
    },[])


    return ( 
        <Grid columns={2} style={{"height": '100px'}}>
    <Grid.Row stretched>
    <Grid.Column width={8}>
        <Segment style={{height: "10vh", "margin-bottom": "0%", "text-align":"left"}}>
        <Button inverted color='orange'
          active={ (tag == "Summary")}
          onClick={() => setTag("Summary")}>
        Summary
      </Button>
      <Button inverted color='yellow'
      active={ (tag == "Quality")}
      onClick={() => setTag("Quality")}>
        Quality
      </Button>
      <Button inverted color='olive'
      active={ (tag == "Relevancy")}
      onClick={() => setTag("Relevancy")}>
        Relevancy
      </Button>
     
          </Segment>
        <Segment style={{"overflow": "auto","text-align": "left", "white-space": "pre-wrap", height: "90vh", "margin-top":"0%"}}>
        {documentText && documentLabels && <TextHeatMap tag={tag} documentLabels={documentLabels} documentText={documentText}/>}
          
          </Segment>
      </Grid.Column>
      <Grid.Column width ={8}>
        <Segment padded>
            <h3>Results</h3>
            <p>Question 1</p>
        
        {
            questionAnswers && 
            Object.keys(questionAnswers).map((item,index) => {
              return (
                <div>
                <p>{item} {": "}{questionAnswers[item]}</p>
                </div>
              )
                
            })
        }
     
      
        </Segment>
      </Grid.Column>

    </Grid.Row>
  </Grid>
     );
}
 
export default CuratorViewResults;