import { useState, useEffect } from "react";
import { fetchDocument } from "../utils/queryUtils";
import {
    Segment,
    Button,
    Card,
    Icon,
    Checkbox,
    Modal,
    List
} from "semantic-ui-react";

const DocumentSelection = ({ documents, folders, chosenDocuments, chosenFolders, handleFoldersCheckbox, handleFileCheckbox, removeFile }) => {
    const [folderOpen, setFolderOpen] = useState(null)
    const [documentsOpen, setDocumentsOpen] = useState(false)
    const [documentTextOpen, setDocumentTextOpen] = useState(false)
    const [documentText, setDocumentText] = useState("")
    const [documentTextFile, setDocumentTextFile] = useState("")

    const findFilesForFolder = (folderName) => {
        //console.log("findFilesForFolder", documents)
        const filesForFolder = documents.filter(document => {
            return document.slice(0, folderName.length) == folderName
        })
        //console.log("findFilesForFolder", filesForFolder)
        return filesForFolder
    }
    useEffect(() => {
        //console.log("document selection", folders, chosenDocuments, documents)
    }, [folders])

    async function displayDocumentText(file) {
        let formattedText = await fetchDocument(file)
        let textToDisplay = formattedText["title"] + "\n\n" + formattedText["abstract"] + "\n" + formattedText["mainText"]
        setDocumentText(textToDisplay)
        setDocumentTextOpen(true)
        setDocumentTextFile(file)
    }

    const folderCardStyle = { "marginTop": 5, "marginBottom": 5, "textalign": "left", "padding": "3%" }
    const modalSegmentStyle = { overflow: "auto", maxHeight: '50vh', "whiteSpace": "pre-wrap" }

    return (
        <div>
            <p>
                <Icon name='hand point right' />
                Please select documents to be annotated.
            </p>

            <Modal
                open={documentsOpen}
                onClose={() => setDocumentsOpen(false)}
                onOpen={() => setDocumentsOpen(true)}
                trigger={<Button>
                    {chosenDocuments.length === 0 ? "No documents chosen" : "View chosen documents"}
                </Button>}
            >
                <Modal.Header> The following are all selected documents</Modal.Header>
                <Modal.Content>
                    <Segment maxHeight="50vh">
                        <List divided>
                            {chosenDocuments.length > 0 ?
                                chosenDocuments.map(document => {
                                    return (
                                        <List.Item
                                            key={document}>
                                            <p style={{ display: "inline" }}>{document}</p>
                                            <List.Content floated='right'>

                                                <Button
                                                    size="small"
                                                    color="red"
                                                    onClick={() => { removeFile(document) }}>Remove</Button>
                                            </List.Content>
                                        </List.Item>
                                    )
                                }

                                )
                                :
                                <p>No documents chosen</p>
                            }
                        </List>
                    </Segment>

                </Modal.Content>
                <Modal.Actions>

                    <Button
                        color="red"
                        labelPosition='right'
                        icon
                        onClick={() => setDocumentsOpen(false)}>
                        Back to form
                    </Button>
                </Modal.Actions>

            </Modal>



            <Segment style={{ overflow: "auto", maxHeight: '30vh' }}>



                {
                    folders ? (folders.map((folder, index) => {
                        return (


                            <Modal
                                key={folder}
                                open={folderOpen === folder}
                                onClose={() => setFolderOpen(null)}
                                onOpen={() => setFolderOpen(folder)}
                                trigger={
                                    <Card
                                        key={index}
                                        style={folderCardStyle} fluid>
                                        {folder}
                                    </Card>

                                }
                            >
                                <Modal.Header> Please pick the files to be annotated for folder {folder}</Modal.Header>

                                <Modal.Content >
                                    <Segment basic style={folderCardStyle}>
                                        <Checkbox
                                            label={"Select all"}
                                            checked={chosenFolders.includes(folder)}
                                            onChange={(event, data) => handleFoldersCheckbox(folder, data)} />

                                    </Segment>
                                    <Segment style={modalSegmentStyle}>
                                        {findFilesForFolder(folder).map((file, index) => {
                                            return (
                                                <Segment key={index} style={folderCardStyle}>
                                                    <Checkbox
                                                        label={file}
                                                        checked={chosenDocuments.includes(file)}
                                                        onChange={(event, data) => handleFileCheckbox(file, data)} />
                                                    {"  "}
                                                    <Button onClick={() => displayDocumentText(file)}>
                                                        View document text
                                                    </Button>

                                                </Segment>
                                            )

                                        }

                                        )
                                        }
                                    </Segment>
                                </Modal.Content>
                                <Modal.Actions>

                                    <Button
                                        color="red"
                                        labelPosition='right'
                                        icon='checkmark'
                                        onClick={() => setFolderOpen(null)}>
                                        Back to form
                                    </Button>
                                </Modal.Actions>

                            </Modal>


                        )
                    }))
                        : "No folders available"


                }

                {/* {"modal for showing document text"} */}

                <Modal
                    open={documentTextOpen === true}
                    onClose={() => setDocumentTextOpen(false)}
                    onOpen={() => setDocumentTextOpen(true)}
                >
                    <Modal.Header> {documentTextFile}</Modal.Header>

                    <Modal.Content >
                        <Segment basic style={modalSegmentStyle}>
                            {documentText}

                        </Segment>

                    </Modal.Content>
                    <Modal.Actions>

                        <Button
                            color="red"
                            labelPosition='right'
                            icon='checkmark'
                            onClick={() => setDocumentTextOpen(false)}>
                            Close text window
                        </Button>
                    </Modal.Actions>

                </Modal>

            </Segment>
        </div>
    );
}

export default DocumentSelection;