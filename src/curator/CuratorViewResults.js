import { useEffect, useState } from "react";
import TextHeatMap from "../common/TextHeatMap";
import { API, Auth, Storage } from "aws-amplify";
import { listQuestionForms, getAnnotationTask, getQuestionForm } from "../graphql/queries";
import { Link } from "react-router-dom";
import { List, Segment, Grid, Image, Card, Button, Tab, Form, Label } from "semantic-ui-react";
import { useParams } from "react-router-dom";
import { fetchTask, fetchDocument, fetchQuestionForm, fetchQuestion } from "../utils/queryUtils";
import useWindowSize from "../common/useWindowSize";
const labelColours = [
  {
    buttonColour: "red",
    labelColour: "#ff6e63"
  },
  {
    buttonColour: "grey",
    labelColour: "#c4c4c4"
  },
  {
    buttonColour: "purple",
    labelColour: "#c07dff"
  },
  {
    buttonColour: "yellow",
    labelColour: "#fff980"
  },
  {
    buttonColour: "green",
    labelColour: "#a7ff78"
  },
  {
    buttonColour: "blue",
    labelColour: "#69c5ff"
  },
  {
    buttonColour: "brown",
    labelColour: "#c7853e"
  },
]
const CuratorViewResults = () => {
  const size = useWindowSize();
  const { id } = useParams();
  const [tag, setTag] = useState("Summary")
  const [task, setTask] = useState(null);
  const [documentLabels, setDocumentLabels] = useState(null);
  const [questionAnswers, setQuestionAnswers] = useState(null);
  const [documentText, setDocumentText] = useState(null);
  const [questions, setQuestions] = useState(null)
  const [medicalQuestion, setMedicalQuestion] = useState(null)
  const [documentTitle, setDocumentTitle] = useState("Loading...");
  const [labelDescriptions, setLabelDescriptions] = useState([])


  useEffect(() => {
    fetchTask(id)
      .then(async (result) => {
        setTask(result);
        setDocumentLabels(JSON.parse(result.labels))
        setQuestionAnswers(JSON.parse(result.question_answers))

        console.log("task", result)
        await Promise.all([fetchDocument(result.document_title),
        fetchQuestionForm(result.questionFormID, "API_KEY"),
        fetchQuestion(result.questionID, "API_KEY")])
          .then(result => {
            console.log("321", result)
            setDocumentText(result[0]["abstract"] + "\n\n" + result[0]["mainText"])
            setDocumentTitle(result[0]["title"])
            setQuestions(JSON.parse(result[1].questions))
            setMedicalQuestion(result[2])
            setLabelDescriptions(JSON.parse(result[2].labelDescriptions))
          })
      })

  }, [])

  const heatMapSection = (
    <div>
      <Segment style={{ "marginBottom": "0%", "textAlign": "left" }}>
        <b>Toggle document labels:</b>
        {" "}
        {
          labelDescriptions && labelDescriptions.map(labelDescription => {
            return (
              <Button inverted color={labelDescription.buttonColour}
                active={(tag == labelDescription.tagName)}
                onClick={() => setTag(labelDescription.tagName)}>
                {labelDescription.tagName}
              </Button>
            )
          })
        }
        {/* <Button inverted color='orange'
          active={(tag == "Summary")}
          onClick={() => setTag("Summary")}>
          Summary
        </Button>
        <Button inverted color='yellow'
          active={(tag == "Quality")}
          onClick={() => setTag("Quality")}>
          Quality
        </Button>
        <Button inverted color='purple'
          active={(tag == "Relevancy")}
          onClick={() => setTag("Relevancy")}>
          Relevancy
        </Button> */}

      </Segment>
      <Segment style={{ "overflow": "auto", "textAlign": "left", "whiteSpace": "pre-wrap", height: "90vh", "marginTop": "0%" }}>
        {documentText && documentLabels && <TextHeatMap tag={tag} documentLabels={documentLabels} documentText={documentText} />}

      </Segment>
    </div>
  )

  const resultSection = (
    <Segment color="blue" tertiary inverted>
      <Label size="huge" color="blue">
        Results
      </Label>
      <br></br>
      <h4><b>Question: </b>{medicalQuestion && medicalQuestion.text}</h4>
      <h4><b>Document Title: </b>{documentTitle}</h4>
      <Form text-align="left" inverted style={{ overflow: "auto", maxHeight: "90vh" }} >
        {questions && questions.map(function (question, index) {
          return (
            <Form.Group key={index} grouped >
              <h5> {index + 1} {". "} {question.question_text}</h5>

              {
                question.options.map((option) => {
                  return (
                    <Form.Field
                      key={option}
                      label={option}
                      control='input'
                      type={question.question_type}
                      name={question.question_description}
                      value={option}
                      checked={questionAnswers && questionAnswers[question.question_description] &&
                        questionAnswers[question.question_description] === option}>

                    </Form.Field>
                  )

                })
              }


            </Form.Group>
          )
        })}

      </Form>
    </Segment>
  )

  const smallScreenPanes = [
    {
      menuItem: 'Heat map',
      pane: (
        <Tab.Pane key='heat-map' style={{ maxheight: "100%", overflow: "auto" }}>
          {heatMapSection}
        </Tab.Pane>
      ),

    },
    {
      menuItem: 'Question Results',
      pane: (
        <Tab.Pane key='question-result' style={{ maxheight: "100%", overflow: "auto" }}>
          {resultSection}
        </Tab.Pane>
      ),

    },
  ]

  if (size.width > 800) {
    return (
      <Grid columns={2} >
        <Grid.Row stretched >
          <Grid.Column width={8} style={{ maxheight: '100vh' }}>
            {heatMapSection}
          </Grid.Column>
          <Grid.Column width={8} style={{ "height": '100vh' }}>
            {resultSection}

          </Grid.Column>

        </Grid.Row>
      </Grid>
    );
  } else {
    return (
      <Tab menu={{ color: "blue", attached: true, tabular: true }} panes={smallScreenPanes} renderActiveOnly={false} />
    )
  }
}

export default CuratorViewResults;