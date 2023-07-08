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
    jobs: [Job]
  }

  type Job {
    _id: ID
    company: String
    role: String
    status: String
    dateSubmitted: String
    createdAt: String
    noteCount: Int
    notes: [Note]
  }

  type Note {
    _id: ID
    note: String
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
    addJob(company: String!, role: String!, dateSubmitted: String!): Job
    editJob(
      _id: String!
      company: String
      role: String
      dateSubmitted: String
      status: String
    ): Job
    deleteJob(_id: String!): Job
    addNote(jobId: ID!, note: String!): Job
  }

  type Auth {
    token: ID!
    user: User
  }
`;

module.exports = typeDefs;
