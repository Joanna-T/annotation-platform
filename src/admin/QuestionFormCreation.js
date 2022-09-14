
import { useState } from "react";
import {
    Segment,
    Button,
    Input,
    Label,
    Icon
} from "semantic-ui-react";
import { submitForm } from "../utils/mutationUtils";


const QuestionFormCreation = ({ setWarningMessage, setWarningText }) => {
    const [createdQuestions, setCreatedQuestions] = useState([])
    const [formName, setFormName] = useState("")


    const updateQuestionText = (text, index) => {

        setCreatedQuestions(createdQuestions.map((question, innerIndex) =>
            (innerIndex === index) ? {
                ...question,
                question_text: text
            } : question
        ))
    }

    const updateQuestionCategory = (text, index) => {

        setCreatedQuestions(createdQuestions.map((question, innerIndex) =>
            (innerIndex === index) ? {
                ...question,
                question_description: text
            } : question
        ))
    }

    const updateQuestionOptions = (text, index, optionIndex) => {

        var updatedQuestion = { ...createdQuestions }

        let updatedObject = updatedQuestion[index].options.map((option, innerOptionIndex) =>
            (optionIndex === innerOptionIndex) ? text : option
        )

        setCreatedQuestions(createdQuestions.map((question, innerIndex) =>
            (innerIndex === index) ? {
                ...question,
                options: updatedObject
            } : question
        ))
    }

    const addOption = (index) => {

        setCreatedQuestions(createdQuestions.map((question, innerIndex) =>
            (innerIndex === index) ? {
                ...question,
                options: [...question.options, ""]
            } : question
        ))
    }

    const addQuestion = () => {
        setCreatedQuestions([...createdQuestions,
        {
            "question_text": "",
            "question_type": "radio",
            "options": [
                ""
            ],
            "question_description": ""
        }]

        )
    }

    const deleteQuestion = (index) => {
        setCreatedQuestions(
            createdQuestions.filter((item, innerIndex) => {
                return innerIndex !== index
            })
        )
    }

    const deleteOption = (index, optionIndex) => {
        if (createdQuestions[index].options.length === 1) {
            return
        }
        setCreatedQuestions(createdQuestions.map((question, innerIndex) =>
            (innerIndex === index) ? {
                ...question,
                options: question.options.filter((item, innerOptionIndex) => {
                    return innerOptionIndex !== optionIndex
                })
            } : question
        ))
    }

    async function submitCreatedQuestionForm() {

        if (createdQuestions.length === 0) {
            setWarningMessage(true)
            setWarningText("Please enter atleast one question to create new form")
            return
        }

        if (formName === "") {
            setWarningMessage(true)
            setWarningText("Please enter a form name")
            return
        }

        if (findIncompleteFields()) {
            setWarningMessage(true)
            setWarningText("Please fill in all fields")
            return
        }
        const formToSubmit = {
            form_description: formName,
            questions: JSON.stringify(createdQuestions)
        }

        await submitForm(formToSubmit)
        setCreatedQuestions([])
        setFormName("")

    }

    const findIncompleteFields = () => {
        var incompleteField = false
        createdQuestions.map((question) => {
            if (
                question.question_text === "" ||
                question.question_description === ""
            ) {
                incompleteField = true
            }

            question.options.map((option) => {
                if (option === "") {
                    incompleteField = true
                }
                return true
            })
            return true
        })

        return incompleteField
    }

    return (<div>
        <Segment basic>
            <Input label="Form name" value={formName} fluid placeholder='Enter form name here...' onChange={event => setFormName(event.target.value)} />
            <br></br>
            {
                createdQuestions.map((question, index) => {
                    return (
                        <Segment>
                            <Input label="Question text" value={question.question_text} fluid icon='question' placeholder='Enter question text here...' onChange={event => updateQuestionText(event.target.value, index)} />
                            <Input label="Question category" value={question.question_description} icon='question' placeholder='Enter question category here...' onChange={event => updateQuestionCategory(event.target.value, index)} />
                            <Segment basic>
                                <Label>Options</Label>
                                {
                                    question.options.map((option, optionIndex) => {
                                        return (
                                            <div>
                                                <Input value={option} icon='pencil' placeholder='Enter question option here...' onChange={event => updateQuestionOptions(event.target.value, index, optionIndex)} />
                                                <Button size="tiny" onClick={() => deleteOption(index, optionIndex)}>
                                                    <Icon name="delete"></Icon>

                                                </Button>
                                            </div>
                                        )
                                    })
                                }
                                <br></br>
                                <Button color="green" onClick={() => addOption(index)}>
                                    <Icon name="add"></Icon>
                                    Add option
                                </Button>
                            </Segment>


                            <Button color="red" onClick={() => deleteQuestion(index)}>
                                <Icon name="minus"></Icon>
                                Delete question
                            </Button>
                        </Segment>
                    )
                })
            }

            <Button color="green" onClick={addQuestion}>
                <Icon name="add"></Icon>
                Add  new question
            </Button>
            <br></br>
            <br></br>
            <Button color="blue" onClick={submitCreatedQuestionForm}>

                Submit form
            </Button>



        </Segment>
    </div>);
}

export default QuestionFormCreation;