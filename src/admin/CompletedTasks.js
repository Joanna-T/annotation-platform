import { useState, useEffect } from "react";
import { Segment, Card, } from "semantic-ui-react";
import { findCompletedTasks, groupTasksByDocument } from "../documentUtils";
import Layout from "../Layout";
import { fetchQuestions } from "../queryUtils";

const CompletedTasks = () => {
    const [questions, setQuestions] = useState([]);
    //const [questionNumber, setQuestionNumber] = useState(false);
    useEffect(() => {
        fetchQuestions("API_KEY")
            .then(result => {
                let questionsArray = []
                result.forEach(item => {
                    let groupedTasks = groupTasksByDocument(item.tasks.items);
                    let completedTasks = findCompletedTasks(groupedTasks)
                    if (completedTasks === groupedTasks.length) {
                        item["total_tasks"] = groupedTasks.length;
                        item["complete_tasks"] = completedTasks
                        questionsArray.push(item)
                    }
                })
                setQuestions(questionsArray)

            });
        //fetchQuestions();
    }, [])

    // async function fetchQuestions() {
    //     const questionData = await API.graphql({
    //         query: listMedicalQuestions,
    //         authMode: "AMAZON_COGNITO_USER_POOLS"

    //     })
    //     console.log("question",questionData.data.listMedicalQuestions.items);
    //     return questionData.data.listMedicalQuestions.items
    //     //setQuestions(questionData.data.listMedicalQuestions.items);

    // }

    if (questions.length === 0) {
        return (
            <Layout>
                <Segment>
                    No tasks to show currently.
                </Segment>

            </Layout>
        )
    }

    return (
        <div className="tasks">

            <Layout>
                <Segment color="blue" tertiary inverted>
                    <p>The following are all completed annotation tasks.</p>

                </Segment>
                <Card.Group>
                    {
                        questions && questions.map((question, index) => {
                            return (

                                <Card
                                    fluid color="blue"
                                    style={{ "margin-top": 5, "margin-bottom": 5, "text-align": "left", "padding": "2%" }}
                                    href={`/completed_tasks/${question.id}`}
                                    header={`Question title: ${question.text}`}
                                    meta={`Created: ${question.createdAt.slice(0, 10)}`}
                                    description={`No. documents: ${question["total_tasks"]}`}
                                />

                            )
                        })
                    }
                    {/* <Card href="#" style={{ "margin-bottom": 5, "text-align": "left", "padding": "2%"}}fluid color='blue' header='Option 1' />
    <Card href="#" style={{"margin-top": 5, "margin-bottom": 5, "text-align": "left", "padding": "2%"}} fluid color='blue' header='Option 2' />
    <Card href="#" style={{"margin-top": 5, "margin-bottom": 5, "text-align": "left", "padding": "2%"}} fluid color='blue' header='Option 3' /> */}




                </Card.Group>


            </Layout>

        </div>

    );
}

export default CompletedTasks;