import { gql } from "@apollo/client";

export const QUERY_ME = gql`
  {
    me {
      _id
      username
      firstName
      lastName
      email
      phone
      address
      location
      zip
      jobs {
        _id
        company
        role
        status
        source
        applied
        noteCount
      }
      letters {
        _id
        createdAt
        text
        type
      }
      noResponseCount
      rejectedCount
      waitlistedCount
      pendingCount
      interviewingCount
      hiredCount
      rate
      totalCount
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
      address
      location
      zip
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
      role
      company
      status
      source
      interviewCount
      applied
      noteCount
      notes {
        _id
        note
        interview
        createdAt
      }
    }
  }
`;

export const QUERY_LETTER = gql`
  query Letter($id: ID!) {
    letter(_id: $id) {
      _id
      createdAt
      text
      type
    }
  }
`;

export const QUERY_LETTERS = gql`
  query Letter {
    letters {
      _id
      createdAt
      type
      text
    }
  }
`;
