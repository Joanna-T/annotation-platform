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



const labelColours = [
  {
    buttonColour: "red",
    labelColour: "#ff928a"
  },
  {
    buttonColour: "purple",
    labelColour: "#d5b3ff"
  },
  {
    buttonColour: "yellow",
    labelColour: "#fcf29f"
  },
  {
    buttonColour: "green",
    labelColour: "#aff7ab"
  },
  {
    buttonColour: "blue",
    labelColour: "#abd1f7"
  },
  {
    buttonColour: "brown",
    labelColour: "#e3b186"
  },
  {
    buttonColour: "black",
    labelColour: "#cccccc"
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
  const [loading, setLoading] = useState(false)


  const [activeIndex, setActiveIndex] = useState(null);
  const [open, setOpen] = useState(false)
  const [warningMessage, setWarningMessage] = useState(false);
  const [warningText, setWarningText] = useState("Please fill in all fields")

  const [suggestions, setSuggestions] = useState([])
  const [selectedSuggestion, setSelectedSuggestion] = useState()
  const [suggestionOpen, setSuggestionOpen] = useState(false)

  const navigate = useNavigate();
  useEffect(() => {
    fetchDocumentFolders()
      .then(result => setFolders(result))

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


  function isValidURL(string) {
    var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    return (res !== null)
  };


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
    setLoading(true)

    let curators = await listCurators();
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
          let JSONLabels = JSON.stringify(labels)

          distributeAnnotationTasks(chosenQuestionForm, chosenFolder, result, curators, JSONLabels)
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
  const folderCardStyle = { "marginTop": 5, "marginBottom": 5, "textalign": "left", "padding": "3%" }
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
            : "Loading forms..."

          }

        </Segment>

        <br></br>
        <p>
          <Icon name='hand point right' />
          Please choose the S3 folder containing the relevant documents to be annotated.
        </p>
        <p style={{ display: "inline" }}>Chosen folder:</p>
        <Label color='grey' horizontal>
          {chosenFolder ? chosenFolder : "Please pick a document folder from below"}
        </Label>

        <Segment style={{ overflow: "auto", maxHeight: '30vh' }}>
          {
            folders ? (folders.map((folder, index) => {
              return (
                <Card
                  key={index}
                  style={folderCardStyle} fluid>

                  <Checkbox
                    label={folder}
                    display="inline"
                    checked={chosenFolder === folder}
                    style={{ "float": "right" }}
                    onChange={(event, data) => handleFolderCheckbox(folder, data)} />

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