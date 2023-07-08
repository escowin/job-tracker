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
        dateSubmitted
        noteCount
        notes {
          _id
          note
        }
      }
      hiredCount
      rejectedCount
      pendingCount
      totalSubmitted
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
      dateSubmitted
      noteCount
      notes {
        _id
        note
      }
    }
  }
`;
