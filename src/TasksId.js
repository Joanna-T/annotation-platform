import { API, Storage } from "aws-amplify";
//import ReactMarkDown from "react-markdown"
import awsmobile from "./aws-exports";
import { getAnnotationTask } from "./graphql/queries"
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
    Popup
  } from 'semantic-ui-react';
import { Navigate } from "react-router-dom";
//import { Prompt } from "react-router";

//to create an annotation task 

const Header1 = props => {
    return (
      <header>
        <button onClick={props.onClick}>Click Me!</button>
      </header>
    );
  };


const SideBar = props => {
    const sidebarClass = props.isOpen ? "sidebar open" : "sidebar";
    return (
      <div className={sidebarClass}>
        <div> I slide into view </div>
        <div> Me Too! </div>
        <div> Me Three! </div>
        <button onClick={props.toggleSidebar} className="sidebar-toggle">
          Toggle Sidebar
        </button>
      </div>
    );
  };

const TasksId = () => {
    const { id } = useParams();
    const [task, setTask] = useState(null);
    // const [document, setDocument] = useState();
    const [documentText, setDocumentText] = useState("");
    const [questions, setQuestions] = useState(null);
    const [answers, setAnswers] = useState(null);


    //const [visible, setVisible] = useState(false);
    const [instructionsVisible, setInstructionsVisible] = useState(false);
    const [questionsVisible, setQuestionsVisible] = useState(false);
    const [instructionWidth, setInstructionWidth] = useState(2);
    const [mainWidth, setMainWidth] = useState(12);
    const [questionsWidth, setQuestionWidth] = useState(2);
    const [parentLabels, setParentLabels] = useState([{ start: 15, end: 20, tag: "SUMMARY" }]);
    
    const handleAnswerChange = (e => {
        const questionDescription = e.target.name;
        const questionValue = e.target.value;
        setAnswers({...answers,
            [questionDescription]: questionValue } )
        console.log(e.target.name,e.target.value)
    })

    async function handleSubmit() {

        const annotationResult = {
            document_title: task.document_title,
            questionID: task.questionID,
            owner: task.owner,
            question_answers: task.question_answers,
            labels: task.labels,
            questionFormID: task.questionFormID
        }
        await API.graphql({
            query: createAnnotationResult,
            variables: {
                input: annotationResult,
            },
            authMode: "AMAZON_COGNITO_USER_POOLS"
        })
        Navigate("/");
    }
    useEffect(() => {
        fetchTask();
        console.log("useEffect", task);
    },[])

    useEffect(() => {
        console.log("answer in parent", answers);
        storeAnswers();
    }, [answers])

    useEffect(() => {
        console.log("parent labels", parentLabels);
        if (parentLabels) {
            storeLabels();
        }
        
    }, [parentLabels])

    

    useEffect(() => {
        if (instructionsVisible && questionsVisible) {
            setInstructionWidth(3);
            setMainWidth(8);
            setQuestionWidth(5);
            
            return
        }
        if (!instructionsVisible && !questionsVisible) {
            setInstructionWidth(2);
            setMainWidth(12);
            setQuestionWidth(2);
            return
        }
        if (!instructionsVisible && questionsVisible) {
            setInstructionWidth(1);
            setMainWidth(10);
            setQuestionWidth(5);
            return
        }
        if (instructionsVisible && !questionsVisible) {
            setInstructionWidth(3);
            setMainWidth(12);
            setQuestionWidth(1);
            return
        }
    },[questionsVisible, instructionsVisible])

    useEffect(() => {
        if (questions) {
            console.log("questions have been added",questions);
        }
    }, [questions])

    async function storeAnswers() {
        const submittedAnswers = JSON.stringify(answers);

        const finalStoredAnswer = {
            id: task.id,
            question_answers:submittedAnswers
        }

        await API.graphql({
            query: updateAnnotationTask,
            variables: {
                input: finalStoredAnswer
            },
            authMode: "AMAZON_COGNITO_USER_POOLS"
        })
        console.log("answer submitted")
        
    }

    async function storeLabels() {
        const submittedLabels = JSON.stringify(parentLabels);
        
        console.log("The labels being stored are:")
        console.log(parentLabels);

        const finalStoredAnswer = {
            id: task.id,
            labels:submittedLabels
        }

        await API.graphql({
            query: updateAnnotationTask,
            variables: {
                input: finalStoredAnswer
            },
            authMode: "AMAZON_COGNITO_USER_POOLS"
        })
        console.log("answer submitted")
        
    }

    async function fetchTask() {
        const taskData = await API.graphql({
            query: getAnnotationTask,
            variables: { id },
            authMode: "AMAZON_COGNITO_USER_POOLS"
        })
        console.log("fetch", taskData);
        setTask(taskData.data.getAnnotationTask);

        const parsedQuestions = JSON.parse(taskData.data.getAnnotationTask.questionForm.questions);
        setQuestions(parsedQuestions)
        console.log("qqqqqqqqqq",parsedQuestions);

        const savedAnswers = JSON.parse(taskData.data.getAnnotationTask.question_answers);
        setAnswers(savedAnswers);

        const savedLabels = JSON.parse(taskData.data.getAnnotationTask.labels);
        setParentLabels(savedLabels);
        console.log("These are the initial parent labels", savedLabels)


        fetchDocument(taskData.data.getAnnotationTask.document_title);
        
    }

    async function fetchDocument(documentTitle) {

        // const result = await Storage.put("test.txt", "Hello");
        // console.log("item transferred");


        Storage.list('', {bucket: "pansurg-curation-workflo-kendraqueryresults50d0eb-open-data/"}) // for listing ALL files without prefix, pass '' instead
        .then(result => console.log("this is the result with bucket", result))
        .catch(err => console.log(err));
        console.log("FETCH DOCUMENTS")

        //const documentFile = documentTitle + ".txt";
        const documentFile = documentTitle;
        //console.log(documentFile);
        const text = await Storage.get(documentTitle, {download: true});

        text.Body.text().then(string => {
            setDocumentText(string);
        })
    }  

    const handleLabelChange = (labels) => {
        setParentLabels(labels);
    }

    async function storeAnnotation() {

    }

    const questionsStyle = {
        "padding-left": "10%",
        "padding-right": "10%",
        color: "white" 


    }

    return (
        
        <div class="task-details">
            <Grid padded style={{height: '100vh'}}>
            <Grid.Row style={{height: '5%'}}>
            <Grid.Column width={3}>
            <Checkbox
          checked={instructionsVisible}
          label={{ children: <code>Instructions</code> }}
          onChange={(e, data) => {
              console.log("data checked", data.checked)
            //   handleInstructionsView(data.checked)
              setInstructionsVisible(data.checked);
            //   handleView()
            }}
        />
        <Checkbox
          checked={questionsVisible}
          label={{ children: <code>Questions</code> }}
          onChange={(e, data) => {
            console.log("data checked", data.checked)
            // handleQuestionsView(data.checked)
              setQuestionsVisible(data.checked)
            //   handleView();
            }}
        />

      </Grid.Column>
      <Grid.Column width={10}>
        <h2>Document title</h2>
        
      </Grid.Column>
      <Grid.Column width={3}>
      {answers && questions && Object.keys(answers).length === questions.length ? 
      <Popup content='Please answer all questions to submit this task' trigger={
      <Button 
        color='grey'
        >
            Submit
            </Button>} />
      : 
      <Modal
      trigger={<Button 
       color='blue' 
       onClick={handleSubmit}>
           Submit
           </Button>}
      header='Are you sure you want to submit?'
      content='You will not be able to make any more changes to this annotation task.'
      actions={['Submit', { key: 'done', content: 'Back to annotating', positive: true }]}
    />
      }
      
      </Grid.Column>
            </Grid.Row>
            <Grid.Row style={{height: '90%'}}>
            <Grid.Column width={instructionWidth}>
                <Transition.Group
          duration={400}
          divided
          size='huge'
          verticalAlign='middle'
          animation="fade up"
        >
                {
                    instructionsVisible && (
                        <Segment color='blue' secondary>
                            
                            <Header size="small" icon='info' dividing textAlign="center">
                            <Icon circular name='info' size='small' />
    <Header.Content>Instructions</Header.Content>
  </Header>
                        <p>Toggle the Instructions and Questions tickboxes above
                            to see or hide the instructions and questions tabs.
                        </p>
                        <p>Please the read over the following document and highlight the 
                            relevant sections with the appropriate labels available for selection.
                        </p>
                        <p>Answer the questions pertaining to the document in the "Questions" tab.
                        </p>
                        <p>Click the Submit button when you are finished with annotation.</p>
                        <p>All changes are saved automatically.</p>
                        </Segment>
                        
                    )
                }
                </Transition.Group>
        
      </Grid.Column>
      <Grid.Column width={mainWidth}>
      
      <Transition.Group
          duration={400}
          divided
          size='huge'
          verticalAlign='middle'
          animation="fade up"
        >
      
      <AnnotationPage 
        annotationText={documentText} 
        handleLabelChange={handleLabelChange}
        parentLabels={parentLabels}>
        </AnnotationPage>
        </Transition.Group>
        
      </Grid.Column>
      <Grid.Column width={questionsWidth}>
      <Transition.Group
          duration={400}
          divided
          size='huge'
          verticalAlign='middle'
          animation="fade up"
        >
                {
                    questionsVisible && (
                        <Segment inverted color='blue' secondary style={{ maxHeight: '100vh'}}>
                       <Header size="small" icon='info' dividing textAlign="center">
                            <Icon name='pencil' circular size='small' />
    <Header.Content>Please answer the following questions</Header.Content>
  </Header>
  <Segment basic textAlign="left" style={{"padding-left": "10%", "padding-right": "10%", "color": "white" }}>
  <AnnotationQuestions questions={questions} handleAnswerChange={handleAnswerChange} answers={answers} ></AnnotationQuestions>
  </Segment>
  
                        
                      </Segment>
                    )
                }
                </Transition.Group>
      </Grid.Column>
            </Grid.Row>
            </Grid>
        </div>
    )


    // <Form>
    //                     <Form.Group widths='equal'>
    //                       <Form.Field label='An HTML <input>' control='input' />
    //                       <Form.Field label='An HTML <select>' control='select'>
    //                         <option value='male'>Male</option>
    //                         <option value='female'>Female</option>
    //                       </Form.Field>
    //                     </Form.Group>
    //                     <Form.Group grouped>
    //                       <label>HTML radios</label>
    //                       <Form.Field
    //                         label='This one'
    //                         control='input'
    //                         type='radio'
    //                         name='htmlRadios'
    //                       />
    //                       <Form.Field
    //                         label='That one'
    //                         control='input'
    //                         type='radio'
    //                         name='htmlRadios'
    //                       />
    //                     </Form.Group>
    //                     <Form.Group grouped>
    //                       <label>HTML checkboxes</label>
    //                       <Form.Field label='This one' control='input' type='checkbox' />
    //                       <Form.Field label='That one' control='input' type='checkbox' />
    //                     </Form.Group>
    //                     <Form.Field label='An HTML <textarea>' control='textarea' rows='3' />
    //                     <Form.Field label='An HTML <button>' control='button'>
    //                       HTML Button
    //                     </Form.Field>
    //                   </Form>

    
//   return (
//     <span>

//       <SideBar isOpen={sidebarOpen} toggleSidebar={handleViewSidebar} />
//       <div class="task-content">
//           <p>Tasks</p>
//       </div>
//     </span>
//   );
    // return ( 
    //     <div className="task-details">
    //          <Grid padded celled style={{height: '100vh'}}>
    //   <Grid.Row style={{height: '5%'}}>

    //     <Checkbox
    //       checked={instructionsVisible}
    //       label={{ children: <code>Instructions</code> }}
    //       onChange={(e, data) => setInstructionsVisible(data.checked)}
    //     />
    //     <Checkbox
    //       checked={questionsVisible}
    //       label={{ children: <code>Questions</code> }}
    //       onChange={(e, data) => setQuestionsVisible(data.checked)}
    //     />
    //   </Grid.Row>

    //   <Grid.Row style={{height: '90%'}}>
    //   <Grid.Column width={16}>
    //   <Sidebar.Pushable as={Segment}>
    //       <Sidebar
    //         as={Menu}
    //         animation='push'
    //         icon='labeled'
    //         inverted
    //         onHide={() => setVisible(false)}
    //         vertical
    //         visible={instructionsVisible}
    //         direction="left"
    //       >
    //         <Menu.Item as='a'>
    //           <Icon name='home' />
    //           Home
    //         </Menu.Item>
    //         <Menu.Item as='a'>
    //           <Icon name='gamepad' />
    //           Games
    //         </Menu.Item>
    //         <Menu.Item as='a'>
    //           <Icon name='camera' />
    //           Channels
    //         </Menu.Item>
    //       </Sidebar>

    //       <Sidebar
    //         as={Menu}
    //         animation='push'
    //         icon='labeled'
    //         inverted
    //         onHide={() => setVisible(false)}
    //         vertical
    //         visible={questionsVisible}
    //         direction="right"
    //         style={{width: '50%'}}
    //       >
    //         <Menu.Item as='a'>
    //           <Icon name='home' />
    //           Home
    //         </Menu.Item>
    //         <Menu.Item as='a'>
    //           <Icon name='gamepad' />
    //           Games
    //         </Menu.Item>
    //         <Menu.Item as='a'>
    //           <Icon name='camera' />
    //           Channels
    //         </Menu.Item>
    //       </Sidebar>
            
    //       <Sidebar.Pusher style={{overflow: 'scroll', height: '100%'}}>
    //       <Grid.Column width={10}>
    //       <h1>{task.document_title}</h1>
    //         <AnnotationPage annotationText={documentText}>
    //         </AnnotationPage>
    //         </Grid.Column>
    //         <Grid.Column width={6}>
    //         <p>hellooo</p>
    //         </Grid.Column>

            
    //       </Sidebar.Pusher>
    //     </Sidebar.Pushable>
    //     </Grid.Column>
       
    //   </Grid.Row>
    // </Grid>
            

            
    //     </div>
    //  );
}

export default TasksId;

