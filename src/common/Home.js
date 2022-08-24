import Layout from "./Layout";
import { useState, useEffect } from "react";
import { Search, Segment, Input, Card, Header, Icon, Modal, Button, Message } from "semantic-ui-react";
//import { fetchQuestions } from "./queryUtils";
import { findCompletedTasks, groupTasksByDocument } from "../utils/documentUtils";
import { listMedicalQuestions } from "../graphql/queries";
import { submitSuggestion } from "../utils/mutationUtils";
import { API, graphqlOperation, Auth } from "aws-amplify"
const Home = () => {
    const [searchInput, setSearchInput] = useState("");
    const [allQuestions, setAllQuestions] = useState([,
    ])
    const [visibleQuestions, setVisibleQuestions] = useState([])
    const [admin, setAdmin] = useState(false)
    const [open, setOpen] = useState(false)
    const [confirmationMessage, setConfirmationMessage] = useState(false)
    const [suggestionInput, setSuggestionInput] = useState("")

    useEffect(() => {
        let newQuestions = allQuestions.filter((question) => {
            return question.text.toLowerCase().includes(searchInput.toLowerCase())
        })
        setVisibleQuestions(newQuestions)
    }, [searchInput])

    const [questions, setQuestions] = useState([]);
    //const [questionNumber, setQuestionNumber] = useState(false);
    useEffect(() => {
        //API.graphql(graphqlOperation(listMedicalQuestions))
        authListener();
        fetchQuestions("API_KEY")
            .then(result => {
                let questionsArray = []
                result.forEach(item => {
                    let groupedTasks = groupTasksByDocument(item.tasks.items);
                    let completedTasks = findCompletedTasks(groupedTasks)
                    if (completedTasks === groupedTasks.length) { //length is total number of documents
                        item["total_tasks"] = groupedTasks.length;
                        item["complete_tasks"] = completedTasks
                        questionsArray.push(item)
                    }
                })
                setVisibleQuestions(questionsArray)
                setAllQuestions(questionsArray)

            });
        //fetchQuestions();
    }, [])

    const handleChange = (e) => {
        e.preventDefault();
        setSearchInput(e.target.value)

    }

    const handleSuggestionChange = (e) => {
        e.preventDefault();
        setSuggestionInput(e.target.value)
    }

    async function fetchQuestions() {
        const questionsData = await API.graphql({
            query: listMedicalQuestions,
            authMode: "API_KEY"

        })
        console.log("questions", questionsData.data.listMedicalQuestions.items);
        //setQuestions(questionsData.data.listMedicalQuestions.items);
        return questionsData.data.listMedicalQuestions.items

    }

    async function authListener() {
        try {
            const user = await Auth.currentAuthenticatedUser();

            const groups = user.signInUserSession.accessToken.payload["cognito:groups"];
            if (groups) {
                if (groups.includes("Admin")) {
                    setAdmin(true);
                }
            }

        } catch (err) { }
    }

    async function handleSubmit() {
        const suggestion = {
            text: suggestionInput
        }
        setOpen(false)
        setConfirmationMessage(true)
        submitSuggestion(suggestion, "API_KEY")

    }

    // const questions = [
    //     { text: "Belgium", continent: "Europe" },
    //     { text: "India", continent: "Asia" },
    //     { text: "Bolivia", continent: "South America" },
    //     { text: "Ghana", continent: "Africa" },
    //     { text: "Japan", continent: "Asia" },
    //     { text: "Canada", continent: "North America" },
    //     { text: "New Zealand", continent: "Australasia" },
    //     { text: "Italy", continent: "Europe" },
    //     { text: "South Africa", continent: "Africa" },
    //     { text: "China", continent: "Asia" },
    //     { text: "Paraguay", continent: "South America" },
    //     { text: "Usa", continent: "North America" },
    //     { text: "France", continent: "Europe" },
    //     { text: "Botswana", continent: "Africa" },
    //     { text: "Spain", continent: "Europe" },
    //     { text: "Senegal", continent: "Africa" },
    //     { text: "Brazil", continent: "South America" },
    //     { text: "Denmark", continent: "Europe" },
    //     { text: "Mexico", continent: "South America" },
    //     { text: "Australia", continent: "Australasia" },
    //     { text: "Tanzania", continent: "Africa" },
    //     { text: "Bangladesh", continent: "Asia" },
    //     { text: "Portugal", continent: "Europe" },
    //     { text: "Pakistan", continent:"Asia" },
    //   ];

    return (
        <Layout>
            <Segment basic>
                <Header as='h2' icon textAlign='center'>
                    <Icon color="blue" name='edit outline' circular />
                    <Header.Content>Welcome to AnnotateIt</Header.Content>
                </Header>
                <p>Please enter a search query below to find relevant annotation question results</p>

            </Segment>

            <Segment basic style={{ "paddingLeft": "10%", "paddingRight": "10%" }}>

                <Input
                    icon="search"
                    type="text"
                    placeholder="Search questions"
                    onChange={handleChange}
                    value={searchInput}
                    style={{ "borderColor": "blue", width: "100%", "borderRadius": "30px", }} />
                {
                    // admin && (
                    true && (
                        <div>
                            <small>Cant find what you're looking for? </small>
                            <Modal
                                open={open}
                                onClose={() => setOpen(false)}
                                onOpen={() => setOpen(true)}
                                trigger={<small><u>Click here to submit a new question for review.</u></small>}
                            >
                                <Modal.Header> Suggestion submission</Modal.Header>
                                <Modal.Description>
                                    <Segment>
                                        <p>Please enter the question you would like to be annotated below:</p>
                                        <Input
                                            icon="pencil"
                                            type="text"
                                            placeholder="Query here"
                                            onChange={handleSuggestionChange}
                                            value={suggestionInput}
                                            style={{ "borderColor": "blue", width: "100%", "borderRadius": "30px", }} />
                                    </Segment>

                                </Modal.Description>
                                <Modal.Actions>
                                    <Button color="green" onClick={handleSubmit}>
                                        Submit suggestion
                                    </Button>
                                    <Button
                                        color="red"
                                        icon="checkmark"
                                        labelPosition='right'
                                        onClick={() => setOpen(false)}>
                                        Back
                                    </Button>
                                </Modal.Actions>

                            </Modal>
                            {
                                confirmationMessage &&
                                <Message
                                    color="green"
                                    onDismiss={() => setConfirmationMessage(false)}
                                    content={"Suggestion successfully submitted"}
                                />
                            }
                        </div>
                    )
                }

            </Segment>

            <Segment basic
                style={{ maxHeight: "70vh", overflow: "auto" }}>
                {visibleQuestions.length > 0 ?
                    visibleQuestions.map((question, index) => {
                        return (
                            <Card
                                key={question.id}
                                fluid color="blue"
                                style={{ "margin-top": 5, "margin-bottom": 5, "text-align": "left", "padding": "2%" }}
                                href={`/completed_tasks/${question.id}`}
                                header={`Question title: ${question.text}`}
                                meta={`Created: ${question.createdAt.slice(0, 10)}`}
                                description={`No. documents: ${question["total_tasks"]}`}
                            />
                        )
                    }) :
                    <p> No results found</p>}
            </Segment>
        </Layout>
    );
}

export default Home;