import { useEffect, useState } from "react";
import TextHeatMap from "../TextHeatMap";
import { API, Auth, Storage } from "aws-amplify";
import { listQuestionForms, getAnnotationTask, getQuestionForm } from "../graphql/queries";
import { Link } from "react-router-dom";
import { List, Segment, Grid, Image, Card, Button, Tab, Form } from "semantic-ui-react";
import { useParams } from "react-router-dom";
import { fetchTask, fetchDocument, fetchQuestionForm, fetchQuestion } from "../queryUtils";
import useWindowSize from "../useWindowSize";

const CuratorViewResults = () => {
    const size = useWindowSize();
    const { id } = useParams();
    const [tag, setTag] = useState("Summary")
    const [task, setTask] = useState(null);
    const [documentLabels, setDocumentLabels] = useState(null);
    const [questionAnswers, setQuestionAnswers] = useState(null);
    const [documentText, setDocumentText] = useState(null);
    const [questions, setQuestions] = useState(null)
    const [medicalQuestion, setMedicalQuestion] = useState(null)
    const [documentTitle, setDocumentTitle] = useState("Loading...");

  
    useEffect(() => {
        fetchTask(id)
        .then(async (result) => {
          setTask(result);
          setDocumentLabels(JSON.parse(result.labels))
          setQuestionAnswers(JSON.parse(result.question_answers))
        
          console.log("task",result)
          await Promise.all([fetchDocument(result.document_title),
            fetchQuestionForm(result.questionFormID),
            fetchQuestion(result.questionID) ])
          .then( result => {
            console.log("321",result)
            setDocumentText(result[0]["abstract"] + "\n\n" + result[0]["mainText"])
            setDocumentTitle(result[0]["title"])
            setQuestions(JSON.parse(result[1].questions))
            setMedicalQuestion(result[2])
          })
          // return fetchDocument(result.document_title)
          // fetchQuestionForm(result.questionFormID)
        })
        // .then((result) => {
        //   setDocumentText(result)
        //   //return fetchQuestionForm(result[1].questionFormID)
        // })
        // // .then((questionForm) => {
        // //   console.log("1234124", questionForm)
        // //   setQuestions(JSON.parse(questionForm.questions))
        // // })

    },[])



    // useEffect(() => {
    //   if (task) {
    //     fetchDocument(task.document_title)
    //   .then(result =>{
    //     setDocumentText(result)
    //   }
    //     )
    //   }
      
    // }, [task])

    // useEffect(() => {
    //   if (task) {
    //     fetchQuestionForm(task.questionFormID)
    //   .then(result =>{
    //     setQuestions(result)
    //   }
    //     )
    //   }
      
    // }, [task])

    const heatMapSection = (
      <div>
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
          </div>
    )

  //   const resultSection = (
  //     <Segment>
  //     <h3>Results</h3>
  //     <p>Question 1</p>
  
  // {
  //     questionAnswers && 
  //     Object.keys(questionAnswers).map((item,index) => {
  //       return (
  //         <div>
  //         <p>{item} {": "}{questionAnswers[item]}</p>
  //         </div>
  //       )
          
  //     })
  // }
  // {
  //   questionAnswers && questions && 
  //   questions.map((item,index) => {
  //     return (
  //       <h4>{item["question_text"]}</h4>
       
  //     )
  //   })
  // }
  // </Segment>
  //   )

  const resultSection = (
    <Segment color="blue" tertiary inverted>
         <h3>Results</h3>
         <p><b>Question: </b>{medicalQuestion && medicalQuestion.text}</p>
         <p><b>Document Title: </b>{documentTitle}</p>
    <Form textAlign="left" inverted style={{overflow:"auto", maxHeight:"90vh"}} >
    {questions && questions.map(function(question, index) {
         return (
<Form.Group grouped >
<h5> {index + 1} {". "} {question.question_text}</h5>
{
  question.options.map((option) =>{
      return(
         <Form.Field
  label={option}
  control='input'
  type={question.question_type}
  name={question.question_description}
  value={option}
  checked={ questionAnswers && questionAnswers[question.question_description] &&
      questionAnswers[question.question_description] === option}>

</Form.Field>
      )
      
  })
}

</Form.Group>
         )
    })}
    
</Form>
</Segment>
  )

    const smallScreenPanes = [
      {
        menuItem: 'Heat map',
        pane: (
          <Tab.Pane key='heat-map' style={{maxheight:"100%", overflow:"auto" }}>
            {heatMapSection}
          </Tab.Pane>
        ),
        
      },
      {
        menuItem: 'Question Results',
        pane: (
          <Tab.Pane key='question-result' style={{maxheight:"100%", overflow:"auto" }}>
            {resultSection}
          </Tab.Pane>
        ),
        
      },
    ]

    if (size.width > 700) {
      return ( 
        <Grid columns={2} >
    <Grid.Row stretched >
    <Grid.Column width={8} style={{maxheight: '100vh'}}>
        {heatMapSection}
      </Grid.Column>
      <Grid.Column width ={8} style={{"height": '100vh'}}>
        {resultSection}
        
      </Grid.Column>
  
    </Grid.Row>
  </Grid>
     );
    } else {
      return (
        <Tab  menu={{color:"blue",attached:true, tabular:true}} panes={smallScreenPanes} renderActiveOnly={false}/>
      )
    }
}
 
export default CuratorViewResults;