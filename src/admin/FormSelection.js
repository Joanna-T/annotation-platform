import { useState } from "react";
import {
    Segment,
    Label,
    Card,
    Accordion,
    Icon,
    Checkbox,
} from "semantic-ui-react";


const FormSelection = ({ questionForms, chosenQuestionForm, setChosenQuestionForm }) => {
    const [activeIndex, setActiveIndex] = useState(null);

    const handleAccordionClick = (index) => {

        if (index === activeIndex) {
            setActiveIndex(-1);
            return
        }
        setActiveIndex(index);
    }

    const handleQuestionCheckbox = (form, data) => {
        if (data.checked) {
            setChosenQuestionForm(form)
        } else {
            setChosenQuestionForm(null)
        }
    }

    const formCardStyle = { "marginTop": 5, "marginBottom": 5, "textalign": "left", "padding": "3%" }
    return (
        <div>
            <p>
                <Icon name='hand point right' />
                Please select the questions form to be asked to the annotators.
            </p>
            <p style={{ display: "inline" }}> Chosen form:  </p><Label color='grey' horizontal>
                {chosenQuestionForm ? chosenQuestionForm.form_description : "Please pick a question form from below"}
            </Label>
            <Segment style={{ overflow: "auto", maxHeight: '30vh' }}>
                {questionForms ? (questionForms.map((form, index) => {
                    return (
                        <Card
                            key={form.id}
                            style={formCardStyle} fluid >
                            <Accordion>
                                <Accordion.Title
                                    active={activeIndex === index}
                                    index={index}
                                >
                                    <Checkbox
                                        checked={chosenQuestionForm === form}
                                        onChange={(event, data) => handleQuestionCheckbox(form, data)}
                                        label={form.form_description} />
                                    <Icon
                                        size="large"
                                        onClick={() => handleAccordionClick(index)}
                                        name='dropdown'
                                        style={{ "float": "right" }} />


                                </Accordion.Title>
                                <Accordion.Content active={activeIndex === index}>
                                    <p style={{ "whiteSpace": "pre-wrap" }}>
                                        {JSON.stringify(JSON.parse(form.questions), null, 4)}
                                    </p>


                                </Accordion.Content>

                            </Accordion>
                        </Card>
                    )
                }))
                    : "No forms available"

                }

            </Segment>
        </div>
    );

}

export default FormSelection;