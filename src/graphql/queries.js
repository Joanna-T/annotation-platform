/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getAnnotationTask = /* GraphQL */ `
  query GetAnnotationTask($id: ID!) {
    getAnnotationTask(id: $id) {
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
export const listAnnotationTasks = /* GraphQL */ `
  query ListAnnotationTasks(
    $filter: ModelAnnotationTaskFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAnnotationTasks(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
  }
`;
export const tasksByUsername = /* GraphQL */ `
  query TasksByUsername(
    $owner: String!
    $sortDirection: ModelSortDirection
    $filter: ModelAnnotationTaskFilterInput
    $limit: Int
    $nextToken: String
  ) {
    tasksByUsername(
      owner: $owner
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
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
  }
`;
export const getAnnotationResult = /* GraphQL */ `
  query GetAnnotationResult($id: ID!) {
    getAnnotationResult(id: $id) {
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
export const listAnnotationResults = /* GraphQL */ `
  query ListAnnotationResults(
    $filter: ModelAnnotationResultFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAnnotationResults(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
    }
  }
`;
export const getQuestionForm = /* GraphQL */ `
  query GetQuestionForm($id: ID!) {
    getQuestionForm(id: $id) {
      id
      form_description
      questions
      createdAt
      updatedAt
    }
  }
`;
export const listQuestionForms = /* GraphQL */ `
  query ListQuestionForms(
    $filter: ModelQuestionFormFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listQuestionForms(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        form_description
        questions
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getMedicalQuestion = /* GraphQL */ `
  query GetMedicalQuestion($id: ID!) {
    getMedicalQuestion(id: $id) {
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
      createdAt
      updatedAt
    }
  }
`;
export const listMedicalQuestions = /* GraphQL */ `
  query ListMedicalQuestions(
    $filter: ModelMedicalQuestionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMedicalQuestions(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
