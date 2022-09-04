import { useState, useEffect } from "react";
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

    const folderCardStyle = { "marginTop": 5, "marginBottom": 5, "textalign": "left", "padding": "3%" }

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
                                    <Segment style={{ overflow: "auto", maxHeight: '40vh' }}>
                                        {findFilesForFolder(folder).map((file, index) => {
                                            return (
                                                <Segment key={index} style={folderCardStyle}>
                                                    <Checkbox
                                                        label={file}
                                                        checked={chosenDocuments.includes(file)}
                                                        onChange={(event, data) => handleFileCheckbox(file, data)} />

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

            </Segment>
        </div>
    );
}

export default DocumentSelection;