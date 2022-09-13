import { useEffect, useState } from "react";
import Layout from "../common/Layout";
import { fetchQuestions } from "../utils/queryUtils";
import { deleteTask, deleteQuestion } from "../utils/mutationUtils";
import { Card, Segment, Button, Icon, Message, Modal, Label } from "semantic-ui-react";
import { checkIfAdmin } from "../utils/authUtils";
import UnauthorisedAccess from "../common/UnauthorisedAccess";

const DeleteTasks = () => {

  const [questions, setQuestions] = useState(null)
  const [chosenQuestion, setChosenQuestion] = useState(null)
  const [open, setOpen] = useState(null)
  const [warningMessage, setWarningMessage] = useState(false)
  const [warningText, setWarningText] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchQuestions()
      .then(results => {
        setQuestions(results)
      })
  }, [])

  async function deleteChosenQuestion() {
    setLoading(true)

    const tasksToBeDeleted = chosenQuestion.tasks.items
    for (let i = 0; i < tasksToBeDeleted.length; i++) {
      await deleteTask(tasksToBeDeleted[i].id)
    }

    await deleteQuestion(chosenQuestion.id)

    setOpen(false)
    setQuestions(questions.filter(question => question.id !== chosenQuestion.id))
    setChosenQuestion(null)
    setLoading(false)
  }

  if (!checkIfAdmin()) {
    return (
      <UnauthorisedAccess></UnauthorisedAccess>
    )
  }

  const segmentStyle = { "overflow": "auto", "maxHeight": "50vh" }
  const cardStyle = { "marginTop": 2, "marginBottom": 2, "textalign": "left", "padding": "2%" }

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
        <h4>The following are all active and completed annotation questions.
        </h4>
      </Segment>
      <Segment style={{ textAlign: "left" }}>
        <p>
          <Icon name='hand point right' />
          Please choose a annotation question to delete
        </p>

        <Segment style={segmentStyle}>
          <Card.Group>
            {questions && questions.length > 0 ?
              questions.map((question, index) => (

                <Card
                  key={question.id}
                  fluid color={(chosenQuestion === question) ? "blue" : undefined}
                  style={cardStyle}
                  onClick={() => setChosenQuestion(question)}
                  header={`Question title: ${question.text}`}
                  description={`Completed: ${question.tasks.items.filter(item => item.completed === true).length} / ${question.tasks.items.length}`}
                />

              ))
              :
              <Segment basic>No tasks to show</Segment>
            }

          </Card.Group>


        </Segment>
        <Segment basic>

          <p style={{ display: "inline" }}> Chosen question:</p>
          <Label color='grey' horizontal>
            {chosenQuestion ? chosenQuestion.text : "Please pick a question above"}
          </Label>
        </Segment>

        {!chosenQuestion ?
          <Button
            color='grey'
            onClick={() => {
              setWarningMessage(true);
              setWarningText("Please select a question to delete")
            }}
          >
            Delete question
          </Button>
          :
          <Modal
            open={open}
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            trigger={<Button
              color='blue' >
              Delete question
            </Button>}
          >
            <Modal.Header> Are you sure you want to delete this annotation question?</Modal.Header>
            <Modal.Content>All annotation tasks associated with this question will be deleted</Modal.Content>
            <Modal.Actions>
              {
                loading ?
                  <Button color="purple" loading> Delete</Button>
                  :
                  <Button color="purple" onClick={deleteChosenQuestion}>
                    Delete
                  </Button>
              }

              <Button
                color="red"
                labelPosition='right'
                icon
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

export default DeleteTasks;