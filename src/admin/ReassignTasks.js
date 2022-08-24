import { useState, useEffect } from "react";
import { listMedicalQuestions, getMedicalQuestion } from "../graphql/queries";
import { createAnnotationTask } from "../graphql/mutations";
import { Card, Grid, Segment, Label, Button, Icon, Message, Modal, Checkbox } from "semantic-ui-react";
import { API, Storage, Amplify, Auth } from "aws-amplify";
import { groupTasksByDocument, findCompletedTasks, createReassignedTasks } from "../utils/documentUtils";
import { listCurators, fetchQuestions, fetchSuggestions } from "../utils/queryUtils";
import { submitTask, deleteSuggestion } from "../utils/mutationUtils";
import Layout from "../common/Layout";
import { Navigate, useNavigate } from "react-router-dom";



const ReassignTasks = () => {
    const [incompleteQuestions, setIncompleteQuestions] = useState(null)
    const [groupedTasks, setGroupedTasks] = useState(null);
    const [chosenQuestion, setChosenQuestion] = useState(null);
    const [allQuestionTasks, setAllQuestionTasks] = useState(null);
    const [warningMessage, setWarningMessage] = useState(false)
    const [open, setOpen] = useState(false)
    const [warningText, setWarningText] = useState("Please choose a question to reassign")


    const navigate = useNavigate();

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
                <h4>Below are annotation question tasks which are yet to be completed</h4>
            </Segment>

            <Segment style={{ textAlign: "left" }}>

                <p><Icon name='hand point right' />Please choose a task to reassign</p>



                <p><b>NOTE:</b> "Completed" denotes the number of document annotated by the required number of curators,
                    which is currently set at {process.env.REACT_APP_NUMBER_CURATORS}
                </p>
                <Segment style={{ "overflow": "auto", "max-height": "30%" }}>
                    <Card.Group>
                        {incompleteQuestions && allQuestionTasks ?
                            incompleteQuestions.map((question, index) => (

                                <Card
                                    key={question.id}
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
                                    key={tasks[0].id}
                                    fluid
                                    style={{ "margin-top": 2, "margin-bottom": 2, "text-align": "left", "padding": "2%" }}
                                    header={`Document title: ${tasks[0].document_title}`}
                                    //   meta={`Item ${index + 1}`}
                                    description={`${tasks.filter(task => task.completed === true).length} documents annotated out of ${tasks.length}`}
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
                            setWarningText("Please select a question to reassign")
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
                        <Modal.Content> Incompleted tasks for this question will be redistributed to new curators.</Modal.Content>
                        <Modal.Actions>
                            <Button color="green" onClick={async () => {
                                // try {
                                //     await createReassignedTasks(allQuestionTasks[chosenQuestion.id])
                                //     navigate("/")
                                // } catch (err) {
                                //     setWarningMessage(true)
                                //     setWarningText("Insufficient curators to assign tasks")
                                // }

                                let result = await createReassignedTasks(allQuestionTasks[chosenQuestion.id])
                                if (result != "") {
                                    setWarningMessage(true)
                                    setWarningText(result)
                                    setOpen(false)
                                }
                                else {
                                    navigate("/")
                                }

                                //.forEach(result => submitTask(result, "API_KEY"))

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
