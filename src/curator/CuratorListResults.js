import { useState, useEffect } from "react";
import { Segment, Card } from "semantic-ui-react";
import Layout from "../common/Layout";
import { fetchTasks, getTaskDocumentTitles } from "../utils/queryUtils";

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

    const cardStyle = { "margin-top": 5, "margin-bottom": 5, "text-align": "left", "padding": "2%" }

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
                                key={task.id}
                                fluid color="blue"
                                style={cardStyle}
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