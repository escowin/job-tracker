import { gql } from "@apollo/client";

export const QUERY_ME = gql`
  {
    me {
      username
      jobs {
        _id
        company
        role
        status
        source
        applied
        noteCount
      }
      hiredCount
      rejectedCount
      pendingCount
      waitlistedCount
      noResponseCount
      interviewingCount
      totalSubmitted
      rate
    }
  }
`;

export const QUERY_JOB = gql`
  query Job($id: ID!) {
    job(_id: $id) {
      _id
      company
      role
      status
      source
      applied
      noteCount
      interviewCount
      notes {
        _id
        note
        interview
        createdAt
      }
    }
  }
`;
