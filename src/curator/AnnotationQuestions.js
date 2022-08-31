import { Form } from "semantic-ui-react";
import { memo } from "react";



const AnnotationQuestions = ({ questions, handleAnswerChange, answers }) => {

    if (!questions) {
        return (
            <h4>Loading questions...</h4>
        )
    }

    return (
        <Form textalign="left" inverted style={{ overflow: "auto", maxHeight: "80vh" }} >
            {questions.map(function (question, index) {
                return (
                    <Form.Group grouped key={index}>
                        <h5> {index + 1} {". "} {question.question_text}</h5>
                        {
                            question.options.map((option) => {
                                return (
                                    <Form.Field
                                        key={option}
                                        label={option}
                                        control='input'
                                        type={question.question_type}
                                        name={question.question_description}
                                        value={option}
                                        onChange={handleAnswerChange}
                                        checked={(answers && answers[question.question_description]) ?
                                            answers[question.question_description] === option : false}>

                                    </Form.Field>
                                )

                            })
                        }

                    </Form.Group>
                )
            })}

        </Form>
    );

}

export default memo(AnnotationQuestions);
