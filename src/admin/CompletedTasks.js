import { useState, useEffect } from "react";
import { Segment, Card, } from "semantic-ui-react";
import { findCompletedTasks, groupTasksByDocument } from "../utils/documentUtils";
import Layout from "../common/Layout";
import { fetchQuestions } from "../utils/queryUtils";

const CompletedTasks = () => {
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        fetchQuestions("AMAZON_COGNITO_USER_POOLS")
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
                    <p>The following are all completed annotation tasks.</p>

                </Segment>
                <Card.Group>
                    {
                        questions && questions.map((question, index) => {
                            return (

                                <Card
                                    key={question.id}
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

                </Card.Group>


            </Layout>

        </div>

    );
}

export default CompletedTasks;