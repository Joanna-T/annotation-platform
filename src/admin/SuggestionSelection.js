import { useState, useEffect } from "react";
import {
    Segment,
    Button,
    Input,
    Label,
    Card,
    Accordion,
    Icon,
    Checkbox,
    Message,
    Modal,
    List,
    Tab
} from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import Layout from "../common/Layout";
import { fetchQuestionForms, listCurators, fetchSuggestions } from "../utils/queryUtils";
import { submitQuestion, deleteSuggestion } from "../utils/mutationUtils";
import { distributeAnnotationTasks } from "../utils/assignTaskUtils";
import { fetchDocumentFolders } from "../utils/assignTaskUtils";
import DocumentSelection from "./DocumentSelection";
import { labelColours } from "./adminConstants";
import { isValidURL } from "../utils/assignTaskUtils";
import QuestionFormCreation from "./QuestionFormCreation";

const SuggestionSelection = ({ suggestions, setMedicalQuestion, setSuggestions }) => {
    //const [suggestions, setSuggestions] = useState([])
    const [selectedSuggestion, setSelectedSuggestion] = useState()
    const [suggestionOpen, setSuggestionOpen] = useState(false)

    return (<Modal
        open={suggestionOpen}
        onClose={() => setSuggestionOpen(false)}
        onOpen={() => setSuggestionOpen(true)}
        trigger={<Button
            color='blue' >
            View question suggestions
        </Button>}
    >
        <Modal.Header> Select a suggestion to use as the new question heading</Modal.Header>
        <Modal.Content>
            <Segment maxHeight="50vh">
                <List divided>
                    {suggestions.length > 0 ?
                        suggestions.map(suggestion => {
                            return (
                                <List.Item
                                    key={suggestion.id}>
                                    <p style={{ display: "inline" }}>{suggestion.text}</p>
                                    <List.Content floated='right'>

                                        <Button
                                            size="small"
                                            color={selectedSuggestion === suggestion.id ? "blue" : "grey"}
                                            onClick={() => {
                                                setSelectedSuggestion(suggestion.id)
                                                setMedicalQuestion(suggestion.text)
                                            }
                                            }>
                                            Set question</Button>
                                        <Button
                                            size="small"
                                            color="red"
                                            onClick={() => {
                                                deleteSuggestion(suggestion.id)
                                                setSuggestions(suggestions.filter(result => result.id !== suggestion.id))
                                            }}>Delete</Button>
                                    </List.Content>
                                </List.Item>
                            )
                        }

                        )
                        :
                        <p>No suggestions submitted</p>
                    }
                </List>
            </Segment>

        </Modal.Content>
        <Modal.Actions>

            <Button
                color="red"
                labelPosition='right'
                icon
                onClick={() => setSuggestionOpen(false)}>
                Back to form
            </Button>
        </Modal.Actions>



    </Modal>);
}

export default SuggestionSelection;