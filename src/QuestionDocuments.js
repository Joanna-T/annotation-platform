import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import React from 'react';
import {
    Segment,
    Card
} from 'semantic-ui-react';
import { fetchQuestion } from "./queryUtils";
import Layout from "./Layout";
import { groupTasksByDocument } from "./documentUtils";
import { getTaskDocumentTitles } from "./queryUtils";


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
                return getTaskDocumentTitles(
                    tasks.map(taskGroup => taskGroup[0])
                )
            })
            .then(result => {
                setDocumentTitles(result)
            })

    }, [])


    const handleNavigate = (tasks) => {
        var s = tasks[0].document_title;
        s = s.substring(s.indexOf("/") + 1);
        if (groupedTasks) {
            navigate(`results`, { state: { annotation_tasks: tasks, grouped_tasks: groupedTasks } })
        }

    }

    return (
        <Layout>
            <Segment tertiary color="blue" inverted>
                Select a document below to view annotation results
            </Segment>
            <Card.Group>
                {
                    question && groupedTasks.map((tasks, index) => (

                        <Card
                            fluid color="blue"
                            style={{ "margin-top": 5, "margin-bottom": 5, "text-align": "left", "padding": "2%" }}
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