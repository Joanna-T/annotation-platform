import { useState, useEffect } from "react";

const TextHeatMap = ({ documentLabels, documentText, tag }) => {
  const [highlightedText, setHighlightedText] = useState("Loading text...");

  const [labelsText, setLabelsText] = useState({})
  const [labels, setLabels] = useState(documentLabels)
  let text_1 = ""


  useEffect(() => {
    setLabels(documentLabels)

  }, [documentLabels])

  useEffect(() => {
    console.log("this is heatmap?", documentText)
    insertSpan(documentText, "Summary");
    setLabelsText({})
  }, [documentText])

  useEffect(() => {
    insertSpan(documentText, tag);
  }, [tag])


  async function insertSpan(documentText, labelType) {

    console.log("InsertSpan called")
    if (labelType in labelsText && labelsText[labelType] !== "Loading text...") {
      setHighlightedText(labelsText[labelType])
      return
    }


    let text = documentText
    let tempLabels = [...documentLabels];

    for (let i = 0; i < tempLabels.length; i++) {
      if (tempLabels[i].tag === labelType) {
        console.log()
        let spanElementStart = `<span style="opacity:100%;color:black;background-color:${tempLabels[i].color};mix-blend-mode:multiply;border-radius:5px">`;
        let spanElementEnd = `</span>`;
        text = text.slice(0, tempLabels[i].start) + spanElementStart + text.slice(tempLabels[i].start)
        text = text.slice(0, tempLabels[i].end + spanElementStart.length) + spanElementEnd + text.slice(tempLabels[i].end + spanElementStart.length)

        for (let j = i + 1; j < tempLabels.length; j++) {
          console.log("object before alteration", tempLabels[j])
          if (tempLabels[j].tag !== labelType) {
            continue;
          }
          if (tempLabels[j].start >= tempLabels[i].end &&
            tempLabels[j].end >= tempLabels[i].end) {
            console.log("10")
            tempLabels[j].start += spanElementStart.length
            tempLabels[j].start += spanElementEnd.length
            tempLabels[j].end += spanElementStart.length
            tempLabels[j].end += spanElementEnd.length
          }
          else if (tempLabels[j].start >= tempLabels[i].start &&
            tempLabels[j].start < tempLabels[i].end &&
            tempLabels[j].end >= tempLabels[i].end) {
            console.log("20")
            tempLabels[j].start += spanElementStart.length
            tempLabels[j].end += spanElementStart.length
            tempLabels[j].end += spanElementEnd.length

          }
          else if (tempLabels[j].start >= tempLabels[i].start &&
            tempLabels[j].start < tempLabels[i].end &&
            tempLabels[j].end < tempLabels[i].end) {
            console.log("30")
            tempLabels[j].start += spanElementStart.length
            tempLabels[j].end += spanElementStart.length
          }
          else if (tempLabels[j].start < tempLabels[i].start &&
            tempLabels[j].end >= tempLabels[i].end) {
            console.log("40")
            tempLabels[j].end += spanElementStart.length
            tempLabels[j].end += spanElementEnd.length
          }
          else if (tempLabels[j].start < tempLabels[i].start &&
            tempLabels[j].end >= tempLabels[i].start &&
            tempLabels[j].end < tempLabels[i].end) {
            console.log("50")
            tempLabels[j].end += spanElementStart.length
          }

          console.log("altered objects", tempLabels[j])
        }
      }


    }
    setLabelsText(prevState => ({
      ...prevState,
      [tag]: text,
    }))

    setHighlightedText(text)
    console.log("highlighted text", text)

  }


  return (
    <div dangerouslySetInnerHTML={{ __html: highlightedText }}>
    </div>
  );
}

export default TextHeatMap;