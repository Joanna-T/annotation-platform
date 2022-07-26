import { useState, useEffect } from "react";
import { Icon, Segment } from "semantic-ui-react";
import { ResponsiveBar } from "nivo/lib/components/charts/bar";
import { memo } from "react";
import { colours } from "./commonConstants";

const DocumentStats = ({ questionAnswers, questionForm }) => {
  const [formQuestions, setFormQuestions] = useState([]);
  const [barData, setBarData] = useState([])


  useEffect(() => {
    createBarData(questionAnswers, questionForm)
  }, [questionAnswers, questionForm])

  async function createBarData(answers, inputQuestionsForm) {
    let questions = JSON.parse(inputQuestionsForm.questions);

    setFormQuestions(questions)

    let allDataItems = [];

    for (let i = 0; i < questions.length; i++) {

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

    setBarData([...allDataItems])
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

  const containerStyle = { textAlign: "center", height: "45vh", overflow: "auto" }

  return (<Segment basic style={containerStyle}>

    {barData.map((item, index) => {
      return (
        <div key={index} style={{ "height": "100px" }}>
          <p>{index + 1}{". "}{formQuestions[index].question_text}</p>
          {formQuestions[index].options.map((option, innerIndex) => {
            let coloursIndex = orderColours(item, option)
            let keyColor = colours[coloursIndex - 1];

            return (
              <p key={option} style={{ display: "inline" }}>{option}<Icon style={{ color: keyColor }} name="circle"></Icon></p>

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
          />
        </div>
      )

    })}
  </Segment>);

}


export default memo(DocumentStats);