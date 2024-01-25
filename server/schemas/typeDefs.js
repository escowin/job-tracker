const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    password: String
    firstName: String
    lastName: String
    email: String
    phone: String
    address: String
    location: String
    zip: Int
    currentCompany: String
    rejectedCount: Int
    noResponseCount: Int
    waitlistedCount: Int
    pendingCount: Int
    hiredCount: Int
    interviewingCount: Int
    totalCount: Int
    rate: String
    jobs: [Job]
    resumes: [Resume]
    letters: [Letter]
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
    createdAt: String
    title: String
    links: [Link]
    education: [Education]
    experience: [Experience]
  }

  type Link {
    _id: ID
    link: String
    url: String
  }

  type Education {
    _id: ID
    school: String
    location: String
  }

  type Experience {
    _id: ID
    role: String
    company: String
    location: String
    description: String
  }

  type Letter {
    _id: ID
    type: String
    text: String
    createdAt: String
  }

  type Query {
    me: User
    users: [User]
    user(username: String!): User
    jobs: [Job]
    job(_id: ID!): Job
    resumes: [Resume]
    resume(_id: ID!): Resume
    letters: [Letter]
    letter(_id: ID!): Letter
  }

  type Mutation {
    login(username: String!, password: String!): Auth
    addUser(username: String!, password: String!): Auth
    editUser(
      _id: ID!
      firstName: String
      lastName: String
      email: String
      phone: String
      address: String
      location: String
      zip: Int
      currentCompany: String
    ): User

    addJob(
      company: String!
      role: String!
      applied: String!
      source: String
    ): Job
    editJob(
      _id: ID!
      company: String
      role: String
      applied: String
      status: String
      source: String
    ): Job
    updatePendingJobs: Int
    deleteJob(_id: ID!): Job

    addNote(jobId: ID!, note: String!, interview: Boolean): Job
    editNote(jobId: ID!, _id: ID!, note: String, interview: Boolean): Job
    deleteNote(jobId: ID!, _id: ID!): Job

    addResume(title: String!): Resume
    editResume(_id: ID!, title: String): Resume
    deleteResume(_id: ID!): Resume

    addLink(resumeId: ID!, link: String!, url: String!): Resume
    editLink(resumeId: ID!, _id: ID!, link: String, url: String): Resume
    deleteLink(resumeId: ID!, _id: ID!): Resume

    addEducation(resumeId: ID!, school: String!, location: String): Resume
    editEducation(resumeId: ID!, _id: ID!, school: String, location: String): Resume
    deleteEducation(resumeId: ID!, _id: ID!): Resume

    addExperience(
      resumeId: ID!
      role: String!
      company: String!
      location: String
      description: String
    ): Resume
    editExperience(resumeId: ID!, _id: ID!, role: String, company: String, location: String, description: String) : Resume
    deleteExperience(resumeId: ID!, _id: ID!): Resume

    addLetter(type: String!, text: String!): Letter
    editLetter(_id: ID!, type: String, text: String): Letter
    deleteLetter(_id: ID!): Letter
  }

  type Auth {
    token: ID!
    user: User
  }
`;

module.exports = typeDefs;
