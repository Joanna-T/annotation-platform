import { useState, useEffect } from "react";
import { Segment, Card, Input, Pagination, Button } from "semantic-ui-react";
import Layout from "../common/Layout";
import { fetchQuestions } from "../utils/queryUtils";
import { returnActiveQuestions } from "../utils/documentUtils";
import { itemsPerPage } from "./adminConstants";

const ListQuestions = ({ questions, path }) => {
    const [allQuestions, setAllQuestions] = useState([])

    //pagination
    const [totalPages, setTotalPages] = useState(1)
    const [activePage, setActivePage] = useState(1)
    const [activePageQuestions, setActivePageQuestions] = useState([])

    //search
    const [searchInput, setSearchInput] = useState("");
    const [visibleQuestions, setVisibleQuestions] = useState([])

    useEffect(() => {
        if (questions) {
            setAllQuestions(questions)
            setVisibleQuestions(questions)

            setTotalPages(Math.ceil(questions.length / itemsPerPage))
            setActivePage(1)

        }

    }, [questions])

    //pagination 
    useEffect(() => {
        let activeQuestions
        if (itemsPerPage >= visibleQuestions.length) {
            activeQuestions = visibleQuestions
        } else {
            //console.log("activepage", activePage)
            let startIndex = ((activePage - 1) * itemsPerPage)
            activeQuestions = visibleQuestions.slice(startIndex, startIndex + itemsPerPage)
        }
        setActivePageQuestions(activeQuestions)
        setTotalPages(Math.ceil(visibleQuestions.length / itemsPerPage))

    }, [activePage, visibleQuestions])

    const handlePaginationChange = (e, { activePage }) => {
        setActivePage(activePage)
    }

    const handleChange = (e) => {
        e.preventDefault();
        setSearchInput(e.target.value)

    }
    const searchQuestions = () => {
        let newQuestions = allQuestions.filter((question) => {
            return question.text.toLowerCase().includes(searchInput.toLowerCase())
        })
        setVisibleQuestions(newQuestions)
    }

    const viewCardStyle = { "marginTop": 5, "marginBottom": 5, "textAlign": "left", "padding": "2%" }
    const inputStyle = { "borderColor": "blue", width: "100%", "borderRadius": "30px" }
    return (
        <div>
            <Input
                type='text'
                placeholder='Search questions here'
                action
                onChange={handleChange}
                value={searchInput}
                style={inputStyle} >
                <input />
                <Button
                    type='submit'
                    onClick={searchQuestions}
                >
                    Search</Button>
            </Input>
            <Segment basic >
                <Card.Group>
                    {
                        activePageQuestions.length > 0 ?
                            activePageQuestions.map((question, index) => {
                                return (

                                    <Card
                                        key={question.id}
                                        fluid color="blue"
                                        style={viewCardStyle}
                                        href={`${path}${question.id}`}
                                        header={`Question title: ${question.text}`}
                                        meta={`Created: ${question.createdAt.slice(0, 10)}`}
                                        description={`${question.complete_tasks}/${question.total_tasks} documents annotated completely`}
                                    />

                                )
                            })
                            :
                            <Segment style={{ width: "100%" }} >
                                No tasks to show currently.
                            </Segment>
                    }



                </Card.Group>
            </Segment>
            <Segment basic textAlign="center">
                <Pagination
                    secondary
                    pointing
                    color="blue"
                    activePage={activePage}
                    onPageChange={handlePaginationChange}
                    totalPages={totalPages}
                ></Pagination>
                <br></br>
            </Segment>
        </div>
    );
}

export default ListQuestions;