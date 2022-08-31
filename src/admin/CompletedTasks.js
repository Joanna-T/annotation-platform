import { useState, useEffect } from "react";
import { Segment, Card, } from "semantic-ui-react";
import Layout from "../common/Layout";
import { fetchQuestions } from "../utils/queryUtils";
import { returnCompletedQuestions } from "../utils/documentUtils";

const CompletedTasks = () => {
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        fetchQuestions("AMAZON_COGNITO_USER_POOLS")
            .then(result => {

                const questionsArray = returnCompletedQuestions(result)

                setQuestions(questionsArray)

            });
    }, [])

    if (questions.length === 0) {
        return (
            <Layout>
                <Segment>
                    No tasks to show currently.
                </Segment>

            </Layout>
        )
    }

    const viewCardStyle = { "marginTop": 5, "marginBottom": 5, "textAlign": "left", "padding": "2%" }

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
                                    key={question.id}
                                    fluid color="blue"
                                    style={viewCardStyle}
                                    href={`/completed_tasks/${question.id}`}
                                    header={`Question title: ${question.text}`}
                                    meta={`Created: ${question.createdAt.slice(0, 10)}`}
                                    description={`No. documents: ${question["total_tasks"]}`}
                                />

                            )
                        })
                    }

                </Card.Group>


            </Layout>

        </div>

    );
}

export default CompletedTasks;