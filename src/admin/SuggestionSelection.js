import { useState } from "react";
import {
    Segment,
    Button,
    Modal,
    List
} from "semantic-ui-react";
import { deleteSuggestion } from "../utils/mutationUtils";


const SuggestionSelection = ({ suggestions, setMedicalQuestion, setSuggestions }) => {

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