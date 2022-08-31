import Layout from "./Layout";
import { useState, useEffect } from "react";
import { Segment, Input, Card, Header, Icon, Modal, Button, Message, Popup } from "semantic-ui-react";
import { fetchQuestions } from "../utils/queryUtils";
import { submitSuggestion } from "../utils/mutationUtils";
import { returnCompletedQuestions } from "../utils/documentUtils";

const Home = () => {
    const [searchInput, setSearchInput] = useState("");
    const [allQuestions, setAllQuestions] = useState([])
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

    useEffect(() => {

        fetchQuestions("API_KEY")
            .then(result => {

                const questionsArray = returnCompletedQuestions(result)

                setVisibleQuestions(questionsArray)
                setAllQuestions(questionsArray)

            });
    }, [])

    const handleChange = (e) => {
        e.preventDefault();
        setSearchInput(e.target.value)

    }

    const handleSuggestionChange = (e) => {
        e.preventDefault();
        setSuggestionInput(e.target.value)
    }

    async function handleSubmit() {
        const suggestion = {
            text: suggestionInput
        }
        setOpen(false)
        setConfirmationMessage(true)
        submitSuggestion(suggestion, "API_KEY")

    }

    const inputStyle = { "borderColor": "blue", width: "100%", "borderRadius": "30px" }
    const basicSegmentStyle = { "paddingLeft": "10%", "paddingRight": "10%" }
    const cardStyle = { "margin-top": 5, "margin-bottom": 5, "text-align": "left", "padding": "2%" }

    return (
        <Layout>
            <Segment basic>
                <Header as='h2' icon textAlign='center'>
                    <Icon color="blue" name='edit outline' circular />
                    <Header.Content>Welcome to AnnotateIt</Header.Content>
                </Header>
                <p>Please enter a search query below to find relevant annotation question results {"  "}
                    <Popup
                        trigger={<Icon name='question' size='small' circular />}
                        content='All documents are annotated by medical professionals within the Pansurg community'
                        position='top left'
                    /> </p>
            </Segment>

            <Segment basic style={basicSegmentStyle}>

                <Input
                    icon="search"
                    type="text"
                    placeholder="Search questions"
                    onChange={handleChange}
                    value={searchInput}
                    style={inputStyle} />
                {
                    //!admin && (
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
                                            style={inputStyle} />
                                    </Segment>

                                </Modal.Description>
                                <Modal.Actions>
                                    <Button color="green" onClick={handleSubmit}>
                                        Submit suggestion
                                    </Button>
                                    <Button
                                        color="red"
                                        icon
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
                                style={cardStyle}
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