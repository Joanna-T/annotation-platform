import { useState, useEffect } from "react";
import { Segment, Icon } from "semantic-ui-react";
import { ResponsiveBar } from "nivo/lib/components/charts/bar";

const QuestionStats = ({ questionAnswers, questionForm }) => {
  const [formQuestions, setFormQuestions] = useState([]);
  const [barData, setBarData] = useState([])
  const [cohenKappaValues, setCohenKappaValues] = useState([])

  useEffect(() => {
    console.log("BAR DATA", barData)
  }, [barData])

  useEffect(() => {
    console.log("Answers", questionAnswers);
    console.log("form", questionForm)
    createBarData(questionAnswers, questionForm)
  }, [questionAnswers, questionForm])

  async function createBarData(answers, inputQuestionsForm) {
    let questions = JSON.parse(inputQuestionsForm.questions);
    console.log("createbardataanswers", answers)
    setFormQuestions(questions)
    console.log("createBarData");
    let allDataItems = [];
    let kappaValues = [];
    for (let i = 0; i < questions.length; i++) {
      console.log("createBarData", questions[i])
      let newQuestion = {
        "category": questions[i].question_description,

      }
      for (let j = 0; j < questions[i].options.length; j++) {

        const relevantAnswers = answers.filter(answer => {
          return (
            ((answer !== null) &&
              (answer[questions[i].question_description] === questions[i].options[j]))
          )

        }
        )

        newQuestion[questions[i].options[j]] = relevantAnswers.length;
        newQuestion[questions[i].options[j] + "colour"] = colours[j]

      }
      allDataItems.push(newQuestion)
    }
    console.log("ENDcreatebardata", allDataItems)
    setBarData([...allDataItems])
  }


  const colours = [
    "hsl(142, 0%, 50%)",
    "hsl(127, 70%, 50%)",
    "hsl(247, 70%, 50%)",
    "hsl(274, 70%, 50%)",
    "hsl(331, 70%, 50%)",
    "hsl(62, 70%, 50%)"
  ]
  const colours1 = {
    "option1": "hsl(142, 0%, 50%)",
    "option2": "hsl(127, 70%, 50%)",
    "option3": "hsl(247, 70%, 50%)",
    "option5": "hsl(331, 70%, 50%)",
    "option6": "hsl(62, 70%, 50%)"
  }

  const orderColours = (item, option) => {
    let index = 0
    let zeroItemCounter = 0;
    let indexZeroItem;
    for (const [key, value] of Object.entries(item)) {
      if (key === "category") {
        continue;
      }
      if (value > 0) {
        index++;
        if (key === option) {
          return index;
        }
      }
      if (value === 0) {
        zeroItemCounter++
        if (key === option) {
          indexZeroItem = zeroItemCounter;
        }

      }
    }
    return indexZeroItem + index
  }

  return (<div style={{ height: "45vh", overflow: "auto" }}>
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
    {barData.map((item, index) => {
      return (
        <div style={{ "height": "100px" }}>
          <p>{index + 1}{". "}{formQuestions[index].question_text}</p>
          {formQuestions[index].options.map((option, innerIndex) => {
            let coloursIndex = orderColours(item, option)
            let keyColor = colours[coloursIndex - 1];
            console.log("KEY COLORRRRRRRR", keyColor)
            return (
              <p style={{ display: "inline" }}>{option}<Icon style={{ color: keyColor }} name="circle"></Icon></p>

            )
          })}
          <ResponsiveBar
            data={[item]}
            keys={formQuestions[index].options}
            layout="horizontal"
            indexBy="category"
            margin={{ top: 50, right: 50, bottom: 50, left: 100 }}
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
                anchor: 'top',
                direction: 'column',
                justify: true,
                translateX: 0,
                translateY: 0,
                itemsSpacing: 2,
                itemWidth: 1000,
                itemHeight: 20,
                itemDirection: 'left-to-right',
                itemOpacity: 0.85,
                symbolSize: 100,
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
  </div>);

}


export default QuestionStats;