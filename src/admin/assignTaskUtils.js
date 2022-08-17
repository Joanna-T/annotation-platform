import { Storage } from "aws-amplify";
import { submitTask } from "../mutationUtils";

export async function distributeAnnotationTasks(questionForm, documentFolder, medicalQuestion, curators) {
  let annotationTasks = []
  console.log("distributeAT inputs", questionForm, "folder", documentFolder, "curators", curators, "queaiton", medicalQuestion)
  let documents
  try {
    documents = await Storage.list(documentFolder)


    let filterDocuments = documents.filter(document => document.key[document.key.length - 1] !== "/")
    console.log("filtered documents", filterDocuments)
    let shuffledDocuments = shuffleArray(filterDocuments);
    let shuffledUsers = shuffleArray(curators.slice());
    console.log(shuffledUsers, shuffledDocuments);

    let documentCounter = 0;
    const minimumCuratorNumber = 20;
    //const minimumCuratorNumber = process.env.REACT_APP_NUMBER_CURATORS;

    if (curators.length < minimumCuratorNumber) {
      throw "Insufficient curators to distribute tasks"
    }


    while (documentCounter < shuffledDocuments.length) {
      for (let i = 0; i < minimumCuratorNumber; i++) {
        if (shuffledUsers.length === 0) {
          shuffledUsers = shuffleArray(curators.slice())
          // newShuffledUsers.map(user => shuffledUsers.push(user))
          console.log("This is shuffled us", shuffledUsers)
        }
        let curator = findCurator(shuffledUsers, annotationTasks, shuffledDocuments[documentCounter]);
        let newTask = {
          document_title: shuffledDocuments[documentCounter].key,
          questionID: medicalQuestion.id,
          owner: curator,
          questionFormID: questionForm.id,
          completed: false,
          labels: "[]"
        }
        //await submitTask(newTask, "AMAZON_COGNITO_USER_POOLS")
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