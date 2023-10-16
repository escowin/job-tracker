import { QUERY_ME } from "./queries";
import { USER, JOB, RESUME, JOB_ITEMS, RESUME_ITEMS } from "./mutations";

export const format = {
  today: () => new Date().toISOString().split("T")[0],
  id: (string) => (string ? string.replace(/-/g, " ") : string),
  date: (string) => (string ? string.replace(/-/g, ".") : string),
  title: (string) =>
    string ? string.charAt(0).toUpperCase() + string.slice(1) : string,
  unCamel: (string) =>
    string ? string.replace(/([A-Z])/g, " $1").toLowerCase() : string,
};

export const updateCache = {
  me: (cache, mutationData, virtuals) => {
    try {
      console.log(mutationData);
      const queryData = cache.readQuery({ query: QUERY_ME });
      const me = queryData?.me;

      if (me) {
        const updatedJobs = [mutationData, ...me.jobs];
        cache.writeQuery({
          query: QUERY_ME,
          data: {
            me: {
              ...me,
              jobs: updatedJobs,
              totalSubmitted: updatedJobs.length,
              rate: me.hiredCount / (updatedJobs.length + 1),
              // iterates through virtuals array to update corresponding cache key-values
              ...virtuals.reduce((counts, virtual) => {
                counts[`${virtual}Count`] = updatedJobs.filter(
                  (job) => job.status === virtual
                ).length;
                return counts;
              }, {}),
            },
          },
        });
      }
    } catch (err) {
      console.error(err);
      console.warn("first job app submitted by user");
    }
  },
};

//  form fields match corresonding mutation schema
export const form = {
  // documents
  login: [
    { name: "username", type: "text", min: 1, max: 25 },
    { name: "password", type: "password", min: 5, max: 25 },
  ],
  job: [
    { name: "role", type: "text", max: 20 },
    { name: "company", type: "text", max: 50 },
    {
      name: "status",
      type: "radio",
      max: 15,
      radios: ["pending", "waitlisted", "interviewing", "rejected", "hired"],
    },
    {
      name: "source",
      type: "radio",
      max: 10,
      radios: ["company", "job-board", "job-fair", "referral"],
    },
    { name: "applied", max: 10, type: "date" },
  ],
  resume: [{ name: "title", type: "text", max: 25, req: true }],
  user: [
    { name: "firstName", type: "text" },
    { name: "lastName", type: "text" },
    { name: "email", type: "email" },
    { name: "phone", type: "tel", min: 5, max: 24 },
    { name: "location", type: "text", ma: 50 },
    { name: "currentCompany", type: "text", ma: 50 },
  ],
  // sub documents
  notes: [
    { name: "note", type: "textarea", max: 180 },
    { name: "interview", type: "checkbox" },
  ],
  education: [
    { name: "school", type: "text", max: 80, req: true },
    { name: "location", type: "text", max: 80 },
  ],
  experience: [
    { name: "role", type: "text", max: 80, req: true },
    { name: "company", type: "text", max: 80, req: true },
    { name: "location", type: "text", max: 80 },
    { name: "description", type: "textarea", max: 500 },
  ],
  links: [
    { name: "link", type: "text", max: 50, req: true },
    { name: "url", type: "url", max: 2048, req: true },
  ],
  // letters: [{}],
};

// returns graphql schemas for useMutation hook on document-level forms
export const docMutation = (doc, type) => {
  switch (doc) {
    case "job":
      return type === "add" ? JOB.ADD_JOB : JOB.EDIT_JOB;
    case "resume":
      return type === "add"
        ? RESUME.ADD_RESUME
        : console.log(`use ${type}_${doc}`);
    case "user":
      switch (type) {
        case "sign-up":
          return USER.ADD_USER;
        case "login":
          return USER.LOGIN_USER;
        case "edit":
          return USER.EDIT_USER;
        default:
          console.log("invalid user mutation");
      }
      break;
    default:
      return console.error("invalid mutation");
  }
};

// temp solution: double cases. change or use helper to format `item._typename` string to cut down on redundancy
export const subDocMutation = (doc, type) => {
  switch (doc) {
    case "education":
    case "Education":
      return type === "add" ? RESUME_ITEMS.ADD_EDU : RESUME_ITEMS.DELETE_EDU;
    case "experience":
    case "Experience":
      return type === "add" ? RESUME_ITEMS.ADD_EXP : RESUME_ITEMS.DELETE_EXP;
    case "links":
    case "Link":
      return type === "add" ? RESUME_ITEMS.ADD_LINK : RESUME_ITEMS.DELETE_LINK;
    case "notes":
    case "Note":
      return type === "add" ? JOB_ITEMS.ADD_NOTE : JOB_ITEMS.DELETE_NOTE;
    default:
      return console.error("invalid mutation: " + doc);
  }
};

// case by doc, set dynamic destructured object
export const determineMutationResult = (doc, type, data) => {
  switch (doc) {
    case "job":
      const { addJob } = data;
      const { editJob } = data;

      return addJob;
    case "user":
      const { editUser } = data;
      return editUser;
    default:
      console.error("invalid type: " + type);
  }
};
