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

export const ADD_JOB_APPLICATION = gql`
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
