import { useState, useEffect } from "react";
import { listMedicalQuestions, getMedicalQuestion } from "./graphql/queries";
import { createAnnotationTask } from "./graphql/mutations";
import { Card, Grid, Segment, Label, Button, Icon, Message, Modal } from "semantic-ui-react";
import { API, Storage, Amplify, Auth } from "aws-amplify";
import { groupTasksByDocument, findCompletedTasks, createReassignedTasks } from "./documentUtils";
import { listCurators, fetchQuestions } from "./queryUtils";
import { submitTask } from "./mutationUtils";
import Layout from "./Layout";



const ReassignTasks = () => {
    const [incompleteQuestions, setIncompleteQuestions] = useState(null)
    const [groupedTasks, setGroupedTasks] = useState(null);
    const [chosenQuestion, setChosenQuestion] = useState(null);
    const [allQuestionTasks, setAllQuestionTasks] = useState(null);
    const [warningMessage, setWarningMessage] = useState(false)
    const [open, setOpen] = useState(false)

    const minimumRequiredCurators = process.env.REACT_APP_NUMBER_CURATORS

    useEffect(() => {
        fetchQuestions("AMAZON_COGNITO_USER_POOLS").then(result => {
            findIncompleteQuestions(result);
        })
    }, [])

    const findIncompleteQuestions = (questions) => {
        let questionItems = {};
        let tempIncompleteQuestions = []



        for (const question of questions) {
            let questionTasks = groupTasksByDocument(question.tasks.items)
            for (const tasks of questionTasks) {
                let numCompletedTasks = tasks.filter(task => task.completed === true).length;
                if (numCompletedTasks < minimumRequiredCurators) {
                    questionItems[question.id] = questionTasks;
                    tempIncompleteQuestions.push(question)
                    break;
                }
            }
        }
        console.log("find incomplete tasks", questionItems)
        setIncompleteQuestions(tempIncompleteQuestions)
        setAllQuestionTasks(questionItems)
    }

    const findTotalTasks = (questionID) => {
        return allQuestionTasks[questionID].length;
    }
    return (

        <Layout>

            <Segment basic>
                <h4>Below are annotation question tasks which are yet to be completed</h4>
            </Segment>
            {
                warningMessage && (
                    <Message
                        color="red"
                        onDismiss={() => setWarningMessage(false)}
                        content='Please choose a question to reassign.'
                    />
                )
            }
            <Segment style={{ textAlign: "left" }}>

                <p><Icon name='hand point right' />Please choose a task to reassign</p>
                <Segment style={{ "overflow": "auto", "max-height": "30%" }}>
                    <Card.Group>
                        {incompleteQuestions && allQuestionTasks ?
                            incompleteQuestions.map((question, index) => (

                                <Card
                                    fluid color={(chosenQuestion === question) ? "blue" : ""}
                                    style={{ "margin-top": 2, "margin-bottom": 2, "text-align": "left", "padding": "2%" }}
                                    onClick={() => setChosenQuestion(question)}
                                    //href={`/annotation_tasks/${task.id}`}
                                    header={`Question title: ${question.text}`}
                                    //   meta={`Item ${index + 1}`}
                                    description={`Completed: ${findCompletedTasks(allQuestionTasks[question.id], minimumRequiredCurators)} / ${findTotalTasks(question.id)}`}
                                />




                            ))
                            :
                            <Segment>
                                No questions to show currently
                            </Segment>
                        }

                    </Card.Group>


                </Segment>
                <p> Chosen question:  <Label color='grey' horizontal>
                    {chosenQuestion ? chosenQuestion.text : "Please pick a question above"}
                </Label></p>
                <Segment style={{ "overflow": "auto", "max-height": "30%" }}>
                    <Card.Group>
                        {chosenQuestion ?
                            allQuestionTasks[chosenQuestion.id].map((tasks, index) => (

                                <Card
                                    fluid
                                    style={{ "margin-top": 2, "margin-bottom": 2, "text-align": "left", "padding": "2%" }}
                                    header={`Document title: ${tasks[0].document_title}`}
                                    //   meta={`Item ${index + 1}`}
                                    description={`Completed: ${tasks.filter(task => task.completed === true).length} / ${tasks.length}`}
                                />
                            ))
                            :
                            <Card
                                fluid
                                description={"Please select a document to view results"}>

                            </Card>
                        }

                    </Card.Group>


                </Segment>
                {!chosenQuestion ?
                    <Button
                        color='grey'
                        onClick={() => {
                            setWarningMessage(true);
                        }}
                    >
                        Reassign tasks
                    </Button>
                    :
                    <Modal
                        open={open}
                        onClose={() => setOpen(false)}
                        onOpen={() => setOpen(true)}
                        trigger={<Button
                            color='blue' >
                            Reassign tasks
                        </Button>}
                    >
                        <Modal.Header> Are you sure you want to reassign these tasks?</Modal.Header>
                        <Modal.Actions>
                            <Button color="green" onClick={() => {
                                createReassignedTasks(allQuestionTasks[chosenQuestion.id]).forEach(result => submitTask(result, "API_KEY"))
                            }}>
                                Submit
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

export default ReassignTasks;
