const { User, Job, Resume } = require("../models");
const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");
const { calculateTime } = require("../utils/helpers");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (!context.user) {
        throw new AuthenticationError("login required");
      }
      const user = await User.findOne({ _id: context.user._id })
        .select("-__v -password")
        .populate([
          { path: "jobs", options: { sort: { applied: -1 } } },
          { path: "resumes", options: { sort: { applied: -1 } } },
        ]);
      return user;
    },
    users: async () => {
      return User.find().select("-__v -password").populate("job");
    },
    user: async (parent, { username }) => {
      return User.findOne({ username })
        .select("-__v -password")
        .populate("jobs");
    },
    jobs: async () => Job.find().sort({ applied: -1 }),
    job: async (parent, { _id }) => Job.findOne({ _id }),
    resumes: async () => Resume.find().sort({ createdAt: -1 }),
    resume: async (parent, { _id }) => Job.findOne({ _id }),
  },
  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },
    editUser: async (parent, args, context) => {
      if (!context.user) {
        throw new AuthenticationError("login required");
      }
      const { _id, ...updatedFields } = args;
      const user = await User.findByIdAndUpdate(
        _id,
        { $set: updatedFields },
        { new: true }
      );
      if (!user) {
        throw new Error("user not found");
      }
      return user;
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
    addJob: async (parent, args, context) => {
      if (!context.user) {
        throw new AuthenticationError("login required");
      }

      const job = await Job.create({
        ...args,
        username: context.user.username,
      });

      await User.findByIdAndUpdate(
        { _id: context.user._id },
        { $push: { jobs: job._id } },
        { new: true }
      );
      return job;
    },
    editJob: async (parent, args, context) => {
      if (!context.user) {
        throw new AuthenticationError("login required");
      }
      const { _id, ...updatedFields } = args;

      const job = await Job.findByIdAndUpdate(
        _id,
        { $set: updatedFields },
        { new: true }
      );
      if (!job) {
        throw new Error("job not found");
      }

      return job;
    },
    deleteJob: async (parent, args, context) => {
      if (!context.user) {
        throw new AuthenticationError("login required");
      }
      const job = await Job.findByIdAndDelete(args._id);

      await User.findByIdAndUpdate(
        { _id: context.user._id },
        { $pull: { jobs: job._id } },
        { new: true }
      );
      return job;
    },
    addNote: async (parent, { jobId, note, interview }, context) => {
      if (!context.user) {
        throw new AuthenticationError("login required");
      }

      const updatedJob = await Job.findOneAndUpdate(
        { _id: jobId },
        { $push: { notes: { note, interview } } },
        { new: true, runValidators: true }
      );

      return updatedJob;
    },
    deleteNote: async (parent, { _id, jobId }, context) => {
      if (!context.user) {
        throw new AuthenticationError("login required");
      }
      try {
        const updatedJob = await Job.findOneAndUpdate(
          { _id: jobId },
          { $pull: { notes: { _id: _id } } },
          { new: true, runValidators: true }
        );
        return !updatedJob ? new Error("job not found") : updatedJob;
      } catch (err) {
        throw new Error("failed to delete note");
      }
    },
    updatePendingJobs: async (parent, args, context) => {
      if (!context.user) {
        throw new AuthenticationError("login required");
      }

      // finds all 'pending' jobs
      const pendingJobs = await Job.find({ status: "pending" });
      let updatedCount = 0;

      for (const job of pendingJobs) {
        // calculates elapsed time between application date & now
        const elapsed = calculateTime(job.applied, 14);
        if (elapsed) {
          job.status = "no-response";
          await job.save();
          updatedCount++;
        }
      }
      return updatedCount;
    },
    addResume: async (parent, args, context) => {
      if (!context.user) {
        throw AuthenticationError("login required");
      }

      const resume = await Resume.create({
        ...args,
        username: context.user.username,
      });

      await User.findByIdAndUpdate(
        { _id: context.user._id },
        { $push: { resumes: resume._id } },
        { new: true }
      );
      return resume;
    },
    editResume: async (parent, args, context) => {
      if (!context.user) {
        throw AuthenticationError("login required");
      }
      const { _id, ...updatedFields } = args;
      const resume = await Resume.findByIdAndUpdate(
        _id,
        { $set: updatedFields },
        { new: true }
      );
      if (!resume) {
        throw new Error("resume not found");
      }
      return resume;
    },
    addLink: async (parent, { resumeId, link, url }, context) => {
      if (!context.user) {
        throw new AuthenticationError("login required");
      }

      const updatedResume = await Resume.findOneAndUpdate(
        { _id: resumeId },
        { $push: { links: { link, url } } },
        { new: true, runValidators: true }
      );

      return updatedResume;
    },
    deleteLink: async (parent, { _id, resumeId }, context) => {
      if (!context.user) {
        throw new AuthenticationError("login required");
      }
      try {
        const updatedResume = await Resume.findOneAndUpdate(
          { _id: resumeId },
          { $pull: { links: { _id: _id } } },
          { new: true, runValidators: true }
        );
        return !updatedResume ? new Error("resume not found") : updatedResume;
      } catch (err) {
        throw new Error("failed to delete link");
      }
    },
  },
};

module.exports = resolvers;
