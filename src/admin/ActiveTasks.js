import { useState, useEffect } from "react";
import { Segment } from "semantic-ui-react";
import Layout from "../common/Layout";
import { fetchQuestions } from "../utils/queryUtils";
import { returnActiveQuestions } from "../utils/documentUtils";
import ListQuestions from "./ListQuestions";
import { checkIfAdmin } from "../utils/authUtils";
import UnauthorisedAccess from "../common/UnauthorisedAccess";

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

    if (!checkIfAdmin()) {
        return (
            <UnauthorisedAccess></UnauthorisedAccess>
        )
    }

    return (
        <div className="tasks">

            <Layout>
                <Segment color="blue" tertiary inverted>
                    <p>The following are all annotation tasks that are currently in progress.</p>

                </Segment>

                <ListQuestions
                    questions={questions}
                    path={"/active_tasks/"}>

                </ListQuestions>



            </Layout>

        </div>

    );
}

export default ActiveTasks;