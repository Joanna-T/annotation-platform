import { render, screen, waitFor } from "@testing-library/react";
import AssignTasks from "../../admin/AssignTasks";
import * as queryUtils from "../../utils/queryUtils";
import { act } from "react-dom/test-utils";
import * as assignTaskutils from "../../utils/assignTaskUtils"
import { BrowserRouter as Router } from 'react-router-dom';
import * as authUtils from "../../utils/authUtils"
import * as mutationUtils from "../../utils/mutationUtils"

const OLD_ENV = process.env;

beforeEach(() => {
    jest.spyOn(authUtils, "checkIfAdmin").mockReturnValue(
        true
    )

    jest.spyOn(assignTaskutils, "fetchDocumentsAndFolders").mockReturnValue(
        Promise.resolve(
            [["folder1/", "folder2/"],
            ["folder1/text1.txt", "folder2/text2.txt"]]
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
    jest.spyOn(queryUtils, "fetchDocument").mockReturnValue(
        Promise.resolve(
            [{
                title: "This is the title",
                abstract: "This is the abstract",
                mainText: "This is the main text"

            }
            ]
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


    jest.spyOn(mutationUtils, "submitQuestion").mockReturnValue(
        Promise.resolve(
            true
        )


    )

    jest.spyOn(mutationUtils, "submitForm").mockReturnValue(
        Promise.resolve(
            true
        )


    )

    jest.resetModules()

    process.env.REACT_APP_NUMBER_CURATORS = 2
})

afterAll(() => {
    process.env = OLD_ENV
})


describe("document functions tests", () => {
    it("successfully renders interface", async () => {
        await act(() => {
            render(
                <Router>
                    <AssignTasks />
                </Router>)
        })

        const formHeading = screen.getByText(/Please fill in the details below to create a new annotation task./);

        expect(formHeading).toBeInTheDocument();

    })

    it("lists question forms", async () => {
        await act(() => {
            render(
                <Router>
                    <AssignTasks />
                </Router>)
        })

        const questionOneText = screen.queryByText(/test form/)


        expect(questionOneText).toBeInTheDocument();

    })

    it("displays document folders", async () => {
        await act(() => {
            render(
                <Router>
                    <AssignTasks />
                </Router>)
        })



        const folderOne = screen.queryByText(/folder1/)
        const folderTwo = screen.queryByText(/folder2/)

        expect(folderOne).toBeInTheDocument();
        expect(folderTwo).toBeInTheDocument();

    })


})