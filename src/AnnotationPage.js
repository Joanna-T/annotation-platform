import {useEffect,useState} from "react";
import { TokenAnnotator, TextAnnotator } from "react-text-annotate";
import { Segment, Button } from "semantic-ui-react";


const TAG_COLORS = {
    Summary: "#F6B445",
    Quality: "#F3E322",
    Relevancy: "#E9E836"
  };

const AnnotationPage = ({annotationText, handleLabelChange, parentLabels}) => {
    const [tag, setTag] = useState("Quality");
    const [labels, setLabels] = useState([])

    //console.log(annotationText);

    useEffect(() => {
      console.log("these are the labels in the parent",parentLabels)
    }, [parentLabels])

    // useEffect(() => {
    //   setLabels(parentLabels);
    // }, [parentLabels])

    if (!annotationText) {
        return (
            <h2>Loading text...</h2>
        )
    }


    const handleTagChange = e => {
        setTag(e.target.value);

    }
    const handleChange = label => {
        //setLabels(label);
        console.log(label)
        handleLabelChange(label);
    }

    const sampleText = `Hi \n
    this is a test message.`
    const newText = sampleText.split('\n').map(str => <p>{str}</p>);

    return ( 
        <div className="annotation-page">
          <h4>Please select the relevant label and highlight the text. 
              Click on the highlighted text again to delete them.
          </h4>
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
      <Button content='Restart' icon='eraser' labelPosition='left' onClick={() => handleLabelChange([])}/>

          <Segment style={{overflow: 'auto', maxHeight: '100vh' }}>
            {
              parentLabels && <TextAnnotator
              style={{
                lineHeight: 1.5,
                "white-space": "pre-wrap",
                "text-align": "left"
              }}
              content={annotationText}
              value={parentLabels}
              onChange={handleChange} //handles highlighting
              getSpan={span => ({
                ...span,
                tag: tag,
                color: TAG_COLORS[tag]
              })}
              
       
            />
            }
          
        
          </Segment>
        
        </div>
     );
}
 
export default AnnotationPage;
