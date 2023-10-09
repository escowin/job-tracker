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

export const QUERY_PROFILE = gql`
  {
    me {
      _id
      username
      firstName
      lastName
      email
      phone
      location
      currentCompany
      resumes {
        _id
        title
      }
    }
  }
`;

export const QUERY_RESUME = gql`
  query Resume($id: ID!) {
    resume(_id: $id) {
      _id
      createdAt
      title
      links {
        _id
        link
        url
      }
      education {
        _id
        school
        location
      }
      experience {
        _id
        company
        role
        location
        description
      }
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
