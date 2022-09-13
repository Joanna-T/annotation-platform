import { useState, useEffect } from "react";
import { Card, Segment, Label, Button, Icon, Message, Modal } from "semantic-ui-react";
import { groupTasksByDocument, findCompletedTasks } from "../utils/documentUtils";
import { createReassignedTasks } from "../utils/reassignTaskUtils";
import { fetchQuestions } from "../utils/queryUtils";
import Layout from "../common/Layout";
import { useNavigate } from "react-router-dom";
import { checkIfAdmin } from "../utils/authUtils";
import UnauthorisedAccess from "../common/UnauthorisedAccess";



const ReassignTasks = () => {
    const [incompleteQuestions, setIncompleteQuestions] = useState(null)
    const [chosenQuestion, setChosenQuestion] = useState(null);
    const [allQuestionTasks, setAllQuestionTasks] = useState(null);
    const [warningMessage, setWarningMessage] = useState(false)
    const [open, setOpen] = useState(false)
    const [warningText, setWarningText] = useState("Please choose a question to reassign")
    const [loading, setLoading] = useState(false)


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
        console.log(questions)



        for (const question of questions) {
            let questionTasks = groupTasksByDocument(question.tasks.items)
            console.log(questionTasks)
            for (const tasks of questionTasks) {
                let numCompletedTasks = tasks.filter(task => task.completed === true).length;
                if (numCompletedTasks < minimumRequiredCurators) {
                    questionItems[question.id] = questionTasks;
                    tempIncompleteQuestions.push(question)
                    break;
                }
            }
        }

        console.log(tempIncompleteQuestions)
        setIncompleteQuestions(tempIncompleteQuestions)
        setAllQuestionTasks(questionItems)
        console.log("function finished")
    }

    const findTotalTasks = (questionID) => {
        return allQuestionTasks[questionID].length;
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
                <h4>Below are annotation question tasks which are yet to be completed</h4>
            </Segment>

            <Segment style={{ textAlign: "left" }}>

                <p><Icon name='hand point right' />Please choose a task to reassign</p>



                <p><b>NOTE:</b> "Completed" denotes the number of document annotated by the required number of curators,
                    which is currently set at {process.env.REACT_APP_NUMBER_CURATORS}
                </p>
                <Segment style={segmentStyle}>
                    <Card.Group data-testid="list">
                        {incompleteQuestions && incompleteQuestions.length > 0 && allQuestionTasks ?
                            incompleteQuestions.map((question, index) => (

                                <Card
                                    key={question.id}
                                    fluid color={(chosenQuestion === question) ? "blue" : undefined}
                                    style={cardStyle}
                                    onClick={() => setChosenQuestion(question)}
                                    header={`Question title: ${question.text}`}
                                    description={`Completed: ${findCompletedTasks(allQuestionTasks[question.id], minimumRequiredCurators)} / ${findTotalTasks(question.id)}`}
                                />




                            ))
                            :
                            <Segment basic>No tasks to show</Segment>
                        }

                    </Card.Group>


                </Segment>
                <p style={{ display: "inline" }}> Chosen question:</p>
                <Label color='grey' horizontal>
                    {chosenQuestion ? chosenQuestion.text : "Please pick a question above"}
                </Label>
                <Segment style={segmentStyle}>
                    <Card.Group>
                        {chosenQuestion ?
                            allQuestionTasks[chosenQuestion.id].map((tasks, index) => (

                                <Card
                                    key={tasks[0].id}
                                    fluid
                                    style={cardStyle}
                                    header={`Document title: ${tasks[0].documentTitle}`}
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
                            {
                                loading ?
                                    <Button color="green" loading> Submit</Button>
                                    :
                                    <Button color="green" onClick={async () => {
                                        setLoading(true)
                                        let result = await createReassignedTasks(allQuestionTasks[chosenQuestion.id])
                                        if (result != "") {
                                            setWarningMessage(true)
                                            setWarningText(result)
                                            setOpen(false)
                                            setLoading(false)
                                            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                                        }
                                        else {
                                            setLoading(false)
                                            navigate("/")
                                        }

                                    }}>
                                        Submit
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

export default ReassignTasks;
