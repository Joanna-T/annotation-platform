import { useState, useEffect } from "react";
import { API, Auth } from "aws-amplify";
import { listAnnotationTasks, listQuestionForms } from "../graphql/queries";
import { Link } from "react-router-dom";
import { List, Segment, Grid, Image, Card } from "semantic-ui-react";
import { tasksByUsername } from "../graphql/queries";
import Layout from "../common/Layout";
import { fetchTasks } from "../utils/queryUtils"
import { fetchDocument, getTaskDocumentTitles } from "../utils/queryUtils";

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [documentTitles, setDocumentTitles] = useState({})

    useEffect(() => {
        fetchTasks()
            .then(results => {
                const incompleteTasks = results.filter(result => result.completed === false)
                setTasks(incompleteTasks);
                return incompleteTasks
            })
            .then(tasks => {
                return getTaskDocumentTitles(tasks)
            })
            .then(result => {
                console.log("getDocumentTitle", result)
                setDocumentTitles(result)
            })
    }, [])



    const sampleText = ["hello", "there"]

    if (!tasks) {
        return (
            <Layout>
                <Segment>
                    No tasks currently available.
                </Segment>
            </Layout>
        )
    }

    return (
        <div className="tasks">

            <Layout>
                <Segment tertiary inverted color="blue">
                    <p>The following are all the documents currently available for annotation.
                        Please annotate the following with respect to the given medical question.
                        Pick one below to get started.


                    </p>
                </Segment>
                {
                    tasks.length == 0 &&
                    <Segment style={{ width: "100%" }}>
                        <p>No tasks currently available</p>
                    </Segment>
                }
                <Card.Group>

                    {
                        tasks.map((task, index) => (

                            <Card
                                key={task.id}
                                fluid color="blue"
                                style={{ "margin-top": 5, "margin-bottom": 5, "text-align": "left", "padding": "2%" }}
                                href={`/annotation_tasks/${task.id}`}
                                header={`Document title: ${documentTitles[task.id]}`}
                                meta={`Created ${task.createdAt.substring(0, 10)}`}
                                description={`Question: ${task.question.text}`}
                            />

                        ))
                    }

                </Card.Group>


            </Layout>

        </div>

    );
}

export default Tasks;

