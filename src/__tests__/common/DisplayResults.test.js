import { render, screen } from "@testing-library/react";
import DisplayResults from "../../common/DisplayResults";
import * as queryUtils from "../../utils/queryUtils";
import { act } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";

const OLD_ENV = process.env;

beforeEach(() => {
    const mockUseLocationValue = {
        state: {
            annotation_tasks:
                [{
                    id: "1",
                    document_title: "title1",
                    labels: JSON.stringify([]),
                    question_answers: JSON.stringify({}),
                    questionID: "1234",
                    questionFormID: "2345"
                },
                {
                    id: "2",
                    document_title: "title2",
                    labels: JSON.stringify([]),
                    question_answers: JSON.stringify({}),
                    questionID: "1234",
                    questionFormID: "2345"
                },],
            grouped_tasks: [
                [{
                    id: "1",
                    document_title: "title1",
                    labels: JSON.stringify([]),
                    question_answers: JSON.stringify({}),
                    questionID: "1234",
                    questionFormID: "2345"
                },
                {
                    id: "2",
                    document_title: "title2",
                    labels: JSON.stringify([]),
                    question_answers: JSON.stringify({}),
                    questionID: "1234",
                    questionFormID: "2345"
                },]
            ]
        }
    }

    jest.mock('react-router-dom', () => ({
        ...jest.requireActual("react-router-dom"),
        useLocation: jest.fn().mockImplementation(() => {
            return mockUseLocationValue;
        })
    }));

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

    jest.spyOn(queryUtils, "fetchQuestionForm").mockReturnValue(
        Promise.resolve(
            testQuestionForm
        )
    )

    const testQuestion = {
        id: "321",
        text: "Test question",
        labelDescriptions: JSON.stringify([]),
        semanticAgreement: JSON.stringify(JSON.stringify({})),
        aggregatedAnswers: JSON.stringify({})
    }


    jest.spyOn(queryUtils, "fetchQuestion").mockReturnValue(
        Promise.resolve(
            testQuestion

        )


    )

    jest.spyOn(queryUtils, "getTaskDocumentTitles").mockReturnValue(
        Promise.resolve(
            { "1": "This is the title" }
        )
    )

    jest.spyOn(queryUtils, "fetchDocument").mockReturnValue(
        Promise.resolve(
            {
                abstract: "This is the abstract",
                mainText: "This is the main text",
                title: "This is the title"

            }

        )


    )

    jest.resetModules()

    process.env.REACT_APP_NUMBER_CURATORS = 2
})

afterAll(() => {
    process.env = OLD_ENV
})


describe("display results tests", () => {
    const mockUseLocationValue = {
        state: {
            annotation_tasks:
                [{
                    id: "1",
                    document_title: "title1",
                    labels: JSON.stringify([]),
                    question_answers: JSON.stringify({}),
                    questionID: "1234",
                    questionFormID: "2345"
                },
                {
                    id: "2",
                    document_title: "title2",
                    labels: JSON.stringify([]),
                    question_answers: JSON.stringify({}),
                    questionID: "1234",
                    questionFormID: "2345"
                },],
            grouped_tasks: [
                [{
                    id: "1",
                    document_title: "title1",
                    labels: JSON.stringify([]),
                    question_answers: JSON.stringify({}),
                    questionID: "1234",
                    questionFormID: "2345"
                },
                {
                    id: "2",
                    document_title: "title2",
                    labels: JSON.stringify([]),
                    question_answers: JSON.stringify({}),
                    questionID: "1234",
                    questionFormID: "2345"
                },]
            ]
        }
    }
    it("successfully renders label section", async () => {

        act(() => {
            render(
                <MemoryRouter initialEntries={[mockUseLocationValue]}>
                    <DisplayResults />
                </MemoryRouter>)
        })

        const labelHeading = screen.getByText(/Toggle document labels./);

        expect(labelHeading).toBeInTheDocument();

    })

    it("displays the annotation document", async () => {

        await act(() => {
            render(
                <MemoryRouter initialEntries={[mockUseLocationValue]}>
                    <DisplayResults />
                </MemoryRouter>)
        })

        const documentTitle = screen.getAllByText(/This is the title/)


        expect(documentTitle[0]).toBeInTheDocument();

    })

    // it("displays the annotation question", async () => {

    //     await act(() => {
    //         render(
    //             <MemoryRouter initialEntries={[mockUseLocationValue]}>
    //                 <DisplayResults />
    //             </MemoryRouter>)
    //     })

    //     //const documentTitle = screen.getAllByText(/This is the title/)


    //     expect(await screen.getByText("Test question")).toBeInTheDocument();

    // })



})