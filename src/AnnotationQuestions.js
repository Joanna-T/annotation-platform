import { API, Storage } from "aws-amplify";
import { getAnnotationTask,  } from "./graphql/queries"
import { Form, Label, Segment } from "semantic-ui-react";
import { useState, useEffect } from "react";

const testQuestions = [
    {"question_description": "Category 1",
    "question_text": "This is question one",
    "options" : ["Option 1", "Option 2", "Option 3"],
    "question_type": "radio"},
    {"question_description": "Category 2",
    "question_text": "This is question two",
    "options" : ["Option 4", "Option 5", "Option 6"],
    "question_type": "radio"}
]

const AnnotationQuestions = ({questions, handleAnswerChange, answers}) => {
    //const [answers, setAnswers] = useState()
    // const handleSubmit = (event) => {
    //     const formData = Object.fromEntries(new FormData(event.target));
    //     console.log(formData);
    //     setAnswers(formData);
    // }

    useEffect(() => {
        console.log(answers)
    }, [answers])

    // const handleChange = (e => {
    //     const questionDescription = e.target.name;
    //     const questionValue = e.target.value;
    //     setAnswers({...answers,
    //         [questionDescription]: questionValue } )
    //     console.log(e.target.name,e.target.value)
    // })

    if (!questions) {
        return (
            <h4>Loading questions...</h4>
        )
    }

    return ( 
       <Form textAlign="left" inverted style={{overflow:"auto", maxHeight:"25vh"}} >
           {questions.map(function(question, index) {
                return (
     <Form.Group grouped >
     <h5> {index + 1} {". "} {question.question_text}</h5>
     {
         question.options.map((option) =>{
             return(
                <Form.Field
         label={option}
         control='input'
         type={question.question_type}
         name={question.question_description}
         value={option}
         onChange={handleAnswerChange}
         checked={ answers && answers[question.question_description] &&
             answers[question.question_description] === option}>

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
 
export default AnnotationQuestions;


// {
//     questions.map((question) => {
//         <p>{question}</p>
//      // <Form.Group grouped >
//      // <label> {question.question_text}</label>
//      // {/* {
//      //     question.question_options.map((option) =>{
//      //         <Form.Field
//      //     label={option}
//      //     control='input'
//      //     type={question.question_type}
//      //     name={question.question_description}>
//      // </Form.Field>
//      //     })
//      // } */}
     
//      // </Form.Group>
//     })
// }