import { useState, useEffect } from "react";
import CompletedTasks from "../admin/CompletedTasks";
import { API, Auth } from "aws-amplify";
import { listAnnotationTasks, listQuestionForms } from "../graphql/queries";
import { Link } from "react-router-dom";
import { List, Segment, Grid, Image, Card } from "semantic-ui-react";
import Layout from "../Layout";
import { fetchTasks, getTaskDocumentTitles } from "../queryUtils";

const CuratorListResults = () => {
    const [tasks, setTasks] = useState([]);
    const [documentTitle, setDocumentTitle] = useState({})

    useEffect(() => {
        fetchTasks()
            .then(result => {
                setTasks(result.filter(task => task.completed === true));
                return getTaskDocumentTitles(result)
            })
            .then(result => setDocumentTitle(result))

    }, [])

    return (
        <div className="completed-tasks">

            <Layout>
                <Segment inverted color="blue" tertiary>
                    The following are previously completed tasks.
                </Segment>
                {
                    tasks.length == 0 &&
                    <Segment>
                        <p>No tasks yet completed</p>
                    </Segment>
                }
                <Card.Group>
                    {
                        tasks.map((task, index) => (

                            <Card
                                fluid color="blue"
                                style={{ "margin-top": 5, "margin-bottom": 5, "text-align": "left", "padding": "2%" }}
                                href={`/completed_curator_tasks/${task.id}`}
                                header={`Document title: ${documentTitle[task.id]}`}
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

export default CuratorListResults;