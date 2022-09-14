import { useEffect, useState } from "react";
import { TextAnnotator } from "react-text-annotate";
import { Segment, Button } from "semantic-ui-react";
import { memo } from "react";


const AnnotationPage = ({ annotationText, handleLabelChange, parentLabels, labelDescriptions }) => {
  const [tag, setTag] = useState(() => labelDescriptions ? labelDescriptions[0].tagName : null);
  const [tagColours, setTagColours] = useState(null);

  useEffect(() => {
    let tempTagColours = {}
    if (labelDescriptions) {
      for (let i = 0; i < labelDescriptions.length; i++) {
        tempTagColours[labelDescriptions[i].tagName] = labelDescriptions[i].labelColour
      }
      setTagColours(tempTagColours)
    }

  }, [labelDescriptions])

  if (!annotationText) {
    return (
      <h2>Loading text...</h2>
    )
  }

  const handleChange = label => {

    handleLabelChange(label);
  }

  const annotationStyle = {
    lineHeight: 1.5,
    "whiteSpace": "pre-wrap",
    "textAlign": "left"
  }
  const basicSegmentStyle = { overflow: 'auto', maxHeight: '80vh' }

  return (
    <div className="annotation-page">
      <h4>Please select the relevant label and highlight the text.
        Click on the highlighted text again to delete them.
      </h4>
      {
        labelDescriptions && labelDescriptions.map(labelDescription => {
          return (
            <Button key={labelDescription.buttonColour} inverted color={labelDescription.buttonColour}
              active={(tag === labelDescription.tagName)}
              onClick={() => setTag(labelDescription.tagName)}>
              {labelDescription.tagName}
            </Button>
          )
        })
      }
      <Button content='Restart' icon='eraser' labelPosition='left' onClick={() => handleLabelChange([])} />

      <Segment style={basicSegmentStyle}>
        {
          parentLabels && <TextAnnotator
            style={
              annotationStyle
            }
            content={annotationText}
            value={parentLabels}
            onChange={handleChange} //handles highlighting
            getSpan={span => ({
              ...span,
              tag: tag,
              color: tagColours[tag]
            })}


          />
        }


      </Segment>

    </div>
  );
}

export default memo(AnnotationPage);
