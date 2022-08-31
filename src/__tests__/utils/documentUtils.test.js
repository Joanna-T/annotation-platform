import { groupTasksByDocument, findCompletedTasks, createReassignedTasks, parseDocumentContents } from "../../utils/documentUtils";
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
            ""
        )
    })
})


describe("task creation test", () => {
    it("should correctly distribute tasks amongs users", async () => {
        const teststring = `# URL to online version

https://www.ncbi.nlm.nih.gov/pubmed/32426653/
https://doi.org/10.5811/cpcem.2020.4.47524


# Title

Early Multi-organ Point-of-Care Ultrasound Evaluation of Respiratory Distress During SARS-CoV-2 Outbreak: Case Report


# Abstract

INTRODUCTION: Coronavirus disease 2019 (COVID-19) is caused by the virus known as severe acute respiratory syndrome coronavirus 2 (SARS-CoV-2). Several case series from Italy and China have highlighted the lung ultrasound findings of this disease process and may demonstrate its clinical utility during the current pandemic. CASE REPORT: We present a case of a COVID-19 patient who presented to the emergency department twice within a 24-hour period with rapidly progressing illness. A multi-organ point-of-care ultrasound (POCUS) evaluation was used on the return visit and assisted clinical decision-making. DISCUSSION: A multi-organ POCUS exam allows for quick assessment of acute dyspnea in the emergency department. As the lung involvement of COVID-19 is primarily a peripheral process it is readily identifiable via lung ultrasound. We believe that when applied efficiently and safely a POCUS exam can reduce clinical uncertainty and potentially limit the use of other imaging modalities when treating patients with COVID-19. CONCLUSION: This case highlights the utility of an early multiorgan point-of-care assessment for patients presenting with moderate respiratory distress during the severe SARS-CoV-2 pandemic.


# Main text

Point-of-care ultrasound (POCUS) examinations of patients with acute respiratory distress have been demonstrated to be useful for patients with acute unexplained dyspnea in the emergency department (ED).1 Multiple previous ED studies have demonstrated the ability of clinicians to rapidly and accurately differentiate a cardiac etiology (specifically acute decompensated congestive heart failure) versus other causes of acute dyspnea.1,2 In our early experience during the severe acute respiratory syndrome coronavirus 2 (SARS-CoV-2) outbreak, with multiple patients presenting with acute dyspnea of suspected parenchymal pulmonary pathology, we found that the prompt differentiation between an underlying cardiac versus pulmonary source can be instrumental in both triage and early resuscitation.

`
        let parsedDocument = parseDocumentContents(teststring)


        expect(parsedDocument.title).toBe(
            "Early Multi-organ Point-of-Care Ultrasound Evaluation of Respiratory Distress During SARS-CoV-2 Outbreak: Case Report"
        )
        expect(parsedDocument.abstract).toBe(
            "INTRODUCTION: Coronavirus disease 2019 (COVID-19) is caused by the virus known as severe acute respiratory syndrome coronavirus 2 (SARS-CoV-2). Several case series from Italy and China have highlighted the lung ultrasound findings of this disease process and may demonstrate its clinical utility during the current pandemic. CASE REPORT: We present a case of a COVID-19 patient who presented to the emergency department twice within a 24-hour period with rapidly progressing illness. A multi-organ point-of-care ultrasound (POCUS) evaluation was used on the return visit and assisted clinical decision-making. DISCUSSION: A multi-organ POCUS exam allows for quick assessment of acute dyspnea in the emergency department. As the lung involvement of COVID-19 is primarily a peripheral process it is readily identifiable via lung ultrasound. We believe that when applied efficiently and safely a POCUS exam can reduce clinical uncertainty and potentially limit the use of other imaging modalities when treating patients with COVID-19. CONCLUSION: This case highlights the utility of an early multiorgan point-of-care assessment for patients presenting with moderate respiratory distress during the severe SARS-CoV-2 pandemic."
        )

    })
})





