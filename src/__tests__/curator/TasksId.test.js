import { render, screen } from "@testing-library/react";
import TasksId from "../../curator/TasksId";
import * as queryUtils from "../../utils/queryUtils";
import { act } from "react-dom/test-utils";
import * as mutationUtils from "../../utils/mutationUtils";
import { BrowserRouter as Router } from 'react-router-dom';

const OLD_ENV = process.env;


beforeEach(() => {

    const testQuestionsForm = [
        {
            "question_description": "Category 1",
            "question_text": "This is question one",
            "options": ["Option 1", "Option 2", "Option 3"],
            "question_type": "radio"
        },
        {
            "question_description": "Category 2",
            "question_text": "This is question two",
            "options": ["Option 4", "Option 5", "Option 6"],
            "question_type": "radio"
        }
    ]

    const testQuestionForm = {
        id: "123",
        questions: JSON.stringify(testQuestionsForm)
    }

    const testQuestion = {
        id: "321",
        text: "Test question",
        labelDescriptions: JSON.stringify([])
    }


    jest.spyOn(queryUtils, "fetchTask").mockReturnValue(

        Promise.resolve(
            {
                owner: "testid",
                id: "123",
                document_title: "document title",
                completed: false,
                questionID: "234",
                questionFormID: "345",
                question_answers: JSON.stringify({}),
                labels: JSON.stringify([]),
                questionForm: testQuestionForm,
                question: testQuestion
            }
        )
    )

    jest.spyOn(queryUtils, "fetchQuestionForm").mockReturnValue(
        Promise.resolve(
            testQuestion
        )


    )
    jest.spyOn(queryUtils, "fetchQuestion").mockReturnValue(
        Promise.resolve(
            {
                id: "321",
                text: "Test question"
            }

        )


    )
    jest.spyOn(queryUtils, "fetchDocument").mockReturnValue(
        Promise.resolve(
            {
                abstract: "Test abstract",
                title: "Test title",
                mainText: "Test main text"
            }

        )


    )
    jest.spyOn(mutationUtils, "updateTask").mockReturnValue(
        Promise.resolve(
            testQuestion
        )


    )

    jest.resetModules()

    process.env.REACT_APP_NUMBER_CURATORS = 2
})

afterAll(() => {
    process.env = OLD_ENV
})


describe("document functions tests", () => {
    it("successfully renders title section", async () => {
        await act(() => {
            render(
                <Router>
                    <TasksId />
                </Router>)
        })

        const testQuestion = screen.getByText(/Test question/);
        const testDocumentTitle = screen.getByText(/Test title/)

        expect(testQuestion).toBeInTheDocument();
        expect(testDocumentTitle).toBeInTheDocument();

    })

    it("successfully renders annotation document text", async () => {
        await act(() => {
            render(
                <Router>
                    <TasksId />
                </Router>)
        })

        const documentMainText = screen.getByText(/Test main text/);

        expect(documentMainText).toBeInTheDocument();


    })

    it("successfully renders annotation questions", async () => {
        await act(() => {
            render(
                <Router>
                    <TasksId />
                </Router>)
        })

        const questionOne = screen.getByText(/This is question one/);
        const questionOneOption = screen.getByText(/Option 1/)
        const questionTwo = screen.getByText(/This is question two/);
        const questionTwoOption = screen.getByText(/Option 5/)


        expect(questionOne).toBeInTheDocument();
        expect(questionTwo).toBeInTheDocument();
        expect(questionOneOption).toBeInTheDocument();
        expect(questionTwoOption).toBeInTheDocument();


    })

    it("renders error page if task is already completed", async () => {
        const testQuestionsForm = [
            {
                "question_description": "Category 1",
                "question_text": "This is question one",
                "options": ["Option 1", "Option 2", "Option 3"],
                "question_type": "radio"
            },
            {
                "question_description": "Category 2",
                "question_text": "This is question two",
                "options": ["Option 4", "Option 5", "Option 6"],
                "question_type": "radio"
            }
        ]

        const testQuestionForm = {
            id: "123",
            questions: JSON.stringify(testQuestionsForm)
        }

        const testQuestion = {
            id: "321",
            text: "Test question",
            labelDescriptions: JSON.stringify([])
        }


        jest.spyOn(queryUtils, "fetchTask").mockReturnValue(

            Promise.resolve(
                {
                    owner: "testid",
                    id: "123",
                    document_title: "document title",
                    completed: true,
                    questionID: "234",
                    questionFormID: "345",
                    question_answers: JSON.stringify({}),
                    labels: JSON.stringify([]),
                    questionForm: testQuestionForm,
                    question: testQuestion
                }
            )
        )

        await act(() => {
            render(
                <Router>
                    <TasksId />
                </Router>)
        })

        const errorText = screen.getByText(/This task has already been submitted/);

        expect(errorText).toBeInTheDocument();

    })

})