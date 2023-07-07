import { gql } from "@apollo/client";

export const QUERY_ME = gql`
  {
    me {
      username
      jobApplications {
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

export const QUERY_JOB_APPLICATIONS = gql`
  {
    jobApplications {
      company
      dateSubmitted
      role
      status
    }
  }
`;
