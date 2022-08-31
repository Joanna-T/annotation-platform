
import { render, screen } from "@testing-library/react";
import Home from "../../common/Home";
import * as queryUtils from "../../utils/queryUtils";
import { act } from "react-dom/test-utils";
import * as mutationUtils from "../../utils/mutationUtils";

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

    jest.spyOn(mutationUtils, "submitSuggestion").mockReturnValue(
        Promise.resolve(
            {}
        )


    )

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
    it("successfully renders home page", async () => {
        await act(() => {
            render(

                <Home />
            )
        })

        const homePageHeading = screen.getByText(/Welcome to AnnotateIt/);

        expect(homePageHeading).toBeInTheDocument();

    })

    it("successfully displays completed questions", async () => {
        await act(() => {
            render(

                <Home />
            )
        })

        const questionTwoText = screen.getByText(/Question Two/);

        expect(questionTwoText).toBeInTheDocument();

    })

    it("does not display incomplete questions", async () => {
        await act(() => {
            render(

                <Home />
            )
        })

        const questionOneText = screen.queryByText(/Question One/);

        expect(questionOneText).not.toBeInTheDocument();

    })


})