const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    password: String
    totalSubmitted: Int
    rejectedCount: Int
    hiredCount: Int
    pendingCount: Int
    waitlistedCount: Int
    noResponseCount: Int
    interviewingCount: Int
    rate: String
    jobs: [Job]
    resumes: [Resume]
  }

  type Job {
    _id: ID
    company: String
    role: String
    status: String
    applied: String
    createdAt: String
    noteCount: Int
    interviewCount: Int
    source: String
    notes: [Note]
  }

  type Note {
    _id: ID
    note: String
    interview: Boolean
    createdAt: String
  }

  type Resume {
    _id: ID
    firstName: String
    lastName: String
    email: String
    phone: String
    location: String
    currentCompany: String
  }

  type Query {
    me: User
    users: [User]
    user(username: String!): User
    jobs: [Job]
    job(_id: ID!): Job
    resumes: [Resume]
    resume(_id: ID!): Resume
  }

  type Mutation {
    login(username: String!, password: String!): Auth
    addUser(username: String!, password: String!): Auth

    addJob(
      company: String!
      role: String!
      applied: String!
      source: String
    ): Job
    editJob(
      _id: String!
      company: String
      role: String
      applied: String
      status: String
      source: String
    ): Job
    updatePendingJobs: Int

    deleteJob(_id: String!): Job
    addNote(jobId: ID!, note: String!, interview: Boolean): Job
    deleteNote(_id: String!, jobId: String!): Note

    addResume(
      firstName: String
      lastName: String
      email: String
      phone: String
      location: String
      currentCompany: String
    ): Resume
  }

  type Auth {
    token: ID!
    user: User
  }
`;

module.exports = typeDefs;
