import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import AnnotationPage from "./AnnotationPage";
import AnnotationQuestions from "./AnnotationQuestions";
import { useNavigate } from "react-router-dom";
import React from 'react';
import {
    Button,
    Checkbox,
    Grid,
    Header,
    Icon,
    Segment,
    Transition,
    Modal,
    Popup,
    Tab
} from 'semantic-ui-react';
import { updateTask } from "../utils/mutationUtils";
import { fetchTask, fetchDocument } from "../utils/queryUtils";
import useWindowSize from "../common/useWindowSize";



const TasksId = () => {
    const size = useWindowSize();
    const navigate = useNavigate();
    const { id } = useParams();
    const [task, setTask] = useState(null);

    const [documentText, setDocumentText] = useState("");

    const [questions, setQuestions] = useState(null);
    const [answers, setAnswers] = useState(null);

    const [question, setQuestion] = useState(null);
    const [questionForm, setQuestionForm] = useState(null)
    const [labelDescriptions, setLabelDescriptions] = useState(null)

    const [instructionsVisible, setInstructionsVisible] = useState(true);
    const [questionsVisible, setQuestionsVisible] = useState(true);
    const [instructionWidth, setInstructionWidth] = useState(2);
    const [mainWidth, setMainWidth] = useState(12);
    const [questionsWidth, setQuestionWidth] = useState(2);
    const [parentLabels, setParentLabels] = useState([]);
    const [documentTitle, setDocumentTitle] = useState("Loading document...")

    const [open, setOpen] = useState(false);


    const handleAnswerChange = (e => {
        const questionDescription = e.target.name;
        const questionValue = e.target.value;
        setAnswers({
            ...answers,
            [questionDescription]: questionValue
        })
        console.log(e.target.name, e.target.value)
    })

    async function handleSubmit() {

        var taskToUpdate = {
            id: task.id,
            completed: true
        }

        updateTask(taskToUpdate)

        navigate("/");
    }


    useEffect(() => {
        fetchTask(id)
            .then(async (result) => {
                setTask(result);

                const parsedQuestions = JSON.parse(result.questionForm.questions);

                setQuestions(parsedQuestions)
                setQuestionForm(result.questionForm)
                setQuestion(result.question)
                setLabelDescriptions(JSON.parse(result.question.labelDescriptions))

                const savedAnswers = JSON.parse(result.question_answers);
                setAnswers(savedAnswers);

                //console.log("ansewrs, questions length", savedAnswers, parsedQuestions.length,)
                //console.log("ansewrs, questions length", savedAnswers !== null)
                const savedLabels = JSON.parse(result.labels);
                setParentLabels(savedLabels);

                fetchDocument(result.documentFileName)
                    .then(result => {
                        //console.log("taskid results", result)
                        setDocumentText(result["abstract"] + "\n\n" + result["mainText"])
                        setDocumentTitle(result["title"])
                    })
                    .catch(err => console.log(err))

            })

    }, [])

    useEffect(() => {
        //console.log("answer in parent", answers);
        storeAnswers();
    }, [answers])

    useEffect(() => {
        //console.log("parent labels", parentLabels);
        if (parentLabels) {
            storeLabels();
        }
    }, [parentLabels])



    useEffect(() => {
        if (instructionsVisible && questionsVisible) {
            setInstructionWidth(3);
            setMainWidth(8);
            setQuestionWidth(5);

            return
        }
        if (!instructionsVisible && !questionsVisible) {
            setInstructionWidth(2);
            setMainWidth(12);
            setQuestionWidth(2);
            return
        }
        if (!instructionsVisible && questionsVisible) {
            setInstructionWidth(1);
            setMainWidth(10);
            setQuestionWidth(5);
            return
        }
        if (instructionsVisible && !questionsVisible) {
            setInstructionWidth(3);
            setMainWidth(12);
            setQuestionWidth(1);
            return
        }
    }, [questionsVisible, instructionsVisible])


    async function storeAnswers() {
        const submittedAnswers = JSON.stringify(answers);

        if (task) {
            const finalStoredAnswer = {
                id: task.id,
                question_answers: submittedAnswers
            }

            updateTask(finalStoredAnswer)
        }
        //console.log("answer submitted")
    }

    async function storeLabels() {
        const submittedLabels = JSON.stringify(parentLabels);

        //console.log("The labels being stored are:")
        //console.log(parentLabels);

        if (task) {
            const finalStoreLabels = {
                id: task.id,
                labels: submittedLabels
            }

            updateTask(finalStoreLabels)
        }


        //console.log("answer submitted")

    }

    const handleLabelChange = (labels) => {
        setParentLabels(labels);
    }

    const questionsContainerSegmentStyle = { maxHeight: '100vh', width: "95vh" }
    const questionsSegmentStyle = { "paddingLeft": "10%", "paddingRight": "10%", "color": "white" }
    const tabStyle = { maxheight: "100%", overflow: "auto" }

    const instructionSection = (
        <div>
            {
                (instructionsVisible || size.width < 850) && (
                    <Segment color='blue' secondary >

                        <Header size="small" dividing textAlign="center">
                            <Icon circular name='info' size='small' />
                            <Header.Content>Instructions</Header.Content>
                        </Header>
                        {
                            question && ("instructionLink" in question) && (question.instructionLink !== null) &&
                            <Button as="a" href={question.instructionLink} target="_blank"> View detailed instructions</Button>
                        }
                        <Segment basic style={{ maxHeight: "60vh", overflow: "auto" }}>
                            <p>Toggle the Instructions and Questions tickboxes or tabs above
                                to see or hide the instructions and questions sections.
                            </p>
                            <p>Please the read over the following document and highlight the
                                relevant sections with the appropriate labels available for selection.
                                For example if you think a section of the text is relevant to the
                                question displayed above, click the "Relevancy" button and highlight
                                the respective text.
                            </p>
                            <p>Answer the questions pertaining to the document with respect to the
                                question in the "Questions" tab.
                            </p>
                            <p>Click the Submit button when you are finished with annotation.</p>
                            <p>All changes are saved automatically.</p>
                        </Segment>
                    </Segment>

                )
            }
        </div>
    )

    const annotationPage = (
        <AnnotationPage
            annotationText={documentText}
            handleLabelChange={handleLabelChange}
            parentLabels={parentLabels}
            labelDescriptions={labelDescriptions}>
        </AnnotationPage>
    )

    const questionSection = (
        <div>
            {
                (questionsVisible || size.width < 850) && (
                    <Segment color='blue' inverted secondary style={questionsContainerSegmentStyle}>
                        <Header size="small" dividing textAlign="center">
                            <Icon name='pencil' circular size='small' />
                            <Header.Content>Please answer the following questions</Header.Content>
                        </Header>
                        <Segment basic textAlign="left" style={questionsSegmentStyle}>
                            <AnnotationQuestions questions={questions} handleAnswerChange={handleAnswerChange} answers={answers} ></AnnotationQuestions>
                        </Segment>


                    </Segment>
                )
            }
        </div>
    )

    const smallScreenPanes = [
        {
            menuItem: 'Instructions',
            pane: (
                <Tab.Pane key='instructions' style={tabStyle}>
                    {instructionSection}
                </Tab.Pane>
            ),

        },
        {
            menuItem: 'Text labels',
            pane: (
                <Tab.Pane key='text-labels' style={tabStyle}>
                    {labelDescriptions && annotationPage}
                </Tab.Pane>
            ),

        },
        {
            menuItem: 'Questions',
            pane: (
                <Tab.Pane key='questions' style={tabStyle}>
                    {questionSection}
                </Tab.Pane>
            ),

        },
    ]

    const questionsStyle = {
        "padding-left": "10%",
        "padding-right": "10%",
        color: "white"


    }


    if (task && task.completed === true) {
        return (
            <h3>This task has already been submitted</h3>
        )
    }

    return (

        <div className="task-details">
            <Grid padded style={{ height: '100vh' }}>
                <Grid.Row >
                    <Grid.Column width={3}>
                        {size.width > 850 &&
                            <div>
                                <Checkbox
                                    checked={instructionsVisible}
                                    label={{ children: <code>Instructions</code> }}
                                    onChange={(e, data) => {
                                        console.log("data checked", data.checked)
                                        setInstructionsVisible(data.checked);
                                    }}
                                />
                                <Checkbox
                                    checked={questionsVisible}
                                    label={{ children: <code>Questions</code> }}
                                    onChange={(e, data) => {
                                        console.log("data checked", data.checked)
                                        setQuestionsVisible(data.checked)

                                    }}
                                />
                            </div>
                        }

                    </Grid.Column>
                    <Grid.Column width={10}>
                        <p><b>Question:</b> {question && question.text}</p>
                        <p><b>Document title:</b> {documentTitle}</p>

                    </Grid.Column>
                    <Grid.Column width={3}>
                        {answers === null || !questions || (Object.keys(answers).length !== questions.length) ? //change this
                            <Popup content='Please answer all questions to submit this task' trigger={
                                <Button
                                    color='grey'
                                >
                                    Submit
                                </Button>} />
                            :
                            <Modal
                                open={open}
                                onClose={() => setOpen(false)}
                                onOpen={() => setOpen(true)}
                                trigger={<Button
                                    color='blue' >
                                    Submit
                                </Button>}
                            >
                                <Modal.Header> Are you sure you want to submit?</Modal.Header>
                                <Modal.Description>
                                    <Segment>You will not be able to make any more changes to this annotation task.</Segment>

                                </Modal.Description>
                                <Modal.Actions>
                                    <Button color="green" onClick={handleSubmit}>
                                        Submit
                                    </Button>
                                    <Button
                                        color="red"
                                        icon
                                        labelPosition='right'
                                        onClick={() => setOpen(false)}>
                                        Back to annotation
                                    </Button>
                                </Modal.Actions>

                            </Modal>
                        }

                    </Grid.Column>
                </Grid.Row>
                <Grid.Row style={{ height: '90%' }}>

                    {size.width > 850 &&

                        <Grid.Column width={instructionWidth}>
                            <Transition.Group
                                duration={400}
                                animation="fade up"
                            >
                                {instructionSection}
                            </Transition.Group>

                        </Grid.Column>
                    }
                    {size.width > 850 &&
                        <Grid.Column width={mainWidth}>

                            <Transition.Group
                                duration={400}
                                animation="fade up"
                            >
                                {annotationPage}
                            </Transition.Group>

                        </Grid.Column>
                    }
                    {size.width > 850 &&
                        <Grid.Column width={questionsWidth}>
                            <Transition.Group
                                duration={400}
                                animation="fade up"
                            >
                                {questionSection}
                            </Transition.Group>
                        </Grid.Column>
                    }

                    {size.width < 850 &&
                        <Tab menu={{ color: "blue", attached: true, tabular: true }} panes={smallScreenPanes} renderActiveOnly={false} />
                    }


                </Grid.Row>
            </Grid>
        </div>
    )

}

export default TasksId;

