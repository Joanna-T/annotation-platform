import { Button, Grid, Icon, Segment, Modal, Dropdown, Tab, Label } from "semantic-ui-react";
import { ResponsiveBar } from "nivo/lib/components/charts/bar";
import BarChart from "./BarChart";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { API, Storage } from "aws-amplify";
import { getQuestionForm } from "../graphql/queries";
import TextHeatMap from "./TextHeatMap"
import QuestionStats from "./QuestionStats";
import InterannotatorAgreement from "./InterannotatorAgreement";
import { fetchQuestion, fetchQuestionForm } from "../utils/queryUtils";
import { fetchDocument, getTaskDocumentTitles } from "../utils/queryUtils";
import useWindowSize from "./useWindowSize";



const DisplayResults = () => {
  const size = useWindowSize();

  const { state } = useLocation();
  const { annotation_tasks, grouped_tasks } = state;

  const [allTasks, setAllTasks] = useState(null)
  const [currentTasks, setCurrentTasks] = useState(null)
  const [documentText, setDocumentText] = useState("Loading text...");
  const [documentTitle, setDocumentTitle] = useState("Loading title...")
  const [documentTitles, setDocumentTitles] = useState(null)
  const [documentLabels, setDocumentLabels] = useState([])
  const [tag, setTag] = useState("Summary")
  const [questionAnswers, setQuestionAnswers] = useState([])
  const [questionForms, setQuestionForms] = useState([])
  const [medicalQuestion, setmedicalQuestion] = useState(null)
  const [semanticAgreement, setSemanticAgreement] = useState(null)
  const [labelDescriptions, setLabelDescriptions] = useState(null)

  useEffect(() => {
    console.log("display results")
    setAllTasks(findGroupedDocuments(grouped_tasks));
    setCurrentTasks(annotation_tasks);
    getTaskDocumentTitles(
      grouped_tasks.map(tasks => tasks[0])
    )
      .then(result => {
        console.log("displayresults result", result)
        setDocumentTitles(result)
      })
  }, [])


  useEffect(() => {
    console.log("currentTasks", currentTasks)
    if (currentTasks) {
      parseLabels();
      parseQuestionAnswers();
      fetchQuestionForm(currentTasks[0].questionFormID, "API_KEY")
        .then(form => {
          setQuestionForms(form)
        })
      fetchDocument(currentTasks[0].document_title).then(formattedString => {
        setDocumentText(formattedString["abstract"] + "\n\n" + formattedString["mainText"]);
        setDocumentTitle(formattedString["title"])
      })

      fetchQuestion(currentTasks[0].questionID, "API_KEY")
        .then(question => {
          setmedicalQuestion(question)
          setSemanticAgreement(JSON.parse(JSON.parse(question.semanticAgreement)))
          setLabelDescriptions(JSON.parse(question.labelDescriptions))
        })
    }

  }, [currentTasks])



  const findGroupedDocuments = (groupedTasks) => {
    let groupedDoc = {}
    for (let i = 0; i < groupedTasks.length; i++) {
      console.log("grouped docs1", groupedTasks[i])
      groupedDoc[groupedTasks[i][0].document_title] = groupedTasks[i]
    }
    console.log("grouped docs2", groupedDoc)
    return groupedDoc
  }

  const parseQuestionAnswers = () => {
    let answers = [];
    for (let i = 0; i < currentTasks.length; i++) {
      let parsedAnswers = JSON.parse(currentTasks[i].question_answers);
      answers.push(parsedAnswers);
    }
    console.log("parseQuestionAnswers", answers)
    setQuestionAnswers(answers);
  }

  const parseLabels = () => {
    let labels = []
    for (let i = 0; i < currentTasks.length; i++) {
      let parsedLabels = JSON.parse(currentTasks[i].labels);
      labels.push(...parsedLabels);
    }
    setDocumentLabels(labels);
  }

  const getDocumentOptions = () => {
    let options = []
    Object.keys(allTasks).map((document, index) => {
      options.push({
        key: index,
        text: documentTitles[allTasks[document][0].id],
        value: document
      })
    })
    console.log("getDocumentOptions", options)
    return options
  }

  const handleDocumentChange = (e, { name, value }) => {
    console.log("handleDocumentChange", allTasks)
    const tempTask = [...allTasks[value]]
    setCurrentTasks(tempTask)
    setTag("Summary")

  }

  const resultPanes = [
    {
      menuItem: 'Document results',
      pane: (
        <Tab.Pane key='document-results' style={{ maxheight: "45vh", overflow: "auto" }}>
          <p style={{ display: "inline" }}>The semantic similarity for the document labels is:  {" "}
            {semanticAgreement && semanticAgreement.hasOwnProperty(currentTasks[0].document_title) ?
              <b>{semanticAgreement[currentTasks[0].document_title].toFixed(3)}</b> : 0}
          </p>
          {"  "}
          <Modal
            trigger={<Button size="mini" circular icon='question' />}
            header='Semantic agreement'
            content='
            Phrases may be repeated throughout the document, and so the semantic similarity between the  
            different labels may be approximated.
            The semantic agreement has been calculated by aggregating the text of the labels 
      and comparing the different word vectors (multi-dimensional meaning representations of the words) of the annotator answers '
            actions={[{ key: 'done', content: 'Done', positive: true }]}
          />

          {questionAnswers.length && questionForms.questions &&
            <QuestionStats questionAnswers={questionAnswers} questionForm={questionForms}></QuestionStats>
          }
        </Tab.Pane>
      ),

    },
    {
      menuItem: 'Question results',
      pane: (
        <Tab.Pane key='question-results' style={{ maxheight: "45vh", overflow: "auto" }}>
          {grouped_tasks &&
            <InterannotatorAgreement grouped_tasks={grouped_tasks}></InterannotatorAgreement>

          }

        </Tab.Pane>
      ),

    },
  ]

  const heatMapSection = (
    <div>

      <Segment style={{ "margin-bottom": "0%", "text-align": "left" }}>
        <p style={{ display: "inline" }}><b>Toggle document labels:{"  "}</b></p>
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
      <Segment style={{ "overflow": "auto", "text-align": "left", "white-space": "pre-wrap", height: size.height * 0.9, "margin-top": "0%" }}>
        {documentText && documentLabels && <TextHeatMap tag={tag} documentLabels={documentLabels} documentText={documentText} />}

      </Segment>
    </div>

  )

  const resultSection = (
    <Segment color="blue" inverted tertiary style={{ height: size.height }}>
      <Label size="huge" color="blue">
        Results
      </Label>
      <br></br>
      <br></br>
      <p><b>Question: </b>{medicalQuestion && medicalQuestion.text}</p>
      <p><b>Document title: </b>{documentTitle && documentTitle}</p>
      <label>You are currently viewing document:</label>
      {allTasks && documentTitles ? <Dropdown
        defaultValue={annotation_tasks.length ? annotation_tasks[0].document_title : "Loading documents"}
        fluid selection options={getDocumentOptions()}
        onChange={handleDocumentChange}
      /> : "Loading documents..."}
      <br></br>
      <Tab menu={{ color: "blue", attached: true, tabular: true }} panes={resultPanes} renderActiveOnly={false} />

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
      menuItem: 'Results',
      pane: (
        <Tab.Pane key='result' style={{ maxheight: "100%", overflow: "auto" }}>
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

export default DisplayResults;




