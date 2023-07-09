import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $password: String!) {
    addUser(username: $username, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_JOB = gql`
  mutation addJob($company: String!, $role: String!, $dateSubmitted: String!) {
    addJob(company: $company, role: $role, dateSubmitted: $dateSubmitted) {
      _id
      company
      role
      status
      dateSubmitted
    }
  }
`;

export const EDIT_JOB = gql`
  mutation editJob(
    $id: String!
    $company: String
    $role: String
    $status: String
    $dateSubmitted: String
  ) {
    editJob(
      _id: $id
      company: $company
      role: $role
      status: $status
      dateSubmitted: $dateSubmitted
    ) {
      _id
      company
      role
      status
      dateSubmitted
    }
  }
`;

export const DELETE_JOB = gql`
  mutation deleteJob($id: String!) {
    deleteJob(_id: $id) {
      _id
    }
  }
`;

export const ADD_NOTE = gql`
  mutation addNote($jobId: ID!, $note: String!) {
    addNote(jobId: $jobId, note: $note) {
      _id
      noteCount
      notes {
        _id
        note
      }
    }
  }
`;

export const DELETE_NOTE = gql`
  mutation deleteNote($id: String!, $jobId: String!) {
    deleteNote(_id: $id, jobId: $jobId) {
      _id
    }
  }
`;
