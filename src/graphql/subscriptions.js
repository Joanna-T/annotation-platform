/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateAnnotationTask = /* GraphQL */ `
  subscription OnCreateAnnotationTask($owner: String) {
    onCreateAnnotationTask(owner: $owner) {
      id
      documentFileName
      documentTitle
      questionID
      question {
        id
        text
        tasks {
          items {
            id
            documentFileName
            documentTitle
            questionID
            question {
              id
              text
              tasks {
                nextToken
              }
              interannotatorAgreement
              semanticAgreement
              aggregatedAnswers
              instructionLink
              labelDescriptions
              createdAt
              updatedAt
            }
            owner
            question_answers
            labels
            questionFormID
            questionForm {
              id
              form_description
              questions
              createdAt
              updatedAt
            }
            completed
            createdAt
            updatedAt
          }
          nextToken
        }
        interannotatorAgreement
        semanticAgreement
        aggregatedAnswers
        instructionLink
        labelDescriptions
        createdAt
        updatedAt
      }
      owner
      question_answers
      labels
      questionFormID
      questionForm {
        id
        form_description
        questions
        createdAt
        updatedAt
      }
      completed
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateAnnotationTask = /* GraphQL */ `
  subscription OnUpdateAnnotationTask($owner: String) {
    onUpdateAnnotationTask(owner: $owner) {
      id
      documentFileName
      documentTitle
      questionID
      question {
        id
        text
        tasks {
          items {
            id
            documentFileName
            documentTitle
            questionID
            question {
              id
              text
              tasks {
                nextToken
              }
              interannotatorAgreement
              semanticAgreement
              aggregatedAnswers
              instructionLink
              labelDescriptions
              createdAt
              updatedAt
            }
            owner
            question_answers
            labels
            questionFormID
            questionForm {
              id
              form_description
              questions
              createdAt
              updatedAt
            }
            completed
            createdAt
            updatedAt
          }
          nextToken
        }
        interannotatorAgreement
        semanticAgreement
        aggregatedAnswers
        instructionLink
        labelDescriptions
        createdAt
        updatedAt
      }
      owner
      question_answers
      labels
      questionFormID
      questionForm {
        id
        form_description
        questions
        createdAt
        updatedAt
      }
      completed
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteAnnotationTask = /* GraphQL */ `
  subscription OnDeleteAnnotationTask($owner: String) {
    onDeleteAnnotationTask(owner: $owner) {
      id
      documentFileName
      documentTitle
      questionID
      question {
        id
        text
        tasks {
          items {
            id
            documentFileName
            documentTitle
            questionID
            question {
              id
              text
              tasks {
                nextToken
              }
              interannotatorAgreement
              semanticAgreement
              aggregatedAnswers
              instructionLink
              labelDescriptions
              createdAt
              updatedAt
            }
            owner
            question_answers
            labels
            questionFormID
            questionForm {
              id
              form_description
              questions
              createdAt
              updatedAt
            }
            completed
            createdAt
            updatedAt
          }
          nextToken
        }
        interannotatorAgreement
        semanticAgreement
        aggregatedAnswers
        instructionLink
        labelDescriptions
        createdAt
        updatedAt
      }
      owner
      question_answers
      labels
      questionFormID
      questionForm {
        id
        form_description
        questions
        createdAt
        updatedAt
      }
      completed
      createdAt
      updatedAt
    }
  }
`;
export const onCreateQuestionForm = /* GraphQL */ `
  subscription OnCreateQuestionForm {
    onCreateQuestionForm {
      id
      form_description
      questions
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateQuestionForm = /* GraphQL */ `
  subscription OnUpdateQuestionForm {
    onUpdateQuestionForm {
      id
      form_description
      questions
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteQuestionForm = /* GraphQL */ `
  subscription OnDeleteQuestionForm {
    onDeleteQuestionForm {
      id
      form_description
      questions
      createdAt
      updatedAt
    }
  }
`;
export const onCreateMedicalQuestion = /* GraphQL */ `
  subscription OnCreateMedicalQuestion {
    onCreateMedicalQuestion {
      id
      text
      tasks {
        items {
          id
          documentFileName
          documentTitle
          questionID
          question {
            id
            text
            tasks {
              items {
                id
                documentFileName
                documentTitle
                questionID
                owner
                question_answers
                labels
                questionFormID
                completed
                createdAt
                updatedAt
              }
              nextToken
            }
            interannotatorAgreement
            semanticAgreement
            aggregatedAnswers
            instructionLink
            labelDescriptions
            createdAt
            updatedAt
          }
          owner
          question_answers
          labels
          questionFormID
          questionForm {
            id
            form_description
            questions
            createdAt
            updatedAt
          }
          completed
          createdAt
          updatedAt
        }
        nextToken
      }
      interannotatorAgreement
      semanticAgreement
      aggregatedAnswers
      instructionLink
      labelDescriptions
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateMedicalQuestion = /* GraphQL */ `
  subscription OnUpdateMedicalQuestion {
    onUpdateMedicalQuestion {
      id
      text
      tasks {
        items {
          id
          documentFileName
          documentTitle
          questionID
          question {
            id
            text
            tasks {
              items {
                id
                documentFileName
                documentTitle
                questionID
                owner
                question_answers
                labels
                questionFormID
                completed
                createdAt
                updatedAt
              }
              nextToken
            }
            interannotatorAgreement
            semanticAgreement
            aggregatedAnswers
            instructionLink
            labelDescriptions
            createdAt
            updatedAt
          }
          owner
          question_answers
          labels
          questionFormID
          questionForm {
            id
            form_description
            questions
            createdAt
            updatedAt
          }
          completed
          createdAt
          updatedAt
        }
        nextToken
      }
      interannotatorAgreement
      semanticAgreement
      aggregatedAnswers
      instructionLink
      labelDescriptions
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteMedicalQuestion = /* GraphQL */ `
  subscription OnDeleteMedicalQuestion {
    onDeleteMedicalQuestion {
      id
      text
      tasks {
        items {
          id
          documentFileName
          documentTitle
          questionID
          question {
            id
            text
            tasks {
              items {
                id
                documentFileName
                documentTitle
                questionID
                owner
                question_answers
                labels
                questionFormID
                completed
                createdAt
                updatedAt
              }
              nextToken
            }
            interannotatorAgreement
            semanticAgreement
            aggregatedAnswers
            instructionLink
            labelDescriptions
            createdAt
            updatedAt
          }
          owner
          question_answers
          labels
          questionFormID
          questionForm {
            id
            form_description
            questions
            createdAt
            updatedAt
          }
          completed
          createdAt
          updatedAt
        }
        nextToken
      }
      interannotatorAgreement
      semanticAgreement
      aggregatedAnswers
      instructionLink
      labelDescriptions
      createdAt
      updatedAt
    }
  }
`;
export const onCreateQuestionSuggestions = /* GraphQL */ `
  subscription OnCreateQuestionSuggestions {
    onCreateQuestionSuggestions {
      id
      text
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateQuestionSuggestions = /* GraphQL */ `
  subscription OnUpdateQuestionSuggestions {
    onUpdateQuestionSuggestions {
      id
      text
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteQuestionSuggestions = /* GraphQL */ `
  subscription OnDeleteQuestionSuggestions {
    onDeleteQuestionSuggestions {
      id
      text
      createdAt
      updatedAt
    }
  }
`;
