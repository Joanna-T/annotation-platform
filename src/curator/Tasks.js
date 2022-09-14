import { useState, useEffect } from "react";
import { Segment } from "semantic-ui-react";
import Layout from "../common/Layout";
import { fetchTasks } from "../utils/queryUtils"
import ListTasks from "./ListTasks";
import { checkIfCurator } from "../utils/authUtils";
import UnauthorisedAccess from "../common/UnauthorisedAccess";


const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [documentTitles, setDocumentTitles] = useState({})

    useEffect(() => {
        fetchTasks()
            .then(results => {

                const incompleteTasks = results.filter(result => result.completed === false)
                setTasks(incompleteTasks);
                let titles = {}
                incompleteTasks.map(task => {
                    titles[task.id] = task.documentTitle
                    return null
                })
                setDocumentTitles(titles)
                return incompleteTasks
            })

    }, [])



    if (!checkIfCurator()) {
        return (
            <UnauthorisedAccess></UnauthorisedAccess>
        )
    }

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
                {documentTitles && tasks &&
                    <ListTasks
                        tasks={tasks}
                        documentTitles={documentTitles}
                        path={"/annotation_tasks/"}>

                    </ListTasks>
                }



            </Layout>

        </div>

    );
}

export default Tasks;

