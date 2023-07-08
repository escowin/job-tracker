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

export const ADD_JOB = gql`
  mutation addApplication(
    $company: String!
    $role: String!
    $dateSubmitted: String!
  ) {
    addApplication(
      company: $company
      role: $role
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

export const EDIT_JOB = gql`
  mutation editApplication(
    $id: String!
    $company: String
    $role: String
    $status: String
    $dateSubmitted: String
  ) {
    editApplication(
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
