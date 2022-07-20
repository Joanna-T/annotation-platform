import { Button, Grid, GridRow, Segment, Icon } from "semantic-ui-react";
import { ResponsiveBar } from "nivo/lib/components/charts/bar";
import BarChart from "./BarChart";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { API, Storage } from "aws-amplify";
import { getQuestionForm } from "./graphql/queries";
// import { HeatMap } from "./HeatMap";
import TextHeatMap from "./TextHeatMap"
import {AnnotationPage} from "./AnnotationPage"
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



const QuestionStats = ({questionAnswers, questionForm}) => {
  const [formQuestions, setFormQuestions] = useState([]);
  //const [answers, setAnswers] = useState([])
  const [barData, setBarData] = useState([])
  const [cohenKappaValues, setCohenKappaValues] = useState([])


  // useEffect(() => {
  //   if (questions.length && answers.length) {
  //     console.log("create bar data")
  //     createBarData();
  //   }
    
  // },[])

  useEffect(() => {
    console.log("BAR DATA")
    console.log(barData)
  }, [barData])

  useEffect(() => {
    console.log("Answers", questionAnswers);
    console.log("form", questionForm)
    createBarData(questionAnswers, questionForm)
  }, [])

  // useEffect(() => {
  //   console.log("ANSWERS")
  //   console.log(questionAnswers)
  //   if (questionAnswers) {
  //     setAnswers(questionAnswers)
  //     createBarData();
  //   }
    
  // },[questionAnswers])

  // useEffect(() => {
  //   console.log("question form data", questionForm.questions)
  //   let parsedQuestions = []
  //   if (questionForm.questions) {
  //     console.log("question form", questionForm)
  //     parsedQuestions = JSON.parse(questionForm.questions)
  //     if (answers.length) {
  //       createBarData(parsedQuestions)
  //     }
  //     setQuestions(parsedQuestions)
      
  //     return

  //   }
  //   setQuestions(parsedQuestions)
    
  // }, [questionForm])

  async function createBarData(answers, inputQuestionsForm) {
    let questions = JSON.parse(inputQuestionsForm.questions);
    setFormQuestions(questions)
    console.log("createBarData");
    let allDataItems = [];
    let kappaValues = [];
    for (let i = 0; i < questions.length; i++) {
      let newQuestion = {
        "category": questions[i].question_description,

      }
      for (let j = 0; j < questions[i].options.length; j++) {

        const relevantAnswers = answers.filter(answer =>
          answer[questions[i].question_description] === questions[i].options[j])

        newQuestion[questions[i].options[j]] = relevantAnswers.length;
        newQuestion[questions[i].options[j] + "colour"] = colours[j]
        // for (let k = 0; k < answers.length; k++) {
        //   if (answers[k])
        // }
      }
      allDataItems.push(newQuestion)

      // setBarData(prevState => ([
      //   ...prevState, newQuestion
      // ]))
    }
    console.log("all data item", allDataItems)
    setBarData([...allDataItems])
  }

  const calculateCohenKappa = () => {

  }

  const colours = [
    "hsl(142, 0%, 50%)",
   "hsl(127, 70%, 50%)",
     "hsl(247, 70%, 50%)",
    "hsl(274, 70%, 50%)",
    "hsl(331, 70%, 50%)",
    "hsl(62, 70%, 50%)"
  ]



  // let barDataQuestion = [
  //   {
  //     "question": "Category",
  //     "category": questionAnswers.category,
  //     "categorycolour": ""

  //   }
  // ]
  return ( <div style={{height: "100%"}}>
    {/* {barData.length && formQuestions.length &&
    <ResponsiveBar
        data={[barData[0]]}
        keys={formQuestions[0].options}
        layout="horizontal"
        indexBy="category"
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

    />} */}
    {barData.map( (item, index) => {
      return(
        <div style={{"height": "12%"}}>
          <p>{index+1}{". "}{formQuestions[index].question_text}</p>
          {formQuestions[index].options.map((option, innerIndex) =>{
            let keyColor = colours[innerIndex];
            console.log("KEY COLORRRRRRRR", keyColor)
            return(
              <p style={{display:"inline"}}>{option}<Icon style={{color:keyColor}} name="circle"></Icon></p>
              
            )
          })}
        <ResponsiveBar
        data={[item]}
        keys={formQuestions[index].options}
        layout="horizontal"
        indexBy="category"
        margin={{ top: 50, right: 50, bottom: 50, left: 70 }}
        padding={0.3}
        height={20}
        colors={colours}

        // valueScale={{ type: 'linear' }}
        // indexScale={{ type: 'band', round: true }}
        // colors={{ scheme: 'nivo' }}
        // defs={[
        //     {
        //         id: 'dots',
        //         type: 'patternDots',
        //         background: 'inherit',
        //         color: '#38bcb2',
        //         size: 4,
        //         padding: 1,
        //         stagger: true
        //     },
        //     {
        //         id: 'lines',
        //         type: 'patternLines',
        //         background: 'inherit',
        //         color: '#eed312',
        //         rotation: -45,
        //         lineWidth: 6,
        //         spacing: 10
        //     }
        // ]}
        // fill={[
        //     {
        //         match: {
        //             id: 'fries'
        //         },
        //         id: 'dots'
        //     },
        //     {
        //         match: {
        //             id: 'sandwich'
        //         },
        //         id: 'lines'
        //     }
        // ]}
        // borderColor="black"
        // axisTop={null}
        // axisRight={null}
        // axisBottom={{
        //     tickSize: 5,
        //     tickPadding: 5,
        //     tickRotation: 0,
        //     legend: 'country',
        //     legendPosition: 'middle',
        //     legendOffset: 32
        // }}
        // axisLeft={{
        //     tickSize: 5,
        //     tickPadding: 5,
        //     tickRotation: 0,
        //     legend: 'food',
        //     legendPosition: 'middle',
        //     legendOffset: -40
        // }}
        // labelSkipWidth={12}
        // labelSkipHeight={12}
        // // labelTextColor={{
        // //     from: 'color',
        // //     modifiers: [
        // //         [
        // //             'darker',
        // //             1.6
        // //         ]
        // //     ]
        // // }}
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
        // role="application"
        // ariaLabel="Nivo bar chart demo"
        // barAriaLabel={function(e){return e.id+": "+e.formattedValue+" in country: "+e.indexValue}}
    />
    </div>
      )
    
    })}
  </div> );
}
 
//export default QuestionStats;



const DisplayResults = () => {
  const { state } = useLocation();
  const { annotation_tasks } = state;

  const [ documentText, setDocumentText ] = useState("Loading text...");
  const [documentLabels, setDocumentLabels] = useState([])
  const [tag, setTag] = useState("Summary")
  const [questionAnswers, setQuestionAnswers] = useState([])
  const [questionForms, setQuestionForms] = useState([])

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
    console.log("this is annotation tasks", annotation_tasks);
    parseLabels();
    parseQuestionAnswers();
    fetchQuestion();
    //setQuestionAnswers(JSON.parse(annotation_tasks.question_answers))
    fetchDocument(annotation_tasks[0].document_title).then(result => {
      setDocumentText(result);
    })
    // documentText.Body.text().then(string => {
    //   console.log(string);
    //   setDocumentText(string);
    // })
  },[])
  async function fetchQuestion() {
    const form = await API.graphql({
        query: getQuestionForm,
        variables: { id: annotation_tasks[0].questionFormID },
        authMode: "AMAZON_COGNITO_USER_POOLS"
    })
    console.log(form);
    setQuestionForms(form.data.getQuestionForm);
  }

  const parseQuestionAnswers = () => {
    let answers = [];
    for (let i = 0; i < annotation_tasks.length; i++) {
      let parsedAnswers = JSON.parse(annotation_tasks[i].question_answers);
      answers.push(parsedAnswers);
    }
    console.log("answers", answers)
    setQuestionAnswers(answers);
  }

  const parseLabels = () => {
    let labels = []
    for (let i = 0; i < annotation_tasks.length; i++ ) {
      let parsedLabels = JSON.parse(annotation_tasks[i].labels);
      labels.push(...parsedLabels);
    }
    setDocumentLabels(labels);
  }

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
        <Grid columns={2} style={{"height": '100px'}}>
    <Grid.Row stretched>
    <Grid.Column width={8}>
        <Segment style={{height: "10vh", "margin-bottom": "0%", "text-align":"left"}}>
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
        <Segment style={{"overflow": "auto","text-align": "left", "white-space": "pre-wrap", height: "90vh", "margin-top":"0%"}}>
        {documentText && documentLabels && <TextHeatMap tag={tag} documentLabels={documentLabels} documentText={documentText}/>}
          
          </Segment>
      </Grid.Column>
      <Grid.Column width ={8}>
        <Segment padded>
            <h3>Results</h3>
            <p>Question 1</p>
        
    {/* <ResponsiveBar {...commonProps} 
    layout="horizontal" 
    enableGridY={false} 
    enableGridX={true}
    valueScale={{type: "linear"}}
    indexScale={{ type: 'band', round: true }}
     /> */}
     { questionAnswers.length && questionForms.questions &&
       <QuestionStats questionAnswers={questionAnswers} questionForm={questionForms}></QuestionStats>
       }
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
    console.log(string);
      //setDocumentText(string);
  })
  return text.Body.text();
  
}