/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createAnnotationTask = /* GraphQL */ `
  mutation CreateAnnotationTask(
    $input: CreateAnnotationTaskInput!
    $condition: ModelAnnotationTaskConditionInput
  ) {
    createAnnotationTask(input: $input, condition: $condition) {
      id
      document_title
      questionID
      question {
        id
        text
        tasks {
          items {
            id
            document_title
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
export const updateAnnotationTask = /* GraphQL */ `
  mutation UpdateAnnotationTask(
    $input: UpdateAnnotationTaskInput!
    $condition: ModelAnnotationTaskConditionInput
  ) {
    updateAnnotationTask(input: $input, condition: $condition) {
      id
      document_title
      questionID
      question {
        id
        text
        tasks {
          items {
            id
            document_title
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
export const deleteAnnotationTask = /* GraphQL */ `
  mutation DeleteAnnotationTask(
    $input: DeleteAnnotationTaskInput!
    $condition: ModelAnnotationTaskConditionInput
  ) {
    deleteAnnotationTask(input: $input, condition: $condition) {
      id
      document_title
      questionID
      question {
        id
        text
        tasks {
          items {
            id
            document_title
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
export const createAnnotationResult = /* GraphQL */ `
  mutation CreateAnnotationResult(
    $input: CreateAnnotationResultInput!
    $condition: ModelAnnotationResultConditionInput
  ) {
    createAnnotationResult(input: $input, condition: $condition) {
      id
      owner
      document_title
      questionID
      question {
        id
        text
        tasks {
          items {
            id
            document_title
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
      createdAt
      updatedAt
    }
  }
`;
export const updateAnnotationResult = /* GraphQL */ `
  mutation UpdateAnnotationResult(
    $input: UpdateAnnotationResultInput!
    $condition: ModelAnnotationResultConditionInput
  ) {
    updateAnnotationResult(input: $input, condition: $condition) {
      id
      owner
      document_title
      questionID
      question {
        id
        text
        tasks {
          items {
            id
            document_title
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
      createdAt
      updatedAt
    }
  }
`;
export const deleteAnnotationResult = /* GraphQL */ `
  mutation DeleteAnnotationResult(
    $input: DeleteAnnotationResultInput!
    $condition: ModelAnnotationResultConditionInput
  ) {
    deleteAnnotationResult(input: $input, condition: $condition) {
      id
      owner
      document_title
      questionID
      question {
        id
        text
        tasks {
          items {
            id
            document_title
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
      createdAt
      updatedAt
    }
  }
`;
export const createQuestionForm = /* GraphQL */ `
  mutation CreateQuestionForm(
    $input: CreateQuestionFormInput!
    $condition: ModelQuestionFormConditionInput
  ) {
    createQuestionForm(input: $input, condition: $condition) {
      id
      form_description
      questions
      createdAt
      updatedAt
    }
  }
`;
export const updateQuestionForm = /* GraphQL */ `
  mutation UpdateQuestionForm(
    $input: UpdateQuestionFormInput!
    $condition: ModelQuestionFormConditionInput
  ) {
    updateQuestionForm(input: $input, condition: $condition) {
      id
      form_description
      questions
      createdAt
      updatedAt
    }
  }
`;
export const deleteQuestionForm = /* GraphQL */ `
  mutation DeleteQuestionForm(
    $input: DeleteQuestionFormInput!
    $condition: ModelQuestionFormConditionInput
  ) {
    deleteQuestionForm(input: $input, condition: $condition) {
      id
      form_description
      questions
      createdAt
      updatedAt
    }
  }
`;
export const createMedicalQuestion = /* GraphQL */ `
  mutation CreateMedicalQuestion(
    $input: CreateMedicalQuestionInput!
    $condition: ModelMedicalQuestionConditionInput
  ) {
    createMedicalQuestion(input: $input, condition: $condition) {
      id
      text
      tasks {
        items {
          id
          document_title
          questionID
          question {
            id
            text
            tasks {
              items {
                id
                document_title
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
export const updateMedicalQuestion = /* GraphQL */ `
  mutation UpdateMedicalQuestion(
    $input: UpdateMedicalQuestionInput!
    $condition: ModelMedicalQuestionConditionInput
  ) {
    updateMedicalQuestion(input: $input, condition: $condition) {
      id
      text
      tasks {
        items {
          id
          document_title
          questionID
          question {
            id
            text
            tasks {
              items {
                id
                document_title
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
export const deleteMedicalQuestion = /* GraphQL */ `
  mutation DeleteMedicalQuestion(
    $input: DeleteMedicalQuestionInput!
    $condition: ModelMedicalQuestionConditionInput
  ) {
    deleteMedicalQuestion(input: $input, condition: $condition) {
      id
      text
      tasks {
        items {
          id
          document_title
          questionID
          question {
            id
            text
            tasks {
              items {
                id
                document_title
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
export const createQuestionSuggestions = /* GraphQL */ `
  mutation CreateQuestionSuggestions(
    $input: CreateQuestionSuggestionsInput!
    $condition: ModelQuestionSuggestionsConditionInput
  ) {
    createQuestionSuggestions(input: $input, condition: $condition) {
      id
      text
      createdAt
      updatedAt
    }
  }
`;
export const updateQuestionSuggestions = /* GraphQL */ `
  mutation UpdateQuestionSuggestions(
    $input: UpdateQuestionSuggestionsInput!
    $condition: ModelQuestionSuggestionsConditionInput
  ) {
    updateQuestionSuggestions(input: $input, condition: $condition) {
      id
      text
      createdAt
      updatedAt
    }
  }
`;
export const deleteQuestionSuggestions = /* GraphQL */ `
  mutation DeleteQuestionSuggestions(
    $input: DeleteQuestionSuggestionsInput!
    $condition: ModelQuestionSuggestionsConditionInput
  ) {
    deleteQuestionSuggestions(input: $input, condition: $condition) {
      id
      text
      createdAt
      updatedAt
    }
  }
`;
