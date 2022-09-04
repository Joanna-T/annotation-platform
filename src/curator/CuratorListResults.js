import { useState, useEffect } from "react";
import { Segment, Card } from "semantic-ui-react";
import Layout from "../common/Layout";
import { fetchTasks, getTaskDocumentTitles } from "../utils/queryUtils";
import ListTasks from "./ListTasks";

const CuratorListResults = () => {
    const [tasks, setTasks] = useState([]);
    const [documentTitles, setDocumentTitles] = useState({})

    useEffect(() => {
        fetchTasks()
            .then(result => {
                setTasks(result.filter(task => task.completed === true));
                return getTaskDocumentTitles(result)
            })
            .then(result => setDocumentTitles(result))

    }, [])

    const cardStyle = { "margin-top": 5, "margin-bottom": 5, "text-align": "left", "padding": "2%" }

    return (
        <div className="completed-tasks">

            <Layout>
                <Segment inverted color="blue" tertiary>
                    The following are previously completed tasks.
                </Segment>
                <ListTasks
                    tasks={tasks}
                    documentTitles={documentTitles}
                >

                </ListTasks>


            </Layout>
        </div>
    );
}

export default CuratorListResults;