import { useState, useEffect, useCallback } from "react";
import { Storage } from "aws-amplify";
import {
  Segment,
  Button,
  Input,
  Label,
  Card,
  Accordion,
  Icon,
  Checkbox,
  Message,
  Modal,
  List
} from "semantic-ui-react";
import { Navigate, useNavigate } from "react-router-dom";
import Layout from "../common/Layout";
import { fetchQuestionForms, listCurators, fetchSuggestions } from "../utils/queryUtils";
import { submitQuestion, submitTask, deleteSuggestion } from "../utils/mutationUtils";
import { distributeAnnotationTasks } from "./assignTaskUtils";
import { useAmplify } from "@aws-amplify/ui-react";

// const object = {
//   "hello": "there",
//   "this": "is an object",
//   "hello1": "there",
//   "this1": "is an object",
//   "hello2": "there",
//   "this2": "is an object",
//   "hello3": "there",
//   "this3": "is an object",
//   "hello4": "there",
//   "this4": "is an object"
// }

// const testUsers = ["Steve", "Jo", "Phyllis", "Steph"];
// const testDocuments = ["doc1", "doc2", "doc3", "doc4"];
// const testQuestion = {
//   text: "This is question",
//   id: "12345question"
// }
// const testQuestionForm = {
//   id: "1234questionForm"
// }

const labelColours = [
  {
    buttonColour: "red",
    labelColour: "#ff6e63"
  },
  {
    buttonColour: "purple",
    labelColour: "#c07dff"
  },
  {
    buttonColour: "yellow",
    labelColour: "#fff980"
  },
  {
    buttonColour: "green",
    labelColour: "#a7ff78"
  },
  {
    buttonColour: "blue",
    labelColour: "#69c5ff"
  },
  {
    buttonColour: "brown",
    labelColour: "#c7853e"
  },
  {
    buttonColour: "black",
    labelColour: "#c4c4c4"
  }
]

const AssignTasks = () => {
  const [questionForms, setQuestionForms] = useState(null);
  const [chosenQuestionForm, setChosenQuestionForm] = useState(null);

  const [medicalQuestion, setMedicalQuestion] = useState("");
  const [instructionLink, setInstructionLink] = useState("")
  const [linkIsValid, setLinkIsValid] = useState(true)
  const [folders, setFolders] = useState(null)
  const [chosenFolder, setChosenFolder] = useState(null)
  const [labels, setLabels] = useState([])
  const [currentLabel, setCurrentLabel] = useState("")


  const [activeIndex, setActiveIndex] = useState(null);
  const [open, setOpen] = useState(false)
  const [warningMessage, setWarningMessage] = useState(false);
  const [warningText, setWarningText] = useState("Please fill in all fields")

  const [suggestions, setSuggestions] = useState([])
  const [selectedSuggestion, setSelectedSuggestion] = useState()
  const [suggestionOpen, setSuggestionOpen] = useState(false)

  const navigate = useNavigate();
  useEffect(() => {
    //distributeAnnotationTasks(testQuestionForm, testDocuments, testQuestion, testUsers);
    fetchDocumentFolders()

    fetchSuggestions().then(results => {
      console.log("suggestions", results)
      setSuggestions(results)
    }
    )

    fetchQuestionForms()
      .then(questions => {
        setQuestionForms(questions)
      })
    //listCurators();
  }, [])

  useEffect(() => {
    console.log("medicalQuestion", medicalQuestion);
  }, [medicalQuestion])

  async function fetchDocumentFolders() {
    Storage.list('') // add bucket name after this has been configured
      .then(result => {
        let files = []
        let folders = []
        result.forEach(res => {
          if (res.size) {
            files.push(res)
            // sometimes files declare a folder with a / within then
            let possibleFolder = res.key.split('/').slice(0, -1).join('/')
            if (possibleFolder) folders.push(possibleFolder)
          } else {
            folders.push(res.key)
          }
        })
        const filteredFolders = folders.filter(folder => folder.includes("/"))
        console.log("filteredFolders", filteredFolders)
        //return filteredFolders
        setFolders(filteredFolders)
        //console.log("folder1", folders)
        //return {files, folders}
      })
      .catch(err => console.log(err));
  }

  function isValidURL(string) {
    var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    return (res !== null)
  };

  // async function fetchQuestionForms() {
  //   const formData = await API.graphql({
  //     query: listQuestionForms,
  //     authMode: "AMAZON_COGNITO_USER_POOLS"

  // })
  // console.log("question forms",formData.data.listQuestionForms.items);
  // return formData.data.listQuestionForms.items
  // //setQuestionForms(formData.data.listQuestionForms.items);
  // }

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

  const handleInstructionLinkChange = (string) => {
    setInstructionLink(string)
    if (string === "") {
      setLinkIsValid(true)
      return
    }
    if (isValidURL(string)) {
      setLinkIsValid(true)
    } else {
      setLinkIsValid(false)
    }
  }

  const addLabel = () => {
    console.log("new label added")
    var newLabel = {};
    if (labels.length < 7 && currentLabel !== "") {
      for (let i = 0; i < labelColours.length; i++) {
        console.log(labelColours[i])
        let labelColourAlreadyUsed = labels.filter(result => result.buttonColour === labelColours[i].buttonColour)
        if (labelColourAlreadyUsed.length === 0) {
          newLabel.tagName = currentLabel
          newLabel.buttonColour = labelColours[i].buttonColour
          newLabel.labelColour = labelColours[i].labelColour
          break
        }
      }
      console.log(newLabel)
      setLabels([...labels, newLabel])
      setCurrentLabel("")
    }
  }
  async function handleSubmit() {
    // if (!chosenFolder || !chosenQuestionForm || !medicalQuestion) {
    //   setWarningMessage(true);
    //   return
    // }

    //change this
    // listCurators().then((results) => {
    //   if (results.length < process.env.REACT_APP_NUMBER_CURATORS) {
    //     console.log("Insufficient number of curators")
    //     throw "Insufficient number of curators"
    //     return
    //   }
    // })
    //   .catch(err => {
    //     setWarningMessage(true)
    //     setWarningText(err)
    //   })

    let curators = await listCurators();
    if (curators.length < process.env.REACT_APP_NUMBER_CURATORS) {
      //if (curators.length < 20) {
      setWarningText("Insufficient number of curators to assign tasks")
      setWarningMessage(true)
      setOpen(false)
      return
    }
    let questionToSubmit = {
      text: medicalQuestion,
      labelDescriptions: JSON.stringify(labels)

    }
    if (instructionLink !== "" && linkIsValid) {
      questionToSubmit.instructionLink = instructionLink
    }
    Promise.all([submitQuestion(questionToSubmit, "API_KEY"), listCurators()])
      .then(results => {
        if (results[1].length < process.env.REACT_APP_NUMBER_CURATORS) {
          console.log("Insufficient number of curators")
          return
        }
        try {
          let JSONLabels = JSON.stringify(labels)
          distributeAnnotationTasks(chosenQuestionForm, chosenFolder, results[0], results[1], JSONLabels)
            .then(() => {
              navigate("/")
            })

        } catch (err) {
          console.log(err)
          setWarningMessage(true)
          setWarningText(err)
        }

        console.log("distribution finished")

      })
      // .then(async result => {
      //   console.log("assign tasks new tasks", result)
      //     await Promise.all(result.map(async task => {
      //       let submittedTask = await submitTask(task)
      //       console.log("submitted task", submittedTask)
      //     }))
      //     // newTasks.forEach(task => {
      //     //   submitTask(task)
      //     // })

      //   navigate("/");
      // })
      .catch(err => console.log(err))

  }

  return (
    <Layout>
      {
        warningMessage && (
          <Message
            color="red"
            onDismiss={() => setWarningMessage(false)}
            content={warningText}
          />
        )
      }
      <Segment basic>
        <h4>Please fill in the details below to create a new annotation task.
          Click "Create tasks" to submit details.
        </h4>
      </Segment>
      <Segment style={{ overflow: 'auto', "text-align": "left" }}>
        <p><b>NOTE:</b> current number of curators per document is set to {process.env.REACT_APP_NUMBER_CURATORS}</p>
        <p>
          <Icon name='hand point right' />
          Please enter the new medical question below
        </p>
        <Modal
          open={suggestionOpen}
          onClose={() => setSuggestionOpen(false)}
          onOpen={() => setSuggestionOpen(true)}
          trigger={<Button
            color='blue' >
            View question suggestions
          </Button>}
        >
          <Modal.Header> Select a suggestion to use as the new question heading</Modal.Header>
          <Modal.Content>
            <Segment maxHeight="50vh">
              <List divided>
                {suggestions &&
                  suggestions.map(suggestion => {
                    return (
                      <List.Item
                        key={suggestion.id}>
                        <p style={{ display: "inline" }}>{suggestion.text}</p>
                        <List.Content floated='right'>

                          <Button
                            size="small"
                            color={selectedSuggestion === suggestion.id ? "blue" : "grey"}
                            onClick={() => {
                              setSelectedSuggestion(suggestion.id)
                              setMedicalQuestion(suggestion.text)
                            }
                            }>
                            Set question</Button>
                          <Button
                            size="small"
                            color="red"
                            onClick={() => {
                              deleteSuggestion(suggestion.id)
                              setSuggestions(suggestions.filter(result => result.id !== suggestion.id))
                            }}>Delete</Button>
                        </List.Content>
                      </List.Item>
                    )
                  }

                  )
                }
              </List>
            </Segment>

          </Modal.Content>
          <Modal.Actions>

            <Button
              color="red"
              labelPosition='right'
              icon='checkmark'
              onClick={() => setSuggestionOpen(false)}>
              Back to form
            </Button>
          </Modal.Actions>

        </Modal>
        <br></br>
        <br></br>
        <Input value={medicalQuestion} fluid icon='pencil' placeholder='Question here...' onChange={event => setMedicalQuestion(event.target.value)} />
        <br></br>
        <p>
          <Icon name='hand point right' />
          Please select the questions form to be asked to the annotators.
        </p>
        <p> Chosen form:  <Label color='grey' horizontal>
          {chosenQuestionForm ? chosenQuestionForm.form_description : "Please pick a question form from below"}
        </Label></p>
        <Segment style={{ overflow: "auto", maxHeight: '30vh' }}>
          {questionForms ? (questionForms.map((form, index) => {
            return (
              <Card
                key={form.id}
                style={{ "margin-bottom": 5, "text-align": "left", "padding": "2%" }} fluid >
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
                      style={{ "float": "right" }}
                      onChange={(event, data) => handleQuestionCheckbox(form, data)} />
                  </Accordion.Title>
                  <Accordion.Content active={activeIndex === index}>
                    <p style={{ "white-space": "pre-wrap" }}>
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
        <Segment style={{ overflow: "auto", maxHeight: '30vh' }}>
          {
            folders ? (folders.map((folder, index) => {
              return (
                <Card
                  key={index}
                  style={{ "margin-top": 5, "margin-bottom": 5, "text-align": "left", "padding": "3%" }} fluid>
                  <p>{folder}
                    <Checkbox
                      checked={chosenFolder === folder}
                      style={{ "float": "right" }}
                      onChange={(event, data) => handleFolderCheckbox(folder, data)} />
                  </p>
                </Card>
              )
            }))
              : "Loading folders..."


          }

        </Segment>

        <p>
          <Icon name='hand point right' />
          Please add the annotation labels
        </p>
        <Segment basic>
          {labels && labels.map(label => {
            return (
              <Label color={label.buttonColour}
                onClick={() => { setLabels(labels.filter(result => result.buttonColour !== label.buttonColour)) }} >
                {label.tagName}
                <Icon name='delete' />
              </Label>
            )
          })}
        </Segment>
        <Button onClick={addLabel}>Add Label</Button>
        <Input value={currentLabel} placeholder='Enter label name here...' onChange={event => setCurrentLabel(event.target.value)} />
        {/* action={{ icon: 'add', onClick: { addLabel } }} */}
        <Segment>
          <p>
            <Icon name='hand point right' />
            OPTIONAL: If you have a link to detailed instructions regarding your annotation task, please paste it here:
          </p>
          {
            !linkIsValid &&
            <Label color="red">Please enter a valid URL</Label>
          }
          <Input value={instructionLink} fluid icon='linkify' placeholder='Link here...' onChange={event => handleInstructionLinkChange(event.target.value)} />
        </Segment>

        {!chosenFolder || !chosenQuestionForm || !medicalQuestion || !linkIsValid || labels.length === 0 ?
          <Button
            color='grey'
            onClick={() => {
              setWarningMessage(true);
              setWarningText("Please fill in all fields")
            }}
          >
            Submit
          </Button>
          :
          <Modal
            open={open}
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            trigger={<Button
              color='blue' >
              Create tasks
            </Button>}
          //content='You will not be able to make any more changes to this annotation task.'
          //actions={['Submit', { key: 'done', content: 'Back to annotating', positive: true }]}
          >
            <Modal.Header> Are you sure you want to create new tasks?</Modal.Header>
            <Modal.Actions>
              <Button color="green" onClick={handleSubmit}>
                Create tasks
              </Button>
              <Button
                color="red"
                labelPosition='right'
                icon='checkmark'
                onClick={() => setOpen(false)}>
                Back to form
              </Button>
            </Modal.Actions>

          </Modal>
        }
      </Segment>
    </Layout>

  );
}

// async function submitQuestion(question) {
//   const questionObj = {
//     text: question
//   }

//   const createdQuestion  = await API.graphql({
//     query: createMedicalQuestion,
//     variables: {
//         input: questionObj
//     },
//     authMode: "AMAZON_COGNITO_USER_POOLS"
// })
//   console.log("this is the created question", createdQuestion.data.createMedicalQuestion);
//   return createdQuestion.data.createMedicalQuestion
// }

// async function distributeAnnotationTasks(questionForm, documentFolder, medicalQuestion, curators) {
//   let annotationTasks = []
//   console.log("distributeAT inputs",questionForm, "folder", documentFolder,"curators", curators,"queaiton", medicalQuestion )
//   Storage.list(documentFolder)
//   .then(documents => {
//     let filterDocuments = documents.filter(document => document.key[document.key.length - 1] !== "/")
//     console.log("filtered documents",filterDocuments)
//     let shuffledDocuments = shuffleArray(filterDocuments);
//     let shuffledUsers = shuffleArray(curators.slice());
//     console.log(shuffledUsers, shuffledDocuments);

//     let documentCounter = 0;
//     //const minimumCuratorNumber = 1;
//     const minimumCuratorNumber = process.env.REACT_APP_NUMBER_CURATORS;

//       while (documentCounter < shuffledDocuments.length) {
//         for (let i = 0; i < minimumCuratorNumber; i++) {
//           if (shuffledUsers.length === 0) {
//             shuffledUsers = shuffleArray(curators.slice())
//             // newShuffledUsers.map(user => shuffledUsers.push(user))
//             console.log("This is shuffled us", shuffledUsers)
//           }
//           let curator = findCurator(shuffledUsers, annotationTasks, shuffledDocuments[documentCounter]);
//           annotationTasks.push({
//             document_title: shuffledDocuments[documentCounter].key,
//             questionID: medicalQuestion.id,
//             owner: curator,
//             questionFormID: questionForm.id,
//             completed: false
//           })

//         }
//         documentCounter++;
//       }
//       console.log("These are the annotation tasks")
//       console.log(annotationTasks)
//       annotationTasks.map(task => submitTask(task));

//   })
// }

// const findCurator = (curators, annotationTasks, document) => {
//   let chosenCurator;
//   let prevCurators = []
//   annotationTasks.map(task => {
//     if (task.document_title == document) {
//       prevCurators.push(task.owner)
//     }
//   }
//     )

//   for (  let i = 0; i < curators.length; i++) {
//     if (!prevCurators.includes(curators[i])) {
//       chosenCurator = curators.splice(i, 1)
//       return chosenCurator[0]
//     }
//   }
//   console.log("No more available curators");
// }

//let nextToken;

// async function submitTask(task) {
//   let createdTasks = await API.graphql({
//     query: createAnnotationTask,
//     variables: {
//         input: task
//     },
//     authMode: "AMAZON_COGNITO_USER_POOLS"
// })
//   console.log("this is the final submitted task", createdTasks)
//   return createdTasks

// }

// async function listCurators(limit){
//   let apiName = 'AdminQueries';
//   let path = '/listUsersInGroup';
//   let myInit = { 
//       queryStringParameters: {
//         "groupname": "Curators",
//         "token": nextToken
//       },
//       headers: {
//         'Content-Type' : 'application/json',
//         Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
//       }
//   }
//   const { NextToken, ...rest } =  await API.get(apiName, path, myInit);
//   nextToken = NextToken;
//   let users = [];
//   rest.Users.map(user => users.push(user.Username))
//   console.log("curators")
//   console.log(users)
//   return users;
// }

// function shuffleArray(array) {
//   for (var i = array.length - 1; i > 0; i--) {
//       var j = Math.floor(Math.random() * (i + 1));
//       var temp = array[i];
//       array[i] = array[j];
//       array[j] = temp;
//   }
//   return array
// }




export default AssignTasks;