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

  //stores all task data seen so far
  const [storedDocumentInfo, setStoredDocumentInfo] = useState({})

  useEffect(() => {

    setAllTasks(findGroupedDocuments(grouped_tasks));
    setCurrentTasks(annotation_tasks);
    getTaskDocumentTitles(
      grouped_tasks.map(tasks => tasks[0])
    )
      .then(result => {

        setDocumentTitles(result)
      })
  }, [])

  useEffect(() => {
    console.log("Stored document info", storedDocumentInfo)
    if (currentTasks && storedDocumentInfo[currentTasks[0].document_title]) {
      retrieveStoredDocumentData(currentTasks[0].document_title)
    }

  }, [storedDocumentInfo])


  useEffect(() => {
    //if data is not currently stored
    if (currentTasks && !storedDocumentInfo[currentTasks.document_title]) {
      const currentDocumentTitle = currentTasks[0].document_title
      let tempTaskData = {}
      Promise.all([
        fetchQuestionForm(currentTasks[0].questionFormID, "API_KEY"),
        fetchDocument(currentTasks[0].document_title),
        fetchQuestion(currentTasks[0].questionID, "API_KEY")
      ])
        .then(results => {
          tempTaskData["questionFormData"] = results[0]
          tempTaskData["documentData"] = results[1]
          tempTaskData["medicalQuestionData"] = results[2]

          setStoredDocumentInfo({
            ...storedDocumentInfo,
            [currentDocumentTitle]: tempTaskData
          })

        })
      // fetchQuestionForm(currentTasks[0].questionFormID, "API_KEY")
      //   .then(form => {
      //     tempTaskData["questionFormData"] = form
      //   })

      // fetchDocument(currentTasks[0].document_title)
      //   .then(formattedString => {
      //     tempTaskData["documentData"] = formattedString
      //   })
      // fetchQuestion(currentTasks[0].questionID, "API_KEY")
      //   .then(question => {
      //     tempTaskData["medicalQuestionData"] = question
      //   })

      // console.log("temptaskdata", tempTaskData)

      // setStoredDocumentInfo({
      //   ...storedDocumentInfo,
      //   [currentDocumentTitle]: tempTaskData
      // })

    }
    else if (currentTasks && storedDocumentInfo[currentTasks.document_title]) {
      retrieveStoredDocumentData(currentTasks[0].document_title)
    }

    // if (currentTasks) {
    //   parseLabels();
    //   parseQuestionAnswers();
    //   fetchQuestionForm(currentTasks[0].questionFormID, "API_KEY")
    //     .then(form => {
    //       setQuestionForms(form)
    //     })
    //   fetchDocument(currentTasks[0].document_title).then(formattedString => {
    //     setDocumentText(formattedString["abstract"] + "\n\n" + formattedString["mainText"]);
    //     setDocumentTitle(formattedString["title"])
    //   })

    //   fetchQuestion(currentTasks[0].questionID, "API_KEY")
    //     .then(question => {
    //       setmedicalQuestion(question)
    //       setSemanticAgreement(JSON.parse(JSON.parse(question.semanticAgreement)))
    //       setLabelDescriptions(JSON.parse(question.labelDescriptions))
    //     })
    // }

  }, [currentTasks])

  //sets data for the current chosen document
  const retrieveStoredDocumentData = (documentTitle) => {
    parseLabels();
    parseQuestionAnswers();
    setQuestionForms(storedDocumentInfo[documentTitle]["questionFormData"])
    setDocumentText(storedDocumentInfo[documentTitle]["documentData"]["abstract"] + "\n\n" + storedDocumentInfo[documentTitle]["documentData"]["mainText"]);
    setDocumentTitle(storedDocumentInfo[documentTitle]["documentData"]["title"])
    setmedicalQuestion(storedDocumentInfo[documentTitle]["medicalQuestionData"])
    setSemanticAgreement(JSON.parse(JSON.parse(storedDocumentInfo[documentTitle]["medicalQuestionData"].semanticAgreement)))
    setLabelDescriptions(JSON.parse(storedDocumentInfo[documentTitle]["medicalQuestionData"].labelDescriptions))
  }



  const findGroupedDocuments = (groupedTasks) => {
    let groupedDoc = {}
    for (let i = 0; i < groupedTasks.length; i++) {

      groupedDoc[groupedTasks[i][0].document_title] = groupedTasks[i]
    }

    return groupedDoc
  }

  const parseQuestionAnswers = () => {
    let answers = [];
    for (let i = 0; i < currentTasks.length; i++) {
      let parsedAnswers = JSON.parse(currentTasks[i].question_answers);
      answers.push(parsedAnswers);
    }

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

    return options
  }

  const handleDocumentChange = (e, { name, value }) => {

    const tempTask = [...allTasks[value]]
    setCurrentTasks(tempTask)
    setTag("Summary")

  }

  const resultPaneStyle = { maxheight: "45vh", overflow: "auto" }
  const labelSegmentStyle = { "marginBottom": "0%", "textAlign": "left" }
  const heatMapSectionStyle = { "overflow": "auto", "textAlign": "left", "whiteSpace": "pre-wrap", height: "90vh", "marginTop": "0%" }
  const smallScreenPaneStyle = { maxheight: "100%", overflow: "auto" }

  const resultPanes = [
    {
      menuItem: 'Document results',
      pane: (
        <Tab.Pane key='document-results' style={resultPaneStyle}>
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
        <Tab.Pane key='question-results' style={resultPaneStyle}>
          {grouped_tasks && medicalQuestion &&
            <InterannotatorAgreement grouped_tasks={grouped_tasks} medicalQuestion={medicalQuestion}></InterannotatorAgreement>

          }

        </Tab.Pane>
      ),

    },
  ]

  const heatMapSection = (
    <div>

      <Segment style={labelSegmentStyle}>
        <p style={{ display: "inline" }}><b>Toggle document labels:{"  "}</b></p>
        {
          labelDescriptions && labelDescriptions.map(labelDescription => {
            return (
              <Button key={labelDescription.buttonColour} inverted color={labelDescription.buttonColour}
                active={(tag == labelDescription.tagName)}
                onClick={() => setTag(labelDescription.tagName)}>
                {labelDescription.tagName}
              </Button>
            )
          })
        }

      </Segment>
      <Segment style={heatMapSectionStyle}>
        {documentText && documentLabels && <TextHeatMap tag={tag} documentLabels={documentLabels} documentText={documentText} />}

      </Segment>
    </div>

  )

  const resultSection = (
    <Segment color="blue" inverted tertiary style={{ height: "90vh" }}>
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
        <Tab.Pane key='heat-map' style={smallScreenPaneStyle}>
          {heatMapSection}
        </Tab.Pane>
      ),

    },
    {
      menuItem: 'Results',
      pane: (
        <Tab.Pane key='result' style={smallScreenPaneStyle}>
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
          <Grid.Column width={8} style={{ maxheight: '100vh' }}>
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




