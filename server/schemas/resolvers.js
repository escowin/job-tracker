const { User, Job, Resume, Letter } = require("../models");
const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");
const { calculateTime } = require("../utils/helpers");

// Mutation helpers
// Documents
const editDocument = async (_id, args, context, Model) => {
  if (!context.user) {
    throw new AuthenticationError("login required");
  }

  try {
    const result = await Model.findByIdAndUpdate(
      _id,
      { $set: args },
      { new: true }
    );
    return result;
  } catch (err) {
    throw new Error(`edit failed: ${err}`);
  }
};

// Sub-documents
// - Adds a subdocument object into a specified document
const addSubDocument = async (docId, args, context, Model, subDoc) => {
  if (!context.user) {
    throw new AuthenticationError("login required");
  }
  try {
    const result = await Model.findOneAndUpdate(
      { _id: docId },
      { $push: { [subDoc]: args } },
      { new: true, runValidators: true }
    );
    return result;
  } catch (err) {
    throw new Error(`edit failed: ${err}`);
  }
};

// - Updates specified subdocument object in a specified document
const editSubDocument = async (docId, _id, args, context, Model, subDoc) => {
  if (!context.user) {
    throw new AuthenticationError("login required");
  }

  try {
    // Updates specified exp object's key-values of a resume with user data
    const setObject = generateSetObject(subDoc, args);
    const query = { _id: docId };
    query[`${subDoc}._id`] = _id;
    console.log(query);

    const result = await Model.findOneAndUpdate(
      query,
      { $set: setObject },
      { new: true, runValidators: true }
    );

    return result;
  } catch (err) {
    throw new Error(`edit failed: ${err}`);
  }
};

// - Dynamically constructs subdocument $set object for editSubDocument() function
const generateSetObject = (string, data) => {
  const object = {};
  Object.keys(data).forEach(
    (key) => (object[`${string}.$.${key}`] = data[key])
  );
  return object;
};

// - Removes specified subdocument object from a specified document
const deleteSubDocument = async (docId, _id, Model, context, subDoc) => {
  if (!context.user) {
    throw new AuthenticationError("login required");
  }

  try {
    const parentDocument = await Model.findOneAndUpdate(
      { _id: docId },
      { $pull: { [subDoc]: { _id: _id } } },
      { new: true, runValidators: true }
    );

    return parentDocument;
  } catch (err) {
    throw new Error(`failed to delete: ${err}`);
  }
};

// Resolvers
const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (!context.user) {
        throw new AuthenticationError("login required");
      }
      const user = await User.findOne({ _id: context.user._id })
        .select("-__v -password")
        .populate([
          { path: "jobs", options: { sort: { applied: -1, company: 1 } } },
          { path: "resumes", options: { sort: { applied: -1 } } },
          { path: "letters", options: { sort: { type: 1, createdAt: -1 } } },
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
    letters: async () => Letter.find().sort({ type: 1, createdAt: -1 }),
    letter: async (parent, { _id }) => Letter.findOne({ _id }),
  },
  Mutation: {
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
    // Document mutations
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
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },
    addLetter: async (parent, args, context) => {
      if (!context.user) {
        throw new AuthenticationError("login required");
      }

      const letter = await Letter.create({
        ...args,
        username: context.user.username,
      });

      await User.findByIdAndUpdate(
        { _id: context.user._id },
        { $push: { letters: letter._id } },
        { new: true }
      );

      return letter;
    },

    deleteJob: async (parent, { _id }, context) => {
      if (!context.user) {
        throw new AuthenticationError("login required");
      }
      const job = await Job.findByIdAndDelete(_id);

      await User.findByIdAndUpdate(
        { _id: context.user._id },
        { $pull: { jobs: job._id } },
        { new: true }
      );
      return job;
    },
    deleteResume: async (parent, { _id }, context) => {
      if (!context.user) {
        throw new AuthenticationError("login required");
      }
      const resume = await Resume.findByIdAndDelete(_id);

      await User.findByIdAndUpdate(
        { _id: context.user._id },
        { $pull: { resumes: resume._id } },
        { new: true }
      );
      return resume;
    },
    deleteLetter: async (parent, { _id }, context) => {
      if (!context.user) {
        throw new AuthenticationError("login required");
      }
      const letter = await Letter.findByIdAndDelete(_id);

      await User.findByIdAndUpdate(
        { _id: context.user._id },
        { $pull: { letters: letter._id } },
        { new: true }
      );
      return letter;
    },

    editJob: async (parent, { _id, ...args }, context) => {
      return editDocument(_id, args, context, Job);
    },
    editResume: async (parent, { _id, ...args }, context) => {
      return editDocument(_id, args, context, Resume);
    },
    editUser: async (parent, { _id, ...args }, context) => {
      return editDocument(_id, args, context, User);
    },
    editLetter: async (parent, { _id, ...args }, context) => {
      return editDocument(_id, args, context, Letter);
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

    // Subdocument mutations
    addEducation: async (parent, { resumeId, ...args }, context) => {
      return addSubDocument(resumeId, args, context, Resume, "education");
    },
    addExperience: async (parent, { resumeId, ...args }, context) => {
      return addSubDocument(resumeId, args, context, Resume, "experience");
    },
    addLink: async (parent, { resumeId, ...args }, context) => {
      return addSubDocument(resumeId, args, context, Resume, "links");
    },
    addNote: async (parent, { jobId, ...args }, context) => {
      return addSubDocument(jobId, args, context, Job, "notes");
    },

    editEducation: async (parent, { resumeId, _id, ...args }, context) => {
      return editSubDocument(resumeId, _id, args, context, Resume, "education");
    },
    editExperience: async (parent, { resumeId, _id, ...args }, context) => {
      return editSubDocument(
        resumeId,
        _id,
        args,
        context,
        Resume,
        "experience"
      );
    },
    editLink: async (parent, { resumeId, _id, ...args }, context) => {
      return editSubDocument(resumeId, _id, args, context, Resume, "links");
    },
    editNote: async (parent, { jobId, _id, ...args }, context) => {
      return editSubDocument(jobId, _id, args, context, Resume, "notes");
    },

    deleteEducation: async (parent, { _id, resumeId }, context) => {
      return deleteSubDocument(resumeId, _id, Resume, context, "education");
    },
    deleteExperience: async (parent, { _id, resumeId }, context) => {
      return deleteSubDocument(resumeId, _id, Resume, context, "experience");
    },
    deleteLink: async (parent, { _id, resumeId }, context) => {
      return deleteSubDocument(resumeId, _id, Resume, context, "links");
    },
    deleteNote: async (parent, { _id, jobId }, context) => {
      return deleteSubDocument(jobId, _id, Job, context, "notes");
    },
  },
};

module.exports = resolvers;
