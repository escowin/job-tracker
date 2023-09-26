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
    rate: String
    jobs: [Job]
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

  type Query {
    me: User
    users: [User]
    user(username: String!): User
    jobs: [Job]
    job(_id: ID!): Job
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
    deleteJob(_id: String!): Job
    addNote(jobId: ID!, note: String!, interview: Boolean): Job
    deleteNote(_id: String!, jobId: String!): Note
    updatePendingJobs: Int
  }

  type Auth {
    token: ID!
    user: User
  }
`;

module.exports = typeDefs;
