const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    password: String
  }

  type JobApplication {
    _id: ID
    company: String
    role: String
    dateSubmitted: String
    status: String
  }

  type Query {
    users: [User]
    user(username: String!): User
    jobApplications: [JobApplication]
  }

  type Mutation {
    login(username: String!, password: String!): Auth
    addUser(username: String!, password: String!): Auth
    addApplication(company: String!, role: String!): JobApplication
    editApplication(_id: String!, company: String, role: String, dateSubmitted: String, status: String): JobApplication
    deleteApplication(_id: String!): JobApplication
  }

  type Auth {
    token: ID!
    user: User
  }
`;

module.exports = typeDefs;
