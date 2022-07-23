import { Button, Grid, GridRow, Segment, Icon, Dropdown, Tab, Label, List } from "semantic-ui-react";
import { ResponsiveBar } from "nivo/lib/components/charts/bar";
import BarChart from "./BarChart";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { API, Storage } from "aws-amplify";
import { getQuestionForm } from "./graphql/queries";
// import { HeatMap } from "./HeatMap";
import TextHeatMap from "./TextHeatMap"
import QuestionStats from "./QuestionStats";
import InterannotatorAgreement from "./InterannotatorAgreement";


// const keys = ['hot dogs', 'burgers', 'sandwich', 'kebab', 'fries', 'donut'];
// const commonProps = {
//     width: 900,
//     height: 500,
//     margin: { top: 60, right: 110, bottom: 60, left: 80 },
//     data: generateCountriesData(keys, { size: 7 }) as BarDatum[],
//     indexBy: 'country',
//     keys,
//     padding: 0.2,
//     labelTextColor: 'inherit:darker(1.4)',
//     labelSkipWidth: 16,
//     labelSkipHeight: 16,
// }




//export default QuestionStats;



const DisplayResults = () => {
  const { state } = useLocation();
  const { annotation_tasks, grouped_tasks } = state;

  const [allTasks, setAllTasks] = useState(null)
  const [currentTasks, setCurrentTasks ] = useState(null)
  const [ documentText, setDocumentText ] = useState("Loading text...");
  const [documentLabels, setDocumentLabels] = useState([])
  const [tag, setTag] = useState("Summary")
  const [questionAnswers, setQuestionAnswers] = useState([])
  const [questionForms, setQuestionForms] = useState([])
  const [documentNames, setDocumentNames] = useState([
    {key: "Loading",
     text: "Loading",
     value: "Loading"}
  ])

  const label = [{
    start: 10,
    end: 20

  },
  {
    start: 25,
    end: 30
  }, 

  {
    start: 0,
    end: 35
  },
]

  useEffect(() => {
    console.log("display results")
    setAllTasks(findGroupedDocuments(grouped_tasks));
    setCurrentTasks(annotation_tasks);
  }, [])

  // useEffect(() => {
  //   console.log("grouped tasks,", grouped_tasks)
  //   setAllTasks(findGroupedDocuments(grouped_tasks))
  // }, [grouped_tasks])

  // useEffect(() => {
  //   console.log("this is annotation tasks", annotation_tasks);
  //   setCurrentTasks(annotation_tasks)
  // },[annotation_tasks])


  useEffect(() => {
    console.log("currentTasks", currentTasks)
    if (currentTasks){
      parseLabels();
      parseQuestionAnswers();
      fetchQuestion();
      fetchDocument(currentTasks[0].document_title).then(result => {
      setDocumentText(result);
    })
    }
    

  }, [currentTasks])


  async function fetchQuestion() {
    const form = await API.graphql({
        query: getQuestionForm,
        variables: { id: currentTasks[0].questionFormID },
        authMode: "AMAZON_COGNITO_USER_POOLS"
    })
    console.log("setQuestionForm", form.data.getQuestionForm);
    setQuestionForms(form.data.getQuestionForm);
  }

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
    for (let i = 0; i < currentTasks.length; i++ ) {
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
        text: document,
        value: document
      })
    })
    return options
  }

  const handleDocumentChange = (e, {name, value}) => {
    console.log("handleDocumentChange", allTasks)
    setCurrentTasks(allTasks[value])

  }

  const panes = [
    {
      menuItem: 'Document results',
      pane: (
        <Tab.Pane key='document-results' style={{maxheight:"100%", overflow:"auto" }}>
  
          { questionAnswers.length && questionForms.questions &&
       <QuestionStats questionAnswers={questionAnswers} questionForm={questionForms}></QuestionStats>
       }
        </Tab.Pane>
      ),
      
    },
    {
      menuItem: 'Question results',
      pane: (
        <Tab.Pane key='question-results' style={{maxheight:"100%", overflow:"auto" }}>
  
          { grouped_tasks &&
          <InterannotatorAgreement grouped_tasks={grouped_tasks}></InterannotatorAgreement>

       }
        </Tab.Pane>
      ),
      
    },
  ]

  const data = [
    {
      "country": "Responses",
      "hot dog": 62,
      "hot dogColor": "hsl(142, 70%, 50%)",
      "burger": 32,
      "burgerColor": "hsl(127, 70%, 50%)",
      "sandwich": 116,
      "sandwichColor": "hsl(247, 70%, 50%)",
      "kebab": 103,
      "kebabColor": "hsl(274, 70%, 50%)",
      "fries": 81,
      "friesColor": "hsl(331, 70%, 50%)",
      "donut": 48,
      "donutColor": "hsl(62, 70%, 50%)"
    },
   
  ]

  const customLabel = (d) => {
    console.log("customLabel", d);
    console.log(d.id.substr(0, 1));
    return d.id.substr(0, 1);
  };

const keys = ['hot dog', 'burger', 'sandwich', 'kebab', 'fries', 'donut'];
// const commonProps = {
//     width: 900,
//     height: 500,
//     margin: { top: 60, right: 110, bottom: 60, left: 80 },
//     data: barData,
//     indexBy: 'country',
//     keys,
//     padding: 0.2,
//     labelTextColor: 'inherit:darker(1.4)',
//     labelSkipWidth: 16,
//     labelSkipHeight: 16,
// };

    return ( 
        <Grid columns={2} >
    <Grid.Row stretched >
    <Grid.Column width={8} style={{"height": '100vh'}}>
        <Segment style={{height: "10%", "margin-bottom": "0%", "text-align":"left"}}>
        <Button inverted color='orange'
          active={ (tag == "Summary")}
          onClick={() => setTag("Summary")}>
        Summary
      </Button>
      <Button inverted color='yellow'
      active={ (tag == "Quality")}
      onClick={() => setTag("Quality")}>
        Quality
      </Button>
      <Button inverted color='olive'
      active={ (tag == "Relevancy")}
      onClick={() => setTag("Relevancy")}>
        Relevancy
      </Button>
        {/* <span id="1" style={{"border-radius": "4px","background-color": "pink", opacity: "100%", "mix-blend-mode": "multiply"}}>This is <span id="2" style={{"border-radius": "2px","background-color": "lightblue", opacity: "60%", "mix-blend-mode": "multiply"}}> some 
        <span id="2" style={{"border-radius": "2px","background-color": "lightblue", opacity: "60%", "mix-blend-mode": "multiply"}}>text </span></span> 
        some other text some other text some other text some other text </span>
    */}

          </Segment>
        <Segment style={{"overflow": "auto","text-align": "left", "white-space": "pre-wrap", height: "90%", "margin-top":"0%"}}>
        {documentText && documentLabels && <TextHeatMap tag={tag} documentLabels={documentLabels} documentText={documentText}/>}
          
          </Segment>
      </Grid.Column>
      <Grid.Column width ={8} style={{"height": '100vh'}}>
        <Segment padded>
            <h3>Results</h3>
            <label>You are currently viewing document:</label>
            {allTasks ? <Dropdown
            placeholder="Please choose a document to view results"
            fluid selection options={getDocumentOptions()}
            onChange={handleDocumentChange}
            /> : "Loading documents..."}
            <br></br>
            <Tab panes={panes} renderActiveOnly={false}/>

          
            
        
    {/* <ResponsiveBar {...commonProps} 
    layout="horizontal" 
    enableGridY={false} 
    enableGridX={true}
    valueScale={{type: "linear"}}
    indexScale={{ type: 'band', round: true }}
     /> */}


     {/* { questionAnswers.length && questionForms.questions &&
       <QuestionStats questionAnswers={questionAnswers} questionForm={questionForms}></QuestionStats>
       } */}



       {/* <ResponsiveBar
        data={data}
        keys={keys}
        layout="horizontal"
        indexBy="country"
        margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
        padding={0.3}
        height={20}
        legends={[
            {
                dataFrom: 'keys',
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 120,
                translateY: 0,
                itemsSpacing: 2,
                itemWidth: 100,
                itemHeight: 20,
                itemDirection: 'left-to-right',
                itemOpacity: 0.85,
                symbolSize: 20,
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemOpacity: 1
                        }
                    }
                ]
            }
        ]}

    /> */}
      
        </Segment>
      </Grid.Column>

    </Grid.Row>
  </Grid>
     );
}
 
export default DisplayResults;


async function fetchDocument(documentFile) {
  // Storage.list('') // for listing ALL files without prefix, pass '' instead
  // .then(result => console.log("list of documents", result))
  // .catch(err => console.log(err));


  
  //const documentFile = documentTitle + ".txt";
  //console.log(documentFile);
  const text = await Storage.get(documentFile, {download: true});
  //console.log("text", text.Body.text())
  //console.log(text.Body.text())

  text.Body.text().then(string => {
    console.log("fetchDocument",string);
      //setDocumentText(string);
  })
  return text.Body.text();
  
}