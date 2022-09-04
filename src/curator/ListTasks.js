import { useState, useEffect } from "react";
import { Segment, Card, Input, Pagination, Button } from "semantic-ui-react";

const ListTasks = ({ tasks, documentTitles }) => {
    const [allTasks, setAllTasks] = useState([])

    //pagination
    const [totalPages, setTotalPages] = useState(1)
    const [activePage, setActivePage] = useState(1)
    const [activePageTasks, setActivePageTasks] = useState([])

    //search
    const [searchInput, setSearchInput] = useState("");
    const [visibleTasks, setVisibleTasks] = useState([])

    const itemsPerPage = 5

    useEffect(() => {
        if (tasks) {
            setAllTasks(tasks)
            setVisibleTasks(tasks)

            setTotalPages(Math.ceil(tasks.length / itemsPerPage))
            setActivePage(1)

        }

    }, [tasks])

    //pagination 
    useEffect(() => {
        let activeTasks
        if (itemsPerPage >= visibleTasks.length) {
            activeTasks = visibleTasks
        } else {
            console.log("activepage", activePage)
            let startIndex = ((activePage - 1) * itemsPerPage)
            activeTasks = visibleTasks.slice(startIndex, startIndex + itemsPerPage)
        }
        setActivePageTasks(activeTasks)
        setTotalPages(Math.ceil(visibleTasks.length / itemsPerPage))

    }, [activePage, visibleTasks])

    const handlePaginationChange = (e, { activePage }) => {
        setActivePage(activePage)
    }

    const handleChange = (e) => {
        e.preventDefault();
        setSearchInput(e.target.value)

    }
    const searchTasks = () => {
        let newTasks = allTasks.filter((task) => {
            return documentTitles[task.id].toLowerCase().includes(searchInput.toLowerCase())
        })
        setVisibleTasks(newTasks)
    }

    const viewCardStyle = { "marginTop": 5, "marginBottom": 5, "textAlign": "left", "padding": "2%" }
    const inputStyle = { "borderColor": "blue", width: "100%", "borderRadius": "30px" }
    return (
        <div>
            <Input
                type='text'
                placeholder='Search tasks here'
                action
                onChange={handleChange}
                value={searchInput}
                style={inputStyle} >
                <input />
                <Button
                    type='submit'
                    onClick={searchTasks}
                >
                    Search</Button>
            </Input>
            <Segment basic >

                <Card.Group>
                    {
                        activePageTasks.length > 0 ?
                            activePageTasks.map((task, index) => {
                                return (

                                    <Card
                                        key={task.id}
                                        fluid color="blue"
                                        style={viewCardStyle}
                                        href={`/completed_curator_tasks/${task.id}`}
                                        header={`Document title: ${documentTitles[task.id]}`}
                                        meta={`Created ${task.createdAt.substring(0, 10)}`}
                                        description={`Question: ${task.question.text}`}
                                    />

                                )
                            })
                            :
                            <Segment style={{ width: "100%", textAlign: "center" }} >
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

export default ListTasks;