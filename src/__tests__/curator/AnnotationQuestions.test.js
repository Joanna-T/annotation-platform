
import { render, screen } from "@testing-library/react";
import AnnotationQuestions from "../../curator/AnnotationQuestions";
import * as queryUtils from "../../utils/queryUtils";
import { act } from "react-dom/test-utils";
import * as assignTaskutils from "../../admin/assignTaskUtils"
import { BrowserRouter as Router } from 'react-router-dom';

const OLD_ENV = process.env;

beforeEach(() => {



    jest.spyOn(assignTaskutils, "fetchDocumentFolders").mockReturnValue(
        Promise.resolve(
            ["/folder1", "/folder2"]
        )


    )

    jest.spyOn(queryUtils, "fetchSuggestions").mockReturnValue(
        Promise.resolve(
            []
        )
    )

    jest.spyOn(queryUtils, "fetchQuestionForms").mockReturnValue(
        Promise.resolve(
            [{
                id: "1",
                form_description: "test form",
                questions: JSON.stringify({ object: "one" })

            }
            ]
        )


    )

    jest.resetModules()

    process.env.REACT_APP_NUMBER_CURATORS = 2
})

afterAll(() => {
    process.env = OLD_ENV
})


describe("annotation question tests", () => {
    it("renders loading text if there is no questions", async () => {

        await act(() => {
            render(
                <Router>
                    <AnnotationQuestions questions={null} answers={{}} handleAnswerChange={() => 0} />
                </Router>)
        })

        const questionOneText = screen.getByText(/Loading questions.../);

        expect(questionOneText).toBeInTheDocument();


    })

    it("successfully renders question titles", async () => {
        const testQuestions = [
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

        await act(() => {
            render(
                <Router>
                    <AnnotationQuestions questions={testQuestions} answers={{}} handleAnswerChange={() => 0} />
                </Router>)
        })

        const questionOneText = screen.getByText(/This is question one/);
        const questionTwoText = screen.getByText(/This is question two/);

        expect(questionOneText).toBeInTheDocument();
        expect(questionTwoText).toBeInTheDocument();

    })


})