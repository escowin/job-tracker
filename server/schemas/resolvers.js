const { User, JobApplication } = require("../models");
const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (!context.user) {
        throw new AuthenticationError("you must be logged in");
      }
      const user = await User.findOne({ _id: context.user._id })
        .select("-__v -password")
        .populate("jobApplications");

      return user;
    },
    users: async () => {
      return User.find().select("-__v -password").populate("jobApplications");
    },
    user: async (parent, { username }) => {
      return User.findOne({ username })
        .select("-__v -password")
        .populate("jobApplications");
    },
    jobApplications: async () => JobApplication.find(),
  },
  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },
    login: async (parent, { username, password }) => {
      const user = await User.findOne({ username });
      if (!user) {
        throw new AuthenticationError("incorrect credentials");
      }

      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError("incorrect credentials");
      }

      const token = signToken(user);
      return { token, user };
    },
    addApplication: async (parent, args, context) => {
      if (!context.user) {
        throw new AuthenticationError("you must be logged in");
      }

      const jobApplication = await JobApplication.create({
        ...args,
        username: context.user.username,
      });

      await User.findByIdAndUpdate(
        { _id: context.user._id },
        { $push: { jobApplications: jobApplication._id } },
        { new: true }
      );
      return jobApplication;
    },
    editApplication: async (parents, args, context) => {
      if (!context.user) {
        throw new AuthenticationError("you must be logged in");
      }
      const { _id, ...updatedFields } = args;

      const jobApplication = await JobApplication.findByIdAndUpdate(
        _id,
        { $set: updatedFields },
        { new: true }
      );
      if (!jobApplication) {
        throw new Error("job application not found");
      }
      
      return jobApplication;
    },
    deleteApplication: async (parents, args, context) => {
      if (!context.user) {
        throw new AuthenticationError("you must be logged in");
      }
      const jobApplication = await JobApplication.findByIdAndDelete(args._id);

      await User.findByIdAndUpdate(
        { _id: context.user._id },
        { $pull: { jobApplications: jobApplication._id } },
        { new: true }
      );
      return jobApplication;
    },
  },
};

module.exports = resolvers;
