import { useEffect, useState } from "react";
import Layout from "../common/Layout";
import { fetchQuestions } from "../utils/queryUtils";
import { deleteTask, deleteQuestion } from "../utils/mutationUtils";
import { Card, Grid, Segment, Label, Button, Icon, Message, Modal, Checkbox } from "semantic-ui-react";

const DeleteTasks = () => {

  const [questions, setQuestions] = useState(null)
  const [chosenQuestion, setChosenQuestion] = useState(null)
  const [open, setOpen] = useState(null)
  const [warningMessage, setWarningMessage] = useState(false)
  const [warningText, setWarningText] = useState("")

  useEffect(() => {
    fetchQuestions()
      .then(results => {
        setQuestions(results)
      })
  }, [])

  async function deleteChosenQuestion() {
    console.log("chosen question", chosenQuestion.tasks.items)
    const tasksToBeDeleted = chosenQuestion.tasks.items
    for (let i = 0; i < tasksToBeDeleted.length; i++) {
      await deleteTask(tasksToBeDeleted[i].id)
    }
    // for (const item in chosenQuestion.tasks.items) {
    //   console.log("itemid", item.id)
    //   await deleteTask(item.id)
    // }
    await deleteQuestion(chosenQuestion.id)

    setOpen(false)
    setQuestions(questions.filter(question => question.id !== chosenQuestion.id))
    setChosenQuestion(null)
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
        <h4>The following are all currently active annotation questions.
        </h4>
      </Segment>
      <Segment style={{ textAlign: "left" }}>
        <p>
          <Icon name='hand point right' />
          Please choose a annotation question to delete
        </p>

        <Segment style={{ "overflow": "auto", "max-height": "30%" }}>
          <Card.Group>
            {questions ?
              questions.map((question, index) => (

                <Card
                  key={question.id}
                  fluid color={(chosenQuestion === question) ? "blue" : ""}
                  style={{ "margin-top": 2, "margin-bottom": 2, "text-align": "left", "padding": "2%" }}
                  onClick={() => setChosenQuestion(question)}
                  //href={`/annotation_tasks/${task.id}`}
                  header={`Question title: ${question.text}`}
                  //   meta={`Item ${index + 1}`}
                  description={`Completed: ${question.tasks.items.filter(item => item.completed === true).length} / ${question.tasks.items.length}`}
                />

              ))
              :
              <Segment>
                No questions to show currently
              </Segment>
            }

          </Card.Group>



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
              <Button color="purple" onClick={deleteChosenQuestion}>
                Delete
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

export default DeleteTasks;