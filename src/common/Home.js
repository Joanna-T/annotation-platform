import Layout from "./Layout";
import { useState, useEffect } from "react";
import { Segment, Input, Card, Header, Icon, Modal, Button, Message, Popup, Pagination } from "semantic-ui-react";
import { fetchQuestions } from "../utils/queryUtils";
import { submitSuggestion } from "../utils/mutationUtils";
import { returnCompletedQuestions } from "../utils/documentUtils";


const Home = () => {

    const [allQuestions, setAllQuestions] = useState([])
    const [admin, setAdmin] = useState(false)
    const [open, setOpen] = useState(false)
    const [confirmationMessage, setConfirmationMessage] = useState(false)
    const [suggestionInput, setSuggestionInput] = useState("")

    //pagination
    const [totalPages, setTotalPages] = useState(1)
    const [activePage, setActivePage] = useState(1)
    const [activePageQuestions, setActivePageQuestions] = useState([])

    //search
    const [searchInput, setSearchInput] = useState("");
    const [visibleQuestions, setVisibleQuestions] = useState([])

    const itemsPerPage = 4


    useEffect(() => {

        fetchQuestions("API_KEY")
            .then(result => {

                const questionsArray = returnCompletedQuestions(result)

                setVisibleQuestions(questionsArray)
                setAllQuestions(questionsArray)

                //setTotalPages(Math.ceil(visibleQuestions.length / itemsPerPage))
                setActivePage(1)
            });
    }, [])

    //pagination 
    useEffect(() => {
        let activeQuestions
        if (itemsPerPage >= visibleQuestions.length) {
            activeQuestions = visibleQuestions
        } else {
            console.log("activepage", activePage)
            let startIndex = ((activePage - 1) * itemsPerPage)
            activeQuestions = visibleQuestions.slice(startIndex, startIndex + itemsPerPage)
        }
        setActivePageQuestions(activeQuestions)
        setTotalPages(Math.ceil(visibleQuestions.length / itemsPerPage))

    }, [activePage, visibleQuestions])

    const handlePaginationChange = (e, { activePage }) => {
        setActivePage(activePage)
    }

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

    const searchQuestions = () => {
        let newQuestions = allQuestions.filter((question) => {
            return question.text.toLowerCase().includes(searchInput.toLowerCase())
        })
        setVisibleQuestions(newQuestions)
    }

    const inputStyle = { "borderColor": "blue", width: "100%", "borderRadius": "30px" }
    const basicSegmentStyle = { "paddingLeft": "10%", "paddingRight": "10%" }
    const cardStyle = { "marginTop": 5, "marginBottom": 5, "textAlign": "left", "padding": "2%" }

    return (
        <Layout>
            <Segment basic textAlign="center">
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
                    type='text'
                    placeholder='Search...'
                    action
                    onChange={handleChange}
                    value={searchInput}
                    style={inputStyle} >
                    <input />
                    <Button
                        type='submit'
                        onClick={searchQuestions}
                        color="blue"
                    >
                        Search</Button>
                </Input>
                {
                    //!admin && (
                    (
                        <Segment textAlign="center" basic>
                            <small >Cant find what you're looking for? </small>
                            <Modal
                                open={open}
                                onClose={() => setOpen(false)}
                                onOpen={() => setOpen(true)}
                                trigger={<small><u style={{ cursor: "pointer" }}>Click here to submit a new question for review.</u></small>}
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
                        </Segment>
                    )
                }

            </Segment>

            <Segment basic
            >
                {
                    visibleQuestions.length > 0 ?
                        activePageQuestions.map((question, index) => {
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
                        <Segment basic textAlign="center">
                            No results found
                        </Segment>}

            </Segment>
            <Segment basic textAlign="center">
                <Pagination
                    secondary
                    pointing
                    color="blue"
                    activePage={activePage}
                    onPageChange={handlePaginationChange}
                    totalPages={totalPages}
                ></Pagination>
                <br></br>

            </Segment>

        </Layout>
    );
}

export default Home;