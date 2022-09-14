import { useEffect, useState } from "react";
import { Icon, Button, Modal, Segment } from "semantic-ui-react";
import { ResponsiveBar } from "nivo/lib/components/charts/bar";
import { memo } from "react";
import { colours } from "./commonConstants";

const InterannotatorAgreement = ({ medicalQuestion, grouped_tasks }) => {

  const [fleissKappa, setFleissKappa] = useState(null)
  const [aggregatedBarData, setAggregatedBarData] = useState(null);


  useEffect(() => {
    if (medicalQuestion) {
      let parsedFleissKappa = JSON.parse(JSON.parse(medicalQuestion.interannotatorAgreement))
      let parsedAggregatedData = JSON.parse(JSON.parse(medicalQuestion.aggregatedAnswers))

      setFleissKappa(parsedFleissKappa)
      setAggregatedBarData(parsedAggregatedData)
    }


  }, [medicalQuestion])

  const likelihoodToText = (score) => {

    if (score <= 0) {
      return "No agreement"
      //return "(Poor agreement)" //Cohen agreement threshold
    }
    if (score <= 0.2) {
      return "(No agreement)"
      //return "(Slight agreement)"
    }
    if (score <= 0.4) {
      return "(Minimal agreement)"
      //return "(Fair agreement)"
    }
    if (score <= 0.6) {
      return "(Weak agreement)"
      //return "(Moderate agreement)"
    }
    if (score <= 0.8) {
      return "(Moderate agreement)"
      //return "(Substantial agreement)"
    }
    if (score <= 1.0) {
      return "(Strong agreement)"
      //return "(Almost perfect agreement)"
    }
    if (score === "-") {
      return "Insufficient results"
    }
  }

  const marginProperties = { top: 50, right: 50, bottom: 50, left: 100 }
  const containerDivStyle = { textAlign: "center", "maxHeight": "50vh", "overflow": "auto" }


  return (<Segment basic style={containerDivStyle}>


    <br />
    <p style={{ display: "inline" }}>The following are aggregated results for all documents across this question.
      IA denotes the Fleiss Kappa inter-annotator agreement for a given category.
    </p>
    {"  "}<Modal
      trigger={<Button size="mini" circular icon='question' />}
      header='Fleiss Kappa interannotator agreement'
      content='The Fleiss Kappa is an extension of the Cohen kappa interannotator agreement,
      and is used to evaluate agreement between two or more raters. 
      It denotes how much the proportion of the observed answers exceeds that of when 
      annotators makes their choices randomly.'
      actions={[{ key: 'done', content: 'Done', positive: true }]}
    />

    {aggregatedBarData && aggregatedBarData.map((item, index) => {
      return (

        <div key={index} style={{ "height": "100px" }}>
          <p>IA:{" "}<b>{fleissKappa && fleissKappa[item["category"]]}</b>
            {" "}{fleissKappa && likelihoodToText(fleissKappa[item["category"]])}</p>
          {Object.keys(item).map((option, innerIndex) => {
            let keyColor = colours[innerIndex];
            if (option !== "category") {
              return (
                <p key={innerIndex} style={{ display: "inline" }}>{option}<Icon style={{ color: keyColor }} name="circle"></Icon></p>
              )
            }
            return ""

          })}
          <ResponsiveBar
            data={[item]}
            keys={Object.keys(item).filter(element => element !== "category")}
            layout="horizontal"
            indexBy="category"
            margin={marginProperties}
            padding={0.3}
            height={20}
            colors={colours}

          />
          <br></br>

        </div>
      )

    })}
  </Segment>);
}

export default memo(InterannotatorAgreement);