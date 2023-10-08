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

export const EDIT_USER = gql`
  mutation EditUser(
    $id: ID!
    $firstName: String
    $lastName: String
    $email: String
    $phone: String
    $location: String
    $currentCompany: String
  ) {
    editUser(
      _id: $id
      firstName: $firstName
      lastName: $lastName
      email: $email
      phone: $phone
      location: $location
      currentCompany: $currentCompany
    ) {
      _id
      firstName
      lastName
      email
      phone
      location
      currentCompany
    }
  }
`;

export const ADD_JOB = gql`
  mutation addJob(
    $company: String!
    $role: String!
    $applied: String!
    $source: String
  ) {
    addJob(company: $company, role: $role, applied: $applied, source: $source) {
      _id
      company
      role
      status
      source
      applied
      noteCount
    }
  }
`;

export const EDIT_JOB = gql`
  mutation editJob(
    $id: String!
    $company: String
    $role: String
    $status: String
    $applied: String
    $source: String
  ) {
    editJob(
      _id: $id
      company: $company
      role: $role
      status: $status
      applied: $applied
      source: $source
    ) {
      _id
      company
      role
      status
      applied
      source
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
  mutation addNote($jobId: ID!, $note: String!, $interview: Boolean) {
    addNote(jobId: $jobId, note: $note, interview: $interview) {
      _id
      noteCount
      interviewCount
      notes {
        _id
        note
        interview
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

export const UPDATE_PENDING_JOBS = gql`
  mutation Mutation {
    updatePendingJobs
  }
`;
