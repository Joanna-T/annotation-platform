import { useState, useEffect } from "react";
import { Segment, Card } from "semantic-ui-react";
import Layout from "../common/Layout";
import { fetchQuestions } from "../utils/queryUtils";
import { returnActiveQuestions } from "../utils/documentUtils";

const ActiveTasks = () => {
    const [questions, setQuestions] = useState([]);
    useEffect(() => {
        fetchQuestions("API_KEY")
            .then(result => {
                const questionsArray = returnActiveQuestions(result)

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

    return (
        <div className="tasks">

            <Layout>
                <Segment color="blue" tertiary inverted>
                    <p>The following are all annotation tasks that are currently in progress.</p>

                </Segment>
                <Card.Group>
                    {
                        questions && questions.map((question, index) => {
                            return (

                                <Card
                                    key={question.id}
                                    fluid color="blue"
                                    style={{ "marginTop": 5, "marginBottom": 5, "textAlign": "left", "padding": "2%" }}
                                    href={`/active_tasks/${question.id}`}
                                    header={`Question title: ${question.text}`}
                                    meta={`Question ${index + 1}`}
                                    description={`Progress: ${question.complete_tasks}/${question.total_tasks} documents annotated completely`}
                                />

                            )
                        })
                    }



                </Card.Group>


            </Layout>

        </div>

    );
}

export default ActiveTasks;