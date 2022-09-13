import { queryByText, render, screen, waitFor } from "@testing-library/react";
import ReassignTasks from "../../admin/ReassignTasks";
import * as queryUtils from "../../utils/queryUtils";
import { act } from "react-dom/test-utils";
import * as mutationUtils from "../../utils/mutationUtils";
import * as reassignTaskUtils from "../../utils/reassignTaskUtils"
import * as authUtils from "../../utils/authUtils"
import { BrowserRouter as Router } from 'react-router-dom';

const OLD_ENV = process.env;

beforeEach(() => {
    var tasksQuestionOne = [
        {
            documentTitle: "title1",
            documentFileName: "title1",
            owner: "user1",
            completed: false
        },
        {
            documentTitle: "title1",
            documentFileName: "title1",
            owner: "user2",
            completed: true
        },
        {
            documentTitle: "title2",
            documentFileName: "title2",
            owner: "user1",
            completed: true
        },
        {
            documentTitle: "title2",
            documentFileName: "title2",
            owner: "user2",
            completed: true
        },
        {
            documentTitle: "title2",
            documentFileName: "title2",
            owner: "user3",
            completed: false
        }
    ]
    var tasksQuestionTwo = [
        {
            documentTitle: "title3",
            documentFileName: "title3",
            owner: "user1",
            completed: true
        },
        {
            documentTitle: "title3",
            documentFileName: "title3",
            owner: "user2",
            completed: true
        },
        {
            documentTitle: "title4",
            documentFileName: "title4",
            owner: "user1",
            completed: true
        },
        {
            documentTitle: "title4",
            documentFileName: "title4",
            owner: "user2",
            completed: true
        }
    ]

    var questionOne = {
        id: "1",
        text: "Question One",
        tasks: {
            items: tasksQuestionOne
        }
    }

    var questionTwo = {
        id: "2",
        text: "Question Two",
        tasks: {
            items: tasksQuestionTwo
        }
    }
    jest.spyOn(mutationUtils, "submitTask").mockReturnValue(
        Promise.resolve(true)

    )
    // jest.spyOn(documentUtils, "createReassignedTasks").mockImplementation((input) => {
    //     documentUtils.createReassignedTasks(input);
    // }     
    // )
    jest.spyOn(authUtils, "checkIfAdmin").mockReturnValue(
        true
    )

    jest.spyOn(reassignTaskUtils, "createReassignedTasks").mockReturnValue(
        [{}]
    )

    jest.spyOn(queryUtils, "fetchQuestions").mockReturnValue(
        Promise.resolve(
            [{
                id: "1",
                text: "question one",
                tasks: {
                    items: tasksQuestionOne
                }
            },
            {
                id: "2",
                test: "question two",
                tasks: {
                    items: tasksQuestionTwo
                }
            }]
        )


    )

    jest.spyOn(queryUtils, "listCurators").mockReturnValue(
        Promise.resolve(
            [
                "user1",
                "user2",
                "user3",
                "user4",
                "user5"
            ]
        )


    )



    jest.resetModules()

    process.env.REACT_APP_NUMBER_CURATORS = 2
})

afterAll(() => {
    process.env = OLD_ENV
})




jest.spyOn(queryUtils, "fetchQuestions").mockReturnValue(
    Promise.resolve(
        [{
            id: "1",
            text: "question one"
        },
        {
            id: "2",
            test: "question two"
        }]
    )


)

describe("document functions tests", () => {
    it("successfully renders interface", async () => {
        await act(() => {
            render(
                <Router>
                    <ReassignTasks />
                </Router>)
        })

        const formQuestion = screen.getByText(/Please choose a task to reassign/);

        expect(formQuestion).toBeInTheDocument();

    })

    it("lists incomplete questions", async () => {

        await act(() => {
            render(
                <Router>
                    <ReassignTasks />
                </Router>)
        })

        const questionOneText = screen.queryByText(/question one/)
        const questionTwoText = screen.queryByText(/question two/)

        expect(questionOneText).toBeInTheDocument();
        expect(questionTwoText).not.toBeInTheDocument();

    })

    it("displays question documents", async () => {
        await act(() => {
            render(
                <Router>
                    <ReassignTasks />
                </Router>)
        })

        const questionPanel = screen.getByText(/question one/)

        act(() => {
            questionPanel.dispatchEvent(new MouseEvent("click", {
                bubbles: true
            }))
        })

        const documentOneText = screen.queryByText(/title1/)
        const documentTwoText = screen.queryByText(/title2/)

        expect(documentOneText).toBeInTheDocument();
        expect(documentTwoText).toBeInTheDocument();

    })

})