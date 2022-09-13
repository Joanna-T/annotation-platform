import { createReassignedTasks } from "../../utils/reassignTaskUtils";
import * as queryUtils from "../../utils/queryUtils"
import * as mutationUtils from "../../utils/mutationUtils"

const OLD_ENV = process.env

beforeEach(() => {
    jest.spyOn(mutationUtils, "submitTask").mockReturnValue(
        Promise.resolve(true)

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
    process.env.REACT_APP_NUMBER_CURATORS = 2
})

afterAll(() => {
    process.env = OLD_ENV
})


describe("task creation test", () => {
    it("should correctly distribute tasks amongs users", async () => {
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
                documentFileName: "title1",
                owner: "user1",
                completed: false,
                questionFormID: "123",
                questionID: "321"
            },
            {
                documentFileName: "title1",
                owner: "user2",
                completed: true,
                questionFormID: "123",
                questionID: "321"
            }],
            [{
                documentFileName: "title2",
                owner: "user1",
                completed: true,
                questionFormID: "123",
                questionID: "321"
            },
            {
                documentFileName: "title2",
                owner: "user2",
                completed: true,
                questionFormID: "123",
                questionID: "321"
            },
            {
                documentFileName: "title2",
                owner: "user3",
                completed: false,
                questionFormID: "123",
                questionID: "321"
            }]

        ]

        const result = await createReassignedTasks(groupedTasks)

        expect(result).toEqual(
            ""
        )
    })
})

