import { useEffect, useState } from "react";
import TextHeatMap from "./TextHeatMap";
import { API, Auth, Storage } from "aws-amplify";
import { listQuestionForms, getAnnotationTask } from "./graphql/queries";
import { Link } from "react-router-dom";
import { List, Segment, Grid, Image, Card, Button } from "semantic-ui-react";
import { useParams } from "react-router-dom";

const CuratorViewResults = () => {
    const { id } = useParams();
    const [tag, setTag] = useState("Summary")
    const [task, setTask] = useState(null);
    const [documentLabels, setDocumentLabels] = useState(null);
    const [questionAnswers, setQuestionAnswers] = useState(null);
    const [documentText, setDocumentText] = useState(null);
    useEffect(() => {
        fetchTask()
    })

    async function fetchDocument() {
        Storage.get()
    }

    async function fetchTask() {
        const taskData = await API.graphql({
            query: getAnnotationTask,
            variables: { id },
            authMode: "AMAZON_COGNITO_USER_POOLS"
        })

        setTask(taskData.data.getAnnotationTask);
        setDocumentLabels(JSON.parse(taskData.data.getAnnotationTask.labels))
        setQuestionAnswers(JSON.parse(taskData.data.getAnnotationTask.question_answers))


    }

    async function fetchDocument(documentTitle) {

        // const result = await Storage.put("test.txt", "Hello");
        // console.log("item transferred");


        // Storage.list('', {level: "annotation_documents"}) // for listing ALL files without prefix, pass '' instead
        // .then(result => console.log("this is the result", result))
        // .catch(err => console.log(err));
        // console.log("FETCH DOCUMENTS")

        //const documentFile = documentTitle + ".txt";
        const documentFile = documentTitle;
        //console.log(documentFile);
        const text = await Storage.get(documentTitle, {download: true});

        text.Body.text().then(string => {
            setDocumentText(string);
        })
    } 
    return ( 
        <Grid columns={2} style={{"height": '100px'}}>
    {/* <Grid.Row stretched>
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
        

     { questionAnswers.length && questionForms.questions &&
       <QuestionStats questionAnswers={questionAnswers} questionForm={questionForms}></QuestionStats>
       }
      
        </Segment>
      </Grid.Column>

    </Grid.Row> */}
  </Grid>
     );
}
 
export default CuratorViewResults;