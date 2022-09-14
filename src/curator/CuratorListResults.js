import { useState, useEffect } from "react";
import { Segment } from "semantic-ui-react";
import Layout from "../common/Layout";
import { fetchTasks } from "../utils/queryUtils";
import ListTasks from "./ListTasks";
import { checkIfCurator } from "../utils/authUtils";
import UnauthorisedAccess from "../common/UnauthorisedAccess";


const CuratorListResults = () => {
    const [tasks, setTasks] = useState([]);
    const [documentTitles, setDocumentTitles] = useState({})

    useEffect(() => {
        fetchTasks()
            .then(result => {
                let completeTasks = result.filter(task => task.completed === true)
                setTasks(completeTasks);
                let titles = {}
                completeTasks.map(task => {
                    titles[task.id] = task.documentTitle
                    return null
                })
                setDocumentTitles(titles)


            })

    }, [])

    if (!checkIfCurator()) {
        return (
            <UnauthorisedAccess></UnauthorisedAccess>
        )
    }

    return (
        <div className="completed-tasks">

            <Layout>
                <Segment inverted color="blue" tertiary>
                    The following are previously completed tasks.
                </Segment>
                <ListTasks
                    tasks={tasks}
                    documentTitles={documentTitles}
                    path={"/completed_curator_tasks/"}
                >

                </ListTasks>

            </Layout>
        </div>
    );
}

export default CuratorListResults;