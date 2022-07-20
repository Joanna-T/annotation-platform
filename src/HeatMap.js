const HeatMap = () => {
    return ( 
        <div>hello</div>
     );
}
 
export default HeatMap;



// import { useState, useEffect } from "react";

// export default HeatMap = ({documentLabels, documentText, tag}) => {
//     const [highlightedText, setHighlightedText] = useState("Loading text...");
  
//     const [ labelsText, setLabelsText ] = useState({})
//     const label = [{
//       start: 10,
//       end: 20
  
//     },
//     {
//       start: 25,
//       end: 30
//     }, 
  
//     {
//       start: 0,
//       end: 35
//     },
//     {
//       start: 5,
//       end: 15
//     }
  
//     ]
//     const [text1, setText] = useState("Loading text...")
//     const [labels, setLabels] = useState(documentLabels)
//     let text_1 = "There is a very very very very long sentence........................................."
    
  
//     // useEffect(() => {
//     //   Promise.all(setText(documentText), setLabels(documentLabels)).then(() => {
//     //     insertSpan();
//     //   })
  
      
//     // }, [documentText, documentLabels])
  
//     useEffect(() => {
//       setLabels(documentLabels)
//       //insertSpan();
//     }, [documentLabels])
  
//     useEffect(() => {
//        insertSpan(documentText, "Summary"); 
//     }, [documentText])
  
//     useEffect(() => {
//       insertSpan(documentText, tag); 
//     }, [tag])
  
  
//     async function insertSpan(documentText, labelType) {
  
//       if (labelType in labelsText && labelsText[labelType] !== "Loading text...") {
//         setHighlightedText(labelsText[labelType])
//         return
//       }
  
//       console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~##")
//       console.log("InsertSpan called")
//       let text = documentText
//       let tempLabels = [...documentLabels];
//       //let text = text1;
//       for (let i = 0; i < tempLabels.length; i++) {
//         if (tempLabels[i].tag === labelType) {
//           console.log()
//           let spanElementStart = `<span style="opacity:100%;color:black;background-color:${tempLabels[i].color};mix-blend-mode:multiply;border-radius:5px">`;
//         let spanElementEnd = `</span>`;
//         text = text.slice(0, tempLabels[i].start) + spanElementStart + text.slice(tempLabels[i].start)
//         text = text.slice(0, tempLabels[i].end + spanElementStart.length) + spanElementEnd + text.slice(tempLabels[i].end + spanElementStart.length)
//         //console.log("this the html ", text)
//         for (let j = i+1; j < tempLabels.length; j++) {
//           console.log("object before alteration", tempLabels[j] )
//           if (tempLabels[j].tag !== labelType ) {
//             continue;
//           }
//           if (tempLabels[j].start >= tempLabels[i].end &&
//               tempLabels[j].end >= tempLabels[i].end) {
//                 console.log("10")
//             tempLabels[j].start += spanElementStart.length 
//             tempLabels[j].start += spanElementEnd.length 
//             tempLabels[j].end += spanElementStart.length 
//             tempLabels[j].end += spanElementEnd.length 
//           }
//           else if (tempLabels[j].start >= tempLabels[i].start &&
//               tempLabels[j].start < tempLabels[i].end &&
//               tempLabels[j].end >= tempLabels[i].end ) {
//               console.log("20")
//               tempLabels[j].start += spanElementStart.length
//               tempLabels[j].end += spanElementStart.length 
//               tempLabels[j].end += spanElementEnd.length 
  
//           }
//           else if (tempLabels[j].start >= tempLabels[i].start &&
//             tempLabels[j].start < tempLabels[i].end &&
//             tempLabels[j].end < tempLabels[i].end) {
//               console.log("30")
//             tempLabels[j].start += spanElementStart.length
//             tempLabels[j].end += spanElementStart.length
//           }
//           else if ( tempLabels[j].start < tempLabels[i].start &&
//               tempLabels[j].end >= tempLabels[i].end ) {
//               console.log("40")
//               tempLabels[j].end += spanElementStart.length 
//               tempLabels[j].end += spanElementEnd.length 
//             }
//           else if ( tempLabels[j].start < tempLabels[i].start &&
//               tempLabels[j].end >= tempLabels[i].start &&
//               tempLabels[j].end < tempLabels[i].end) {
//               console.log("50")
//                 tempLabels[j].end += spanElementStart.length 
//               }
  
//           console.log("altered objects", tempLabels[j])
//         }
//         }
        
      
//       }
//       setLabelsText(prevState => ({
//         ...prevState,
//         [tag]: text,
//       }))
  
//       setHighlightedText(text)
//       console.log("highlighted text",text)
//       //setLabels(labels)
//     }
    
  
//     return ( 
//       <div dangerouslySetInnerHTML={{__html: highlightedText}}>
//       </div>
//      );
//   }
   
// //export default HeatMap;