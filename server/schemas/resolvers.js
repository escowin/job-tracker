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
    resume: async (parent, { _id }) => Resume.findOne({ _id }),
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
          job.status = "noResponse";
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
    deleteResume: async (parent, args, context) => {
      if (!context.user) {
        throw new AuthenticationError("login required");
      }
      const resume = await Resume.findByIdAndDelete(args._id);
      await User.findByIdAndUpdate(
        { _id: context.user._id },
        { $pull: { resumes: resume._id } },
        { new: true }
      );
      return resume;
    },
    // resume subdocument mutations
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
    addEducation: async (parent, { resumeId, ...args }, context) => {
      if (!context.user) {
        throw new AuthenticationError("login required");
      }

      const updatedResume = await Resume.findOneAndUpdate(
        { _id: resumeId },
        { $push: { education: args } },
        { new: true, runValidators: true }
      );

      return updatedResume;
    },
    addExperience: async (parent, { resumeId, ...args }, context) => {
      if (!context.user) {
        throw new AuthenticationError("login required");
      }

      const updatedResume = await Resume.findOneAndUpdate(
        { _id: resumeId },
        { $push: { experience: args } },
        { new: true, runValidators: true }
      );

      return updatedResume;
    },
    editExperience: async (parent, args, context) => {
      if (!context.user) {
        throw new AuthenticationError("login required");
      }

      try {
        // const { resumeId, _id, role, company, location, description } = args;
        const { resumeId, _id, ...data } = args;
        // Construct the exp $set object dynamically
        const setObj = {};
        Object.keys(data).forEach((key) => setObj[`experience.$.${key}`] = data[key]);

        // Find the template by ID and update the matching text object
        const result = await Resume.findOneAndUpdate(
          { _id: resumeId, "experience._id": _id },
          {
            $set: setObj
            // $set: {
            //   "experience.$": data,
              // "experience.$.role": role,
              // "experience.$.company": company,
              // "experience.$.location": location,
              // "experience.$.description": description,
            // },
          },
          { new: true, runValidators: true }
        );
        console.log(result);

        return !result ? new Error("resume not found") : result;
      } catch (err) {
        console.error(err);
        throw new Error("failed to edit experience");
      }
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
    deleteEducation: async (parent, { _id, resumeId }, context) => {
      if (!context.user) {
        throw new AuthenticationError("login required");
      }
      try {
        const updatedResume = await Resume.findOneAndUpdate(
          { _id: resumeId },
          { $pull: { education: { _id: _id } } },
          { new: true, runValidators: true }
        );
        return !updatedResume ? new Error("resume not found") : updatedResume;
      } catch (err) {
        throw new Error("failed to delete education");
      }
    },
    deleteExperience: async (parent, { _id, resumeId }, context) => {
      if (!context.user) {
        throw new AuthenticationError("login required");
      }
      try {
        const updatedResume = await Resume.findOneAndUpdate(
          { _id: resumeId },
          { $pull: { experience: { _id: _id } } },
          { new: true, runValidators: true }
        );
        return !updatedResume ? new Error("resume not found") : updatedResume;
      } catch (err) {
        throw new Error("failed to delete experience");
      }
    },
  },
};

module.exports = resolvers;
