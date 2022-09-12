import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import React from 'react';
import {
    Segment,
    Card
} from 'semantic-ui-react';
import { fetchQuestion } from "../utils/queryUtils";
import Layout from "./Layout";
import { groupTasksByDocument } from "../utils/documentUtils";
import { getTaskDocumentTitles } from "../utils/queryUtils";


const QuestionDocuments = () => {
    const { id } = useParams();
    let navigate = useNavigate();

    const [groupedTasks, setGroupedTasks] = useState([]);
    const [question, setQuestion] = useState(null);
    const [documentTitles, setDocumentTitles] = useState({})

    useEffect(() => {
        fetchQuestion(id, "API_KEY")
            .then(question => {
                setQuestion(question)
                let tasks = groupTasksByDocument(question.tasks.items)
                setGroupedTasks(tasks)
                let titles = {}
                tasks.map(groupedTasks => { titles[groupedTasks[0].id] = groupedTasks[0].documentTitle })
                setDocumentTitles(titles)

            })


    }, [])


    const handleNavigate = (tasks) => {
        var s = tasks[0].documentFileName;
        s = s.substring(s.indexOf("/") + 1);
        if (groupedTasks) {
            navigate(`results`, { state: { annotationTasks: tasks, chosenTasks: groupedTasks } })
        }

    }

    const cardStyle = { "marginTop": 5, "marginBottom": 5, "textAlign": "left", "padding": "2%" }

    return (
        <Layout>
            <Segment tertiary color="blue" inverted>
                Select a document below to view annotation results
            </Segment>
            <Card.Group>
                {
                    question && groupedTasks.map((tasks, index) => (

                        <Card
                            key={tasks[0].id}
                            fluid color="blue"
                            style={cardStyle}
                            onClick={() => handleNavigate(tasks)}
                            header={`Document title: ${documentTitles[tasks[0].id]}`}
                            meta={`Question created: ${question.createdAt.substring(0, 10)}`}
                            description={`Question title: ${question.text}`}
                        />
                    ))
                }
            </Card.Group>

        </Layout>
    );
}

export default QuestionDocuments;