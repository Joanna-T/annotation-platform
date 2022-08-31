import { useEffect, useState } from "react";
import { API, Storage } from "aws-amplify";
import { getQuestionForm } from "../graphql/queries";
import { Segment, Icon, Button, Modal } from "semantic-ui-react";
import { ResponsiveBar } from "nivo/lib/components/charts/bar";
import { fetchQuestion, fetchQuestionForm } from "../utils/queryUtils";
import { groupAnswers, calculateAllFleissKappa } from "../utils/curationScoreUtils";
import { memo } from "react";

const InterannotatorAgreement = ({ medicalQuestion, grouped_tasks }) => {

  const [fleissKappa, setFleissKappa] = useState(null)
  const [aggregatedBarData, setAggregatedBarData] = useState(null);


  useEffect(() => {
    if (medicalQuestion) {
      console.log("There is a valid question")
      let semanticAgreement;
      let parsedFleissKappa = JSON.parse(JSON.parse(medicalQuestion.interannotatorAgreement))
      let parsedAggregatedData = JSON.parse(JSON.parse(medicalQuestion.aggregatedAnswers))
      if (!medicalQuestion.semanticAgreement) {
        semanticAgreement = 0
      }
      else {
        let parsedSemanticAgreement = JSON.parse(JSON.parse(medicalQuestion.semanticAgreement))
        //semanticAgreement = parsedSemanticAgreement["semanticAgreement"]
      }

      console.log("parsedfleiss", parsedFleissKappa)
      console.log("parsedaggreg", parsedAggregatedData)
      setFleissKappa(parsedFleissKappa)
      setAggregatedBarData(parsedAggregatedData)
      //setSemanticAgreement(semanticAgreement)
    }


  }, [medicalQuestion])

  const likelihoodToText = (score) => {
    if (score <= 0) {
      return "No agreement"
      //return "(Poor agreement)"
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

  const colours = [
    "#009E73",
    "#F0E442",
    "#56B4E9",
    "#E69F00",
    "#CC79A7",
    "#D55E00"
  ]

  const colours1 = [
    "hsl(142, 0%, 50%)",
    "hsl(127, 70%, 50%)",
    "hsl(247, 70%, 50%)",
    "hsl(274, 70%, 50%)",
    "hsl(331, 70%, 50%)",
    "hsl(62, 70%, 50%)"
  ]

  const marginProperties = { top: 50, right: 50, bottom: 50, left: 100 }
  const containerDivStyle = { "maxHeight": "50vh", "overflow": "auto" }


  return (<div style={containerDivStyle}>


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
  </div>);
}

export default memo(InterannotatorAgreement);