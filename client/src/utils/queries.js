import { gql } from "@apollo/client";

export const QUERY_ME = gql`
  {
    me {
      username
      jobApplications {
        _id
        company
        role
        status
        dateSubmitted
      }
      hiredCount
      rejectedCount
      pendingCount
      totalSubmitted
    }
  }
`;

export const QUERY_JOB = gql`
  query JobApplication($id: ID!) {
    jobApplication(_id: $id) {
      _id
      company
      role
      status
      dateSubmitted
    }
  }
`;
