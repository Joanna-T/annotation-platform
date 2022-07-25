import { groupTasksByDocument, findCompletedTasks } from "./documentUtils";


describe("document functions tests", () => {
    it("should group task array according to document", () => {
        const testTasks = [
            {document_title: "ex1"},
            {document_title: "ex1"},
            {document_title: "ex2"},
            {document_title: "ex2"}
        ]
    
        const groupedTasks = [
            [{document_title: "ex1"},
            {document_title: "ex1"}],
            [{document_title: "ex2"},
            {document_title: "ex2"}]
        ]
    
        expect(groupTasksByDocument(testTasks)).toEqual(groupedTasks)
    })
    
    it("should find number of fully completed tasks wihtin task array", () => {
    
        const groupedTasks = [
            [{document_title: "ex1",
            completed: false},
            {document_title: "ex1", 
            completed: true}],
            [{document_title: "ex2",
            completed: true},
            {document_title: "ex2",
            completed: true}]
        ]
    
        expect(findCompletedTasks(groupedTasks,2)).toBe(1)
    })
})

