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
    }
  }
`;
