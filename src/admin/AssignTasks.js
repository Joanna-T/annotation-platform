import { useState, useEffect } from "react";
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
import { useNavigate } from "react-router-dom";
import Layout from "../common/Layout";
import { fetchQuestionForms, listCurators, fetchSuggestions } from "../utils/queryUtils";
import { submitQuestion, deleteSuggestion } from "../utils/mutationUtils";
import { distributeAnnotationTasks } from "./assignTaskUtils";
import { fetchDocumentFolders } from "./assignTaskUtils";
import DocumentSelection from "./DocumentSelection";
import { labelColours } from "./adminConstants";
import { isValidURL } from "./assignTaskUtils";


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

  const [loading, setLoading] = useState(false)


  //document selection
  const [documents, setDocuments] = useState([])
  const [chosenDocuments, setChosenDocuments] = useState([])
  const [chosenFolders, setChosenFolders] = useState([])


  const navigate = useNavigate();
  useEffect(() => {
    fetchDocumentFolders()
      .then(result => {
        setFolders(result[0])
        setDocuments(result[1])
      }
      )

    fetchSuggestions().then(results => {
      setSuggestions(results)
    }
    )

    fetchQuestionForms()
      .then(questions => {
        setQuestionForms(questions)
      })

  }, [])

  useEffect(() => {
  }, [medicalQuestion])

  const handleAccordionClick = (index) => {
    //console.log(index);
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

  const handleFoldersCheckbox = (folder, data) => {
    const folderFiles = documents.filter(document => {
      return document.slice(0, folder.length) === folder
    })
    //console.log("folderfiles", folderFiles)
    if (data.checked) {
      //console.log("handlefolderscheckbox entered if")
      setChosenFolders([...chosenFolders, folder]);
      let filesToAdd = []
      folderFiles.forEach(file => {
        if (!chosenDocuments.includes(file)) {
          filesToAdd.push(file)
        }
      })
      setChosenDocuments([...chosenDocuments, ...filesToAdd])
    } else {
      setChosenFolders(chosenFolders.filter(folder => folder !== folder));
      setChosenDocuments(chosenDocuments.filter(document => !folderFiles.includes(document)))

    }

  }

  const handleFileCheckbox = (file, data) => {
    const fileFolderName = file.slice(0, file.indexOf("/") + 1)

    if (data.checked) {
      setChosenDocuments([...chosenDocuments, file])
    } else {
      setChosenDocuments(chosenDocuments.filter(document => document !== file))
      setChosenFolders(chosenFolders.filter(folder => folder !== fileFolderName))
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

  const removeFile = (file) => {
    const fileFolderName = file.slice(0, file.indexOf("/") + 1)
    setChosenDocuments(chosenDocuments.filter(document => document !== file))
    setChosenFolders(chosenFolders.filter(folder => folder !== fileFolderName))
  }

  const addLabel = () => {
    var newLabel = {};
    if (labels.length < 7 && currentLabel !== "") {
      for (let i = 0; i < labelColours.length; i++) {

        let labelColourAlreadyUsed = labels.filter(result => result.buttonColour === labelColours[i].buttonColour)
        if (labelColourAlreadyUsed.length === 0) {
          newLabel.tagName = currentLabel
          newLabel.buttonColour = labelColours[i].buttonColour
          newLabel.labelColour = labelColours[i].labelColour
          break
        }
      }

      setLabels([...labels, newLabel])
      setCurrentLabel("")
    }
  }
  async function handleSubmit() {

    setLoading(true)
    let curators = await listCurators()

    if (curators.length < process.env.REACT_APP_NUMBER_CURATORS) {
      setWarningText("Insufficient number of curators to assign tasks")
      setWarningMessage(true)
      setOpen(false)
      setLoading(false)
      return
    }
    let questionToSubmit = {
      text: medicalQuestion,
      labelDescriptions: JSON.stringify(labels)

    }
    if (instructionLink !== "" && linkIsValid) {
      questionToSubmit.instructionLink = instructionLink
    }

    submitQuestion(questionToSubmit)
      .then(result => {

        try {

          distributeAnnotationTasks(chosenQuestionForm, chosenFolder, result, curators, chosenDocuments)
            .then(() => {
              setLoading(false)
              navigate("/")
            })

        } catch (err) {
          console.log(err)
          setWarningMessage(true)
          setWarningText(err)
        }

      })
      .catch(err => console.log(err))

  }


  const formCardStyle = { "marginBottom": 5, "textalign": "left", "padding": "2%" }
  const containerSegmentStyle = { overflow: 'auto', "textAlign": "left" }

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
      <Segment style={containerSegmentStyle}>
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
                {suggestions.length > 0 ?
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
                  :
                  <p>No suggestions submitted</p>
                }
              </List>
            </Segment>

          </Modal.Content>
          <Modal.Actions>

            <Button
              color="red"
              labelPosition='right'
              icon
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
        <p style={{ display: "inline" }}> Chosen form:  </p><Label color='grey' horizontal>
          {chosenQuestionForm ? chosenQuestionForm.form_description : "Please pick a question form from below"}
        </Label>
        <Segment style={{ overflow: "auto", maxHeight: '30vh' }}>
          {questionForms ? (questionForms.map((form, index) => {
            return (
              <Card
                key={form.id}
                style={formCardStyle} fluid >
                <Accordion>
                  <Accordion.Title
                    active={activeIndex === index}
                    index={index}
                  >
                    <Checkbox
                      checked={chosenQuestionForm === form}
                      onChange={(event, data) => handleQuestionCheckbox(form, data)}
                      label={form.form_description} />
                    <Icon
                      size="large"
                      onClick={() => handleAccordionClick(index)}
                      name='dropdown'
                      style={{ "float": "right" }} />


                  </Accordion.Title>
                  <Accordion.Content active={activeIndex === index}>
                    <p style={{ "whiteSpace": "pre-wrap" }}>
                      {JSON.stringify(JSON.parse(form.questions), null, 4)}
                    </p>


                  </Accordion.Content>

                </Accordion>
              </Card>
            )
          }))
            : "No forms available"

          }

        </Segment>

        <br></br>
        <DocumentSelection
          documents={documents}
          chosenDocuments={chosenDocuments}
          chosenFolders={chosenFolders}
          handleFoldersCheckbox={handleFoldersCheckbox}
          handleFileCheckbox={handleFileCheckbox}
          removeFile={removeFile}
          folders={folders}
        >

        </DocumentSelection>
        <br></br>


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

        {chosenDocuments.length === 0 || !chosenQuestionForm || !medicalQuestion || !linkIsValid || labels.length === 0 ? //{!chosenFolder || 
          <Button
            color='grey'
            onClick={() => {
              setWarningMessage(true);
              setWarningText("Please fill in all fields")
            }}
          >
            Create tasks
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
          >
            <Modal.Header> Are you sure you want to create new tasks?</Modal.Header>
            <Modal.Content>Documents from {chosenFolder} will be distributed to curators.</Modal.Content>
            <Modal.Actions>
              {
                loading ?
                  <Button loading color="green">Create tasks</Button>
                  :
                  <Button color="green" onClick={handleSubmit}>
                    Create tasks
                  </Button>
              }

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


export default AssignTasks;