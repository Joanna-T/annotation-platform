import { render, screen } from "@testing-library/react";
import ReassignTasks from "./ReassignTasks";
import * as queryUtils from "./queryUtils";
import { act } from "react-dom/test-utils";
import * as mutationUtils from "./mutationUtils";
import * as documentUtils from "./documentUtils"
//import {waitForElement} from "@testing-library";
//import { fetchQuestions, listCurators } from "./queryUtils";

const OLD_ENV = process.env;

beforeEach(() => {
    var tasksQuestionOne = [
        {
            document_title: "title1",
            owner: "user1",
            completed: false
        },
        {
            document_title: "title1",
            owner: "user2",
            completed: true
        },
        {
            document_title: "title2",
            owner: "user1",
            completed: true
        },
        {
            document_title: "title2",
            owner: "user2",
            completed: true
        },
        {
            document_title: "title2",
            owner: "user3",
            completed: false
        }
    ]
    var tasksQuestionTwo = [
        {
            document_title: "title3",
            owner: "user1",
            completed: true
        },
        {
            document_title: "title3",
            owner: "user2",
            completed: true
        },
        {
            document_title: "title4",
            owner: "user1",
            completed: true
        },
        {
            document_title: "title4",
            owner: "user2",
            completed: true
        }
    ]
    jest.spyOn(mutationUtils, "submitTask").mockReturnValue(
        Promise.resolve(true)

    )
    // jest.spyOn(documentUtils, "createReassignedTasks").mockImplementation((input) => {
    //     documentUtils.createReassignedTasks(input);
    // }     
    // )

    jest.spyOn(documentUtils, "createReassignedTasks").mockReturnValue(
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
    // jest.mock('./queryUtils', () => {
    //     return {
    //         ...jest.requireActual('./queryUtils'),
    //         listCurators: jest.fn().mockReturnValue(
    //             [
    //                 "user1",
    //                 "user2",
    //                 "user3",
    //                 "user4", 
    //                 "user5"
    //             ]
    //         ),
    //         fetchQuestions: jest.fn().mockReturnValue(Promise.resolve(
    //             [{
    //                 id: "1",
    //                 text: "question one"
    //             },
    //                 {id: "2",
    //                 test: "question two"}]
    //         ))
    //       }
    // })
    process.env.REACT_APP_NUMBER_CURATORS = 2
})

afterAll(() => {
    process.env = OLD_ENV
})


var tasksQuestionOne = [
    {
        document_title: "title1",
        owner: "user1",
        completed: false
    },
    {
        document_title: "title1",
        owner: "user2",
        completed: true
    },
    {
        document_title: "title2",
        owner: "user1",
        completed: true
    },
    {
        document_title: "title2",
        owner: "user2",
        completed: true
    },
    {
        document_title: "title2",
        owner: "user3",
        completed: false
    }
]
var tasksQuestionTwo = [
    {
        document_title: "title3",
        owner: "user1",
        completed: false
    },
    {
        document_title: "title3",
        owner: "user2",
        completed: false
    },
    {
        document_title: "title4",
        owner: "user1",
        completed: false
    },
    {
        document_title: "title4",
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


// jest.mock('./queryUtils', () => {
//     return {
//         listCurators: jest.fn().mockReturnValue(
//             [
//                 "user1",
//                 "user2",
//                 "user3",
//                 "user4", 
//                 "user5"
//             ]
//         ),
//         fetchQuestions: jest.fn().mockReturnValue(
//             ["questionOne",
//             "questionTwo"]
//         )
//       }
// })

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


jest.mock('./mutationUtils', () => {
    return {
        submitTask: jest.fn().mockImplementation(() => {
        }
        )
    }
})

describe("document functions tests", () => {
    it("successfully renders interface", async () => {
        await act(() => {
            render(<ReassignTasks />)
        })

        const formQuestion = screen.getByText(/Please choose a task to reassign/);

        //const questionText = await waitForElement(() => queryByText(/question one/))
        expect(formQuestion).toBeInTheDocument();

    })

    it("lists incomplete questions", async () => {
        await act(() => {
            render(<ReassignTasks />)
        })

        const questionOneText = screen.queryByText(/question one/)
        const questionTwoText = screen.queryByText(/question two/)

        expect(questionOneText).toBeInTheDocument();
        expect(questionTwoText).not.toBeInTheDocument();

    })

    it("displays question documents", async () => {
        await act(() => {
            render(<ReassignTasks />)
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

    it("submits reassigned tasks when questions are chosen", async () => {
        // jest.spyOn(mutationUtils, "submitTask").mockImplementation((result) => {
        //     return true;
        // }      
        // )

        //jest.mock("./mutationUtils", () => jest.fn());
        // await act(() => {
        //     render(<ReassignTasks />)
        // })   

        // const questionPanel = screen.getByText(/question one/)
        // const submitButton = screen.getByText(/Reassign tasks/)
        // expect(submitButton).toBeInTheDocument();

        // act(() => {
        //     submitButton.dispatchEvent(new MouseEvent("click",{
        //         bubbles:true
        //     }))
        // })

        // expect(mutationUtils.submitTask).not.toHaveBeenCalled();

        // act(() => {
        //     questionPanel.dispatchEvent(new MouseEvent("click",{
        //         bubbles:true
        //     }))
        // })




        // act(() => {
        //     submitButton.dispatchEvent(new MouseEvent("click",{
        //         bubbles:true
        //     }))
        // })
        // const confirmSubmitButton = screen.getByText(/Submit/)
        // act(() => {
        //     confirmSubmitButton.dispatchEvent(new MouseEvent("click",{
        //         bubbles:true
        //     }))
        // })

        // expect(mutationUtils.submitTask).toHaveBeenCalled();

    }
    )
})