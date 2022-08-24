import { listMedicalQuestions } from "../graphql/queries";
import { useState, useEffect } from "react";
import { API, Auth } from "aws-amplify";
import { listAnnotationTasks, listQuestionForms } from "../graphql/queries";
import { Link } from "react-router-dom";
import { List, Segment, Grid, Image, Card } from "semantic-ui-react";
import { findCompletedTasks, groupTasksByDocument } from "../utils/documentUtils";
import Layout from "../common/Layout";
import { fetchQuestions } from "../utils/queryUtils";

const ActiveTasks = () => {
    const [questions, setQuestions] = useState([]);
    useEffect(() => {
        fetchQuestions("API_KEY")
            .then(result => {
                let questionsArray = []
                result.forEach(item => {
                    console.log("activetasks for question", item, item.tasks)
                    let groupedTasks = groupTasksByDocument(item.tasks.items);
                    let completedTasks = findCompletedTasks(groupedTasks)
                    if (completedTasks < groupedTasks.length) { //length of grouped tasks is number of documents
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
                    <p>The following are all annotation tasks that are currently in progress.</p>

                </Segment>
                <Card.Group>
                    {
                        questions && questions.map((question, index) => {
                            return (

                                <Card
                                    key={question.id}
                                    fluid color="blue"
                                    style={{ "margin-top": 5, "margin-bottom": 5, "text-align": "left", "padding": "2%" }}
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