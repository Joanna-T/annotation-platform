import { groupTasksByDocument, findCompletedTasks, createReassignedTasks } from "./documentUtils";
import * as queryUtils from "./queryUtils"

const OLD_ENV = process.env

beforeEach(() => {
    process.env.REACT_APP_NUMBER_CURATORS = 2
})

afterAll(() => {
    process.env = OLD_ENV
})

describe("document functions tests", () => {
    it("should group task array according to document", () => {
        const testTasks = [
            { document_title: "ex1" },
            { document_title: "ex1" },
            { document_title: "ex2" },
            { document_title: "ex2" }
        ]

        const groupedTasks = [
            [{ document_title: "ex1" },
            { document_title: "ex1" }],
            [{ document_title: "ex2" },
            { document_title: "ex2" }]
        ]

        expect(groupTasksByDocument(testTasks)).toEqual(groupedTasks)
    })

    it("should find number of fully completed tasks wihtin task array", () => {

        const groupedTasks = [
            [{
                document_title: "ex1",
                completed: false
            },
            {
                document_title: "ex1",
                completed: true
            }],
            [{
                document_title: "ex2",
                completed: true
            },
            {
                document_title: "ex2",
                completed: true
            }]
        ]

        expect(findCompletedTasks(groupedTasks, 2)).toBe(1)
    })
})

describe("task creation test", () => {
    it("should correctly distribute tasks amongs users", async () => {
        //jest.mock("./queryUtils")
        console.log(" ")
        jest.spyOn(queryUtils, "listCurators").mockReturnValue(
            Promise.resolve(
                [
                    "user1",
                    "user2",
                    "user3",
                    "user4"
                ]
            )

        )
        var groupedTasks = [
            [{
                document_title: "title1",
                owner: "user1",
                completed: false,
                questionFormID: "123",
                questionID: "321"
            },
            {
                document_title: "title1",
                owner: "user2",
                completed: true,
                questionFormID: "123",
                questionID: "321"
            }],
            [{
                document_title: "title2",
                owner: "user1",
                completed: true,
                questionFormID: "123",
                questionID: "321"
            },
            {
                document_title: "title2",
                owner: "user2",
                completed: true,
                questionFormID: "123",
                questionID: "321"
            },
            {
                document_title: "title2",
                owner: "user3",
                completed: false,
                questionFormID: "123",
                questionID: "321"
            }]

        ]

        const result = await createReassignedTasks(groupedTasks)

        expect(result).toEqual(
            [{
                owner: "user3",
                document_title: "title1",
                questionID: "321",
                questionFormID: "123"
            }]
        )
    })
})





