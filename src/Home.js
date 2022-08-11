import Layout from "./Layout";
import { useState, useEffect } from "react";
import { Search, Segment, Input, Card, Header, Icon } from "semantic-ui-react";
import { fetchQuestions } from "./queryUtils";
import { findCompletedTasks,groupTasksByDocument } from "./documentUtils";

const Home = () => {
    const [searchInput, setSearchInput] = useState("");
    const [allQuestions, setAllQuestions] = useState([,
      ])
    const [visibleQuestions, setVisibleQuestions] = useState([])

    useEffect(() => {
        let newQuestions = allQuestions.filter((question) => {
            return question.text.toLowerCase().includes(searchInput.toLowerCase())
        })
        setVisibleQuestions(newQuestions)
    }, [searchInput])

    //const [questionNumber, setQuestionNumber] = useState(false);
    useEffect(() => {
        fetchQuestions()
        .then(result => {
            let questionsArray = []
            result.forEach(item => {
                let groupedTasks = groupTasksByDocument(item.tasks.items);
                let completedTasks = findCompletedTasks(groupedTasks)
                if (completedTasks >= process.env.REACT_APP_NUMBER_CURATORS) { 
                    item["total_tasks"] = groupedTasks.length;
                    item["complete_tasks"] = completedTasks
                    questionsArray.push(item)
                }
            })
            setVisibleQuestions(questionsArray)
            setAllQuestions(questionsArray)
            
        });
        //fetchQuestions();
    },[])

    const handleChange = (e) => {
        e.preventDefault();
        setSearchInput(e.target.value)
        
    }

    // if (searchInput.length > 0) {
    //     let newQuestions = questions.filter((question) => {
    //         return question.text.includes(searchInput)
    //     })
    //     setQuestions(newQuestions)
    // }

    // const questions = [
    //     { text: "Belgium", continent: "Europe" },
    //     { text: "India", continent: "Asia" },
    //     { text: "Bolivia", continent: "South America" },
    //     { text: "Ghana", continent: "Africa" },
    //     { text: "Japan", continent: "Asia" },
    //     { text: "Canada", continent: "North America" },
    //     { text: "New Zealand", continent: "Australasia" },
    //     { text: "Italy", continent: "Europe" },
    //     { text: "South Africa", continent: "Africa" },
    //     { text: "China", continent: "Asia" },
    //     { text: "Paraguay", continent: "South America" },
    //     { text: "Usa", continent: "North America" },
    //     { text: "France", continent: "Europe" },
    //     { text: "Botswana", continent: "Africa" },
    //     { text: "Spain", continent: "Europe" },
    //     { text: "Senegal", continent: "Africa" },
    //     { text: "Brazil", continent: "South America" },
    //     { text: "Denmark", continent: "Europe" },
    //     { text: "Mexico", continent: "South America" },
    //     { text: "Australia", continent: "Australasia" },
    //     { text: "Tanzania", continent: "Africa" },
    //     { text: "Bangladesh", continent: "Asia" },
    //     { text: "Portugal", continent: "Europe" },
    //     { text: "Pakistan", continent:"Asia" },
    //   ];
      
      
      
    return ( 
        <Layout>
            <Segment basic>
            <Header as='h2' icon textAlign='center'>
            <Icon color="blue" name='edit outline' circular />
            <Header.Content>Welcome to the AnnotateIt test environment</Header.Content>
            </Header>
                <p>Please enter a search query below to find relevant annotation question results</p>
            </Segment>
            <Segment basic style ={{"padding-left": "10%", "padding-right": "10%"}}>
            {/* <Search input={{fluid: true}}
            size="large"
            placeholder="Search questions..."
            onSearchChange={handleChange}
            value={searchInput}>

            </Search> */}
            {/* <input
            type="text"
            placeholder="Search questions"
            onChange={handleChange}
            value={searchInput} 
            style={{"border-color": "grey",width:"100%", "border-radius": "30px", height:"40px", "padding-left":"10px"}}/> */}

            <Input
            icon="search"
            type="text"
            placeholder="Search questions"
            onChange={handleChange}
            value={searchInput} 
            style={{"border-color": "blue",width:"100%", "border-radius": "30px",}}/>

            </Segment>
          
            <Segment basic
            style={{maxHeight:"70vh", overflow:"auto"}}>
                {visibleQuestions.length > 0 ? 
                visibleQuestions.map((question, index) => {
                    return (
                        <Card
                        fluid color="blue"
                        style={{"margin-top": 5, "margin-bottom": 5, "text-align": "left", "padding": "2%"}}
    href={`/completed_tasks/${question.id}`}
    header={ `Question title: ${question.text}`   }
    meta={`Question ${index + 1}`}
    //description={`Progress: ${question.complete_tasks}/${question.total_tasks} documents annotated completely`}
  />
  )
                }) :
                <p> No results found</p>}
            </Segment>
        </Layout>
     );
}
 
export default Home;