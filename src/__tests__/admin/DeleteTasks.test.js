
import { render, screen } from "@testing-library/react";
import DeleteTasks from "../../admin/DeleteTasks";
import * as queryUtils from "../../utils/queryUtils";
import { act } from "react-dom/test-utils";


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

    var questionOne = {
        id: "1",
        text: "Question One",
        tasks: {
            items: tasksQuestionOne
        },
        createdAt: "This is a test date"
    }

    var questionTwo = {
        id: "2",
        text: "Question Two",
        tasks: {
            items: tasksQuestionTwo
        },
        createdAt: "This is a test date"
    }


    jest.spyOn(queryUtils, "fetchQuestions").mockReturnValue(
        Promise.resolve(
            [
                questionOne,
                questionTwo
            ]
        )


    )


    jest.resetModules()

    process.env.REACT_APP_NUMBER_CURATORS = 2
})

afterAll(() => {
    process.env = OLD_ENV
})


describe("home page tests", () => {
    it("successfully renders delete tasks page", async () => {
        await act(() => {
            render(

                <DeleteTasks />
            )
        })

        const deleteTasksHeading = screen.getByText(/Please choose a annotation question to delete/);

        expect(deleteTasksHeading).toBeInTheDocument();

    })

    it("successfully displays all questions", async () => {
        await act(() => {
            render(

                <DeleteTasks />
            )
        })

        const questionTwoText = screen.getByText(/Question Two/);
        const questionOneText = screen.getByText(/Question One/);

        expect(questionTwoText).toBeInTheDocument();
        expect(questionOneText).toBeInTheDocument();

    })

    it("successfully displays correct number of completed tasks", async () => {
        await act(() => {
            render(

                <DeleteTasks />
            )
        })

        const questionOneCompletedText = screen.getByText("Completed: 3 / 5");
        const questionTwoCompletedText = screen.getByText("Completed: 4 / 4");

        expect(questionOneCompletedText).toBeInTheDocument();
        expect(questionTwoCompletedText).toBeInTheDocument();

    })



})