import { useState, useEffect } from "react";
import { listQuestionForms } from "./graphql/queries";
import { createAnnotationTask, createMedicalQuestion } from "./graphql/mutations";
import { API, Storage, Amplify, Auth } from "aws-amplify";
import { Segment,
         Grid,
         Button,
        Input,
        Label,
        Card,
        Accordion,
        Icon,
        Checkbox,
        Message} from "semantic-ui-react";
import { Navigate, useNavigate } from "react-router-dom";

const object = {
    "hello": "there",
    "this" : "is an object",
    "hello1": "there",
    "this1" : "is an object",
    "hello2": "there",
    "this2" : "is an object",
    "hello3": "there",
    "this3" : "is an object",
    "hello4": "there",
    "this4" : "is an object"
}

const testUsers = ["Steve", "Jo", "Phyllis", "Steph"];
const testDocuments = ["doc1", "doc2", "doc3", "doc4"];
const testQuestion = {
  text: "This is question",
  id: "12345question"
}
const testQuestionForm = {
  id: "1234questionForm"
}

const AssignTasks = () => {
    const [ questionForms, setQuestionForms ] = useState(null);
    const [ chosenQuestionForm, setChosenQuestionForm ] = useState(null);

    const [ medicalQuestion, setMedicalQuestion] = useState("");
    const [ folders, setFolders ] = useState(null)
    const [ chosenFolder, setChosenFolder ] = useState(null)
    

    const [ activeIndex, setActiveIndex] = useState(null);
    const [ warningMessage, setWarningMessage ] = useState(false);

    const navigate = useNavigate();
    useEffect(() => {
      //distributeAnnotationTasks(testQuestionForm, testDocuments, testQuestion, testUsers);
      fetchDocumentFolders();
      fetchQuestionForms();
      //listCurators();
    }, [])

    useEffect(() => {
      console.log(medicalQuestion);
    }, [medicalQuestion])

    async function fetchDocumentFolders() {
      Storage.list('') // for listing ALL files without prefix, pass '' instead
      .then(result => {
        let files = []
        let folders = []
        result.forEach(res => {
          if (res.size) {
            files.push(res)
            // sometimes files declare a folder with a / within then
            let possibleFolder = res.key.split('/').slice(0,-1).join('/')
            if (possibleFolder) folders.push(possibleFolder)
          } else {
            folders.push(res.key)
          }
        })
        const filteredFolders = folders.filter(folder => folder.includes("/"))
        setFolders(filteredFolders)
        console.log("folder1", folders)
        return {files, folders}
      })
      .catch(err => console.log(err));
    }

    async function fetchQuestionForms() {
      const formData = await API.graphql({
        query: listQuestionForms,
        authMode: "AMAZON_COGNITO_USER_POOLS"

    })
    console.log("question forms",formData.data.listQuestionForms.items);
    setQuestionForms(formData.data.listQuestionForms.items);
    }

    const handleAccordionClick = (index) => {
        console.log(index);
        if (index === activeIndex) {
          setActiveIndex(-1);
          return
        }
        setActiveIndex(index);
    }

    const handleQuestionCheckbox = (form, data) => {
      if (data.checked) {
        setChosenQuestionForm(form)
      } else {
        setChosenQuestionForm(null)
      }
  }
    const handleFolderCheckbox = (folder, data) => {
      if (data.checked) {
        setChosenFolder(folder);
      } else {
        setChosenFolder(null);
      }
    }

    async function handleSubmit() {
      if (!chosenFolder || !chosenQuestionForm || !medicalQuestion) {
        setWarningMessage(true);
        return
      }
      Promise.all([submitQuestion(medicalQuestion),listCurators()])
      .then(results => {
        distributeAnnotationTasks(chosenQuestionForm, chosenFolder, results[0], results[1]);
        navigate("/");
      })
      .catch(err => console.log(err))
    }
    return ( 
        <Grid padded style={{height: '100vh'}}>
      <Grid.Row style={{height: '10%'}}>
        <Grid.Column width={3}>
    
        </Grid.Column>
        <Grid.Column width={10}>
          <h4>Please fill in the details below to create a new annotation task.
              Click "Create tasks" to submit details.
          </h4>
        </Grid.Column>
        <Grid.Column width={3}>
        <Button color='black'>Create tasks</Button>
        </Grid.Column>
      </Grid.Row>

      <Grid.Row style={{height: '90%'}}>
        <Grid.Column width={2}>
    
        </Grid.Column>
        <Grid.Column width={12}>
          {
            warningMessage && (
              <Message
                color="red"
                onDismiss={() => setWarningMessage(false)}
                content='Please fill in all fields.'
              />
            )
          }
          <Segment style={{overflow: 'auto', "text-align": "left" }}>
              <p>
              <Icon name='hand point right' />
                  Please enter the new medical question below
                  </p>
          <Input fluid icon='pencil' placeholder='Question here...' onChange={event => setMedicalQuestion(event.target.value)}/>
          <br></br>
          <p>
          <Icon name='hand point right' />
              Please select the questions form to be asked to the annotators.
              </p>
            <p> Chosen form:  <Label color='grey' horizontal>
        {chosenQuestionForm ? chosenQuestionForm.form_description : "Please pick a question form from below"}
      </Label></p>
            <Segment style={{overflow: "auto",maxHeight: '30vh'}}>
              {questionForms ? (questionForms.map((form, index) =>{
                  return(
                <Card style={{ "margin-bottom": 5, "text-align": "left", "padding": "2%"}}fluid >
                <Accordion>
            <Accordion.Title
              active={activeIndex === index}
              index={index}
            >
              <Icon 
              onClick={() => handleAccordionClick(index)}
              name='dropdown' />
              {form.form_description}
              <Checkbox
              checked={chosenQuestionForm === form}
              style={{"float": "right"}}
              onChange={(event,data) => handleQuestionCheckbox(form, data)} />
            </Accordion.Title>
            <Accordion.Content active={activeIndex === index}>
                <p style ={{"white-space": "pre-wrap"}}>
                {JSON.stringify(JSON.parse(form.questions), null, 4)}
                </p>
                
              
            </Accordion.Content>
    
            </Accordion>
                    </Card>
                  )
                }))
                : "Loading forms..."
                
              }
            
    {/* <Card style={{"margin-top": 5, "margin-bottom": 5, "text-align": "left", "padding": "2%"}} fluid header='Option 2' />
    <Card style={{"margin-top": 5, "margin-bottom": 5, "text-align": "left", "padding": "2%"}} fluid header='Option 3' /> */}
            </Segment>

            <br></br>
            <p>
            <Icon name='hand point right' />
                Please choose the S3 folder containing the relevant documents to be annotated.
                </p>
            <p>Chosen folder: 
            <Label color='grey' horizontal>
        {chosenFolder ? chosenFolder : "Please pick a document folder from below"}
      </Label>
            </p>
            <Segment style={{overflow: "auto",maxHeight: '30vh'}}>
            {
              folders ? (folders.map((folder, index) => {
                return (
                  <Card style={{"margin-top": 5, "margin-bottom": 5, "text-align": "left", "padding": "3%"}}fluid>
                  <p>{folder}
                  <Checkbox 
                  checked={chosenFolder === folder}
                  style={{"float": "right"}}
                  onChange={(event,data) => handleFolderCheckbox(folder, data)} />
                  </p>
                  </Card>
                )
              }))
              : "Loading folders..."
              
              
            }
            
            </Segment>

            <Button color='black' onClick={handleSubmit}>Create tasks</Button>
          </Segment>

          



        </Grid.Column>
        <Grid.Column width={2}>
        </Grid.Column>
      </Grid.Row>


    </Grid>
     );
}

async function submitQuestion(question) {
  const questionObj = {
    text: question
  }

  const createdQuestion  = await API.graphql({
    query: createMedicalQuestion,
    variables: {
        input: questionObj
    },
    authMode: "AMAZON_COGNITO_USER_POOLS"
})
  console.log("this is the created question", createdQuestion.data.createMedicalQuestion);
  return createdQuestion.data.createMedicalQuestion
}

async function distributeAnnotationTasks(questionForm, documentFolder, medicalQuestion, curators) {
  let annotationTasks = []
  console.log("distributeAT inputs",questionForm, "folder", documentFolder,"curators", curators,"queaiton", medicalQuestion )
  Storage.list(documentFolder)
  .then(documents => {
    let filterDocuments = documents.filter(document => document.key[document.key.length - 1] !== "/")
    console.log("filtered documents",filterDocuments)
    let shuffledDocuments = shuffleArray(filterDocuments);
    let shuffledUsers = shuffleArray(curators.slice());
    console.log(shuffledUsers, shuffledDocuments);

    let documentCounter = 0;
    const minimumCuratorNumber = 1;

      while (documentCounter < shuffledDocuments.length) {
        for (let i = 0; i < minimumCuratorNumber; i++) {
          if (shuffledUsers.length === 0) {
            shuffledUsers = shuffleArray(curators.slice())
            // newShuffledUsers.map(user => shuffledUsers.push(user))
            console.log("This is shuffled us", shuffledUsers)
          }
          let curator = findCurator(shuffledUsers, annotationTasks, shuffledDocuments[documentCounter]);
          annotationTasks.push({
            document_title: shuffledDocuments[documentCounter].key,
            questionID: medicalQuestion.id,
            owner: curator,
            questionFormID: questionForm.id,
            completed: false
          })
          
        }
        documentCounter++;
      }
      console.log("These are the annotation tasks")
      console.log(annotationTasks)
      annotationTasks.map(task => submitTask(task));

  })
}

const findCurator = (curators, annotationTasks, document) => {
  let chosenCurator;
  let prevCurators = []
  annotationTasks.map(task => {
    if (task.document_title == document) {
      prevCurators.push(task.owner)
    }
  }
    )

  for (  let i = 0; i < curators.length; i++) {
    if (!prevCurators.includes(curators[i])) {
      chosenCurator = curators.splice(i, 1)
      return chosenCurator[0]
    }
  }
  console.log("No more available curators");
}

let nextToken;

async function submitTask(task) {
  let createdTasks = await API.graphql({
    query: createAnnotationTask,
    variables: {
        input: task
    },
    authMode: "AMAZON_COGNITO_USER_POOLS"
})
  console.log("this is the final submitted task", createdTasks)

}

async function listCurators(limit){
  let apiName = 'AdminQueries';
  let path = '/listUsersInGroup';
  let myInit = { 
      queryStringParameters: {
        "groupname": "Curators",
        "token": nextToken
      },
      headers: {
        'Content-Type' : 'application/json',
        Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
      }
  }
  const { NextToken, ...rest } =  await API.get(apiName, path, myInit);
  nextToken = NextToken;
  let users = [];
  rest.Users.map(user => users.push(user.Username))
  console.log("curators")
  console.log(users)
  return users;
}

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
  }
  return array
}



 
export default AssignTasks;