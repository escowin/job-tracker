import { gql } from "@apollo/client";

// user document
export const USER = {
  ADD_USER: gql`
    mutation addUser($username: String!, $password: String!) {
      addUser(username: $username, password: $password) {
        token
        user {
          _id
          username
        }
      }
    }
  `,

  LOGIN_USER: gql`
    mutation login($username: String!, $password: String!) {
      login(username: $username, password: $password) {
        token
        user {
          _id
          username
        }
      }
    }
  `,

  EDIT_USER: gql`
    mutation EditUser(
      $id: ID!
      $firstName: String
      $lastName: String
      $email: String
      $phone: String
      $address: String
      $location: String
      $zip: Int
      $currentCompany: String
    ) {
      editUser(
        _id: $id
        firstName: $firstName
        lastName: $lastName
        email: $email
        phone: $phone
        address: $address
        location: $location
        zip: $zip
        currentCompany: $currentCompany
      ) {
        _id
        firstName
        lastName
        email
        phone
        address
        location
        zip
        currentCompany
      }
    }
  `,
};

// job document
export const JOB = {
  ADD_JOB: gql`
    mutation addJob(
      $company: String!
      $role: String!
      $applied: String!
      $source: String
    ) {
      addJob(
        company: $company
        role: $role
        applied: $applied
        source: $source
      ) {
        _id
        company
        role
        status
        source
        applied
        noteCount
      }
    }
  `,
  EDIT_JOB: gql`
    mutation editJob(
      $id: ID!
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
        noteCount
      }
    }
  `,
  DELETE_JOB: gql`
    mutation deleteJob($id: ID!) {
      deleteJob(_id: $id) {
        _id
      }
    }
  `,
  UPDATE_PENDING_JOBS: gql`
    mutation Mutation {
      updatePendingJobs
    }
  `,
};

// job sub document
export const JOB_ITEMS = {
  ADD_NOTE: gql`
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
  `,
  DELETE_NOTE: gql`
    mutation deleteNote($id: ID!, $jobId: ID!) {
      deleteNote(_id: $id, jobId: $jobId) {
        _id
      }
    }
  `,
};

// letter document
export const LETTER = {
  ADD_LETTER: gql`
    mutation Mutation($type: String!, $text: String!) {
      addLetter(type: $type, text: $text) {
        _id
        createdAt
        text
        type
      }
    }
  `,
  EDIT_LETTER: gql`
    mutation EditLetter($id: ID!, $type: String, $text: String) {
      editLetter(_id: $id, type: $type, text: $text) {
        _id
        createdAt
        type
        text
      }
    }
  `,
  DELETE_LETTER: gql`
    mutation DeleteLetter($id: ID!) {
      deleteLetter(_id: $id) {
        _id
      }
    }
  `,
};

// resume document
export const RESUME = {
  ADD_RESUME: gql`
    mutation AddResume($title: String!) {
      addResume(title: $title) {
        _id
        createdAt
        title
      }
    }
  `,
  DELETE_RESUME: gql`
    mutation DeleteResume($id: ID!) {
      deleteResume(_id: $id) {
        _id
      }
    }
  `,
};

// resume sub documents
export const RESUME_ITEMS = {
  ADD_EDU: gql`
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
  `,
  ADD_EXP: gql`
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
  `,
  ADD_LINK: gql`
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
  `,
  DELETE_EDU: gql`
    mutation DeleteEducation($id: ID!, $resumeId: ID!) {
      deleteEducation(_id: $id, resumeId: $resumeId) {
        _id
      }
    }
  `,
  DELETE_EXP: gql`
    mutation DeleteExperience($id: ID!, $resumeId: ID!) {
      deleteExperience(_id: $id, resumeId: $resumeId) {
        _id
      }
    }
  `,
  DELETE_LINK: gql`
    mutation DeleteLink($id: ID!, $resumeId: ID!) {
      deleteLink(_id: $id, resumeId: $resumeId) {
        _id
      }
    }
  `,
};
