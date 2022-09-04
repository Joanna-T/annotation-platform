import { useState, useEffect } from "react";
import { Segment, Card } from "semantic-ui-react";
import Layout from "../common/Layout";
import { fetchQuestions } from "../utils/queryUtils";
import { returnActiveQuestions } from "../utils/documentUtils";
import ListQuestions from "./ListQuestions";

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

    const viewCardStyle = { "marginTop": 5, "marginBottom": 5, "textAlign": "left", "padding": "2%" }

    return (
        <div className="tasks">

            <Layout>
                <Segment color="blue" tertiary inverted>
                    <p>The following are all annotation tasks that are currently in progress.</p>

                </Segment>

                <ListQuestions
                    questions={questions}>

                </ListQuestions>



            </Layout>

        </div>

    );
}

export default ActiveTasks;