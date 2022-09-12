import { Storage } from "aws-amplify";
import { submitTask } from "./mutationUtils";
import { fetchDocument } from "./queryUtils";

export async function distributeAnnotationTasks(questionForm, documentFolder, medicalQuestion, curators, chosenDocuments) {
  console.log("distributetasks")
  console.log(chosenDocuments)
  let annotationTasks = []
  //console.log("distributeAT inputs", questionForm, "folder", documentFolder, "curators", curators, "queaiton", medicalQuestion)
  try {

    //change filter documents to chosen files
    // documents = await Storage.list(documentFolder)
    // let filterDocuments = documents.filter(document => document.key[document.key.length - 1] !== "/")
    // let shuffledDocuments = shuffleArray(filterDocuments);

    let shuffledDocuments = shuffleArray(chosenDocuments)


    let shuffledUsers = shuffleArray(curators.slice());
    console.log("distribute tasks", shuffledUsers, shuffledDocuments);

    let documentCounter = 0;

    const minimumCuratorNumber = process.env.REACT_APP_NUMBER_CURATORS;

    if (curators.length < minimumCuratorNumber) {
      throw "Insufficient curators to distribute tasks"
    }


    while (documentCounter < shuffledDocuments.length) {
      for (let i = 0; i < minimumCuratorNumber; i++) {
        if (shuffledUsers.length === 0) {
          shuffledUsers = shuffleArray(curators.slice())
        }

        let pickedDocument = shuffledDocuments[documentCounter]
        let curator = findCurator(shuffledUsers, annotationTasks, pickedDocument);
        let newTask = {
          // document_title: pickedDocument,
          documentFileName: pickedDocument,
          documentTitle: (await fetchDocument(pickedDocument)).title,
          questionID: medicalQuestion.id,
          owner: curator,
          questionFormID: questionForm.id,
          completed: false,
          labels: "[]"
        }
        await submitTask(newTask, "AMAZON_COGNITO_USER_POOLS")
        annotationTasks.push(newTask)

      }
      documentCounter++;
    }
    console.log("These are the annotation tasks", annotationTasks)

  } catch (err) {
    console.log(err)
  }

}

const findCurator = (curators, annotationTasks, document) => {
  let chosenCurator;
  let prevCurators = []
  annotationTasks.map(task => {
    if (task.document_title == document) {
      prevCurators.push(task.owner)
    }
  }
  )

  for (let i = 0; i < curators.length; i++) {
    if (!prevCurators.includes(curators[i])) {
      chosenCurator = curators.splice(i, 1)
      return chosenCurator[0]
    }
  }
  console.log("No more available curators");
}

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array
}


export async function fetchDocumentFolders() {

  let result = await Storage.list("")
  console.log("fetchDocumentFolders", result)

  let files = []
  let folders = []

  result.forEach(res => {
    if (res.size) {
      //files.push(res)
      let possibleFile = res.key.split('/')
      if (possibleFile.length === 2) {
        files.push(res.key)
      }


      let possibleFolder = res.key.split('/').slice(0, -1).join('/')
      if (possibleFolder) folders.push(possibleFolder)
    } else {
      folders.push(res.key)
    }
  })
  console.log("possiblefiles", files)
  console.log("fetcDocumentFolders", folders)
  const filteredFolders = folders.filter(folder => folder.includes("/"))
  console.log("filteredFolders", filteredFolders)

  return [filteredFolders, files]


}

export function isValidURL(string) {
  var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
  return (res !== null)
};