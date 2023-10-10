import { gql } from "@apollo/client";

// user document
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

// job document
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

export const UPDATE_PENDING_JOBS = gql`
  mutation Mutation {
    updatePendingJobs
  }
`;

// job sub document
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

// resume document
export const ADD_RESUME = gql`
  mutation AddResume($title: String!) {
    addResume(title: $title) {
      _id
      createdAt
      title
    }
  }
`;

export const DELETE_RESUME = gql`
  mutation DeleteResume($id: ID!) {
    deleteResume(_id: $id) {
      _id
    }
  }
`;

// resume sub documents
export const ADD_EDU = gql`
  mutation AddEducation($resumeId: ID!, $school: String!, $location: String) {
    addEducation(resumeId: $resumeId, school: $school, location: $location) {
      _id
      education {
        _id
        location
        school
      }
    }
  }
`;

export const ADD_EXP = gql`
  mutation AddExperience(
    $resumeId: ID!
    $role: String!
    $company: String!
    $location: String
    $description: String
  ) {
    addExperience(
      resumeId: $resumeId
      role: $role
      company: $company
      location: $location
      description: $description
    ) {
      _id
      experience {
        _id
        company
        description
        location
        role
      }
    }
  }
`;

export const ADD_LINK = gql`
  mutation AddLink($resumeId: ID!, $link: String!, $url: String!) {
    addLink(resumeId: $resumeId, link: $link, url: $url) {
      _id
      links {
        _id
        link
        url
      }
    }
  }
`;

export const DELETE_EDU = gql`
  mutation DeleteEducation($id: ID!, $resumeId: ID!) {
    deleteEducation(_id: $id, resumeId: $resumeId) {
      _id
    }
  }
`;

export const DELETE_EXP = gql`
  mutation DeleteExperience($id: ID!, $resumeId: ID!) {
    deleteExperience(_id: $id, resumeId: $resumeId) {
      _id
    }
  }
`;

export const DELETE_LINK = gql`
  mutation DeleteLink($id: ID!, $resumeId: ID!) {
    deleteLink(_id: $id, resumeId: $resumeId) {
      _id
    }
  }
`;