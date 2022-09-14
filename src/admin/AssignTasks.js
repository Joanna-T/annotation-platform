import { useState, useEffect } from "react";
import {
  Segment,
  Button,
  Input,
  Label,
  Icon,
  Message,
  Modal,
  Tab
} from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import Layout from "../common/Layout";
import { fetchQuestionForms, listCurators, fetchSuggestions } from "../utils/queryUtils";
import { submitQuestion } from "../utils/mutationUtils";
import { distributeAnnotationTasks } from "../utils/assignTaskUtils";
import { fetchDocumentsAndFolders } from "../utils/assignTaskUtils";
import DocumentSelection from "./DocumentSelection";
import { labelColours } from "./adminConstants";
import { isValidURL } from "../utils/assignTaskUtils";
import QuestionFormCreation from "./QuestionFormCreation";
import SuggestionSelection from "./SuggestionSelection";
import FormSelection from "./FormSelection";
import { checkIfAdmin } from "../utils/authUtils";
import UnauthorisedAccess from "../common/UnauthorisedAccess";


const AssignTasks = () => {

  const [medicalQuestion, setMedicalQuestion] = useState("");
  const [instructionLink, setInstructionLink] = useState("")
  const [linkIsValid, setLinkIsValid] = useState(true)

  const [labels, setLabels] = useState([])
  const [currentLabel, setCurrentLabel] = useState("")

  const [folders, setFolders] = useState(null)

  const [questionForms, setQuestionForms] = useState(null);
  const [chosenQuestionForm, setChosenQuestionForm] = useState(null);

  const [submitOpen, setSubmitOpen] = useState(false)

  const [warningMessage, setWarningMessage] = useState(false);
  const [warningText, setWarningText] = useState("Please fill in all fields")

  //suggestiona
  const [suggestions, setSuggestions] = useState([])

  const [loading, setLoading] = useState(false)


  //document selection
  const [documents, setDocuments] = useState([])
  const [chosenDocuments, setChosenDocuments] = useState([])
  const [chosenFolders, setChosenFolders] = useState([])


  const navigate = useNavigate();
  useEffect(() => {

    fetchDocumentsAndFolders()
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


  const handleFoldersCheckbox = (folder, data) => {
    const folderFiles = documents.filter(document => {
      return document.slice(0, folder.length) === folder
    })

    if (data.checked) {

      setChosenFolders([...chosenFolders, folder]);
      let filesToAdd = []
      folderFiles.forEach(file => {
        if (!chosenDocuments.includes(file)) {
          filesToAdd.push(file)
        }
      })
      setChosenDocuments([...chosenDocuments, ...filesToAdd])
    } else {
      setChosenFolders(chosenFolders.filter(chosenFolder => chosenFolder !== folder));
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
    if (labels.length < labelColours.length && currentLabel !== "") {
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
      setSubmitOpen(false)
      setLoading(false)
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
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
      .then(async result => {

        try {

          await distributeAnnotationTasks(chosenQuestionForm, result, curators, chosenDocuments)

          setLoading(false)
          navigate("/")


        } catch (err) {
          console.log(err.message)
          window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
          setWarningMessage(true)
          setWarningText(err.message)
          setSubmitOpen(false)
          setLoading(false)

        }


      })
    //.catch(err => console.log(err))


  }

  if (!checkIfAdmin()) {
    return (
      <UnauthorisedAccess></UnauthorisedAccess>
    )
  }


  const containerSegmentStyle = { overflow: 'auto', "textAlign": "left" }

  const taskCreationPage = (
    <Segment style={containerSegmentStyle}>
      <p><b>NOTE:</b> current number of curators per document is set to {process.env.REACT_APP_NUMBER_CURATORS}</p>
      <p>
        <Icon name='hand point right' />
        Please enter the new medical question below
      </p>

      <SuggestionSelection
        suggestions={suggestions}
        setMedicalQuestion={setMedicalQuestion}
        setSuggestions={setSuggestions}>

      </SuggestionSelection>



      <br></br>
      <br></br>
      <Input value={medicalQuestion} fluid icon='pencil' placeholder='Question here...' onChange={event => setMedicalQuestion(event.target.value)} />
      <br></br>


      <FormSelection
        questionForms={questionForms}
        chosenQuestionForm={chosenQuestionForm}
        setChosenQuestionForm={setChosenQuestionForm}
      >
      </FormSelection>


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
        {labels && labels.map((label, index) => {
          return (
            <Label
              key={label.buttonColour}
              color={label.buttonColour}
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

      {chosenDocuments.length === 0 || !chosenQuestionForm || !medicalQuestion || !linkIsValid || labels.length === 0 ?
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
          open={submitOpen}
          onClose={() => setSubmitOpen(false)}
          onOpen={() => setSubmitOpen(true)}
          trigger={<Button
            color='blue' >
            Create tasks
          </Button>}
        >
          <Modal.Header> Are you sure you want to create new tasks?</Modal.Header>
          <Modal.Content>Documents for annotation will be distributed to curators.</Modal.Content>
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
              onClick={() => setSubmitOpen(false)}>
              Back to form
            </Button>
          </Modal.Actions>

        </Modal>
      }
    </Segment>
  )

  const resultPaneStyle = {}

  const creationPanes = [
    {
      menuItem: 'Task creation',
      pane: (
        <Tab.Pane key='document-results' style={resultPaneStyle}>
          {taskCreationPage}
        </Tab.Pane>
      ),

    },
    {
      menuItem: 'Question form creation',
      pane: (
        <Tab.Pane key='question-results' style={resultPaneStyle}>

          <QuestionFormCreation setWarningMessage={setWarningMessage} setWarningText={setWarningText}>

          </QuestionFormCreation>
        </Tab.Pane>
      ),

    },
  ]



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
          Click "Create tasks" to submit details. Select the "Question form creation"
          tab to create a new question form
        </h4>
      </Segment>
      <Tab menu={{ color: "blue", attached: true, tabular: true }} panes={creationPanes} renderActiveOnly={false} />
    </Layout>

  );
}


export default AssignTasks;