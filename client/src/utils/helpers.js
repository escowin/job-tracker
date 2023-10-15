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
                console.log(updatedJobs);
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
export const forms = {
  // documents
  login: [
    { name: "username", type: "text", min: 1, max: 25 },
    { name: "password", type: "password", min: 5, max: 25 },
  ],
  job: [
    { name: "role", type: "text", max: 20, type: "input" },
    { name: "company", type: "text", max: 50, type: "input" },
    {
      name: "status",
      type: "radio",
      max: 15,
      radios: ["pending", "waitlisted", "interviewing", "rejected", "hired"],
    },
    {
      name: "source",
      max: 10,
      type: "radio",
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
  note: [
    { name: "note", type: "textarea", max: 180 },
    { name: "interview", type: "checkbox" },
  ],
  edu: [
    { name: "school", type: "text", max: 80, req: true },
    { name: "location", type: "text", max: 80 },
  ],
  exp: [
    { name: "role", type: "text", max: 80, req: true },
    { name: "company", type: "text", max: 80, req: true },
    { name: "location", type: "text", max: 80 },
    { name: "description", type: "textarea", max: 500 },
  ],
  link: [
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

export const determineMutation = (doc, type) => {
  switch (doc) {
    case "Education":
      return type === "add" ? RESUME_ITEMS.ADD_EDU : RESUME_ITEMS.DELETE_EDU;
    case "Experience":
      return type === "add" ? RESUME_ITEMS.ADD_EXP : RESUME_ITEMS.DELETE_EXP;
    case "Link":
      return type === "add" ? RESUME_ITEMS.ADD_LINK : RESUME_ITEMS.DELETE_LINK;
    case "Note":
      return type === "add" ? JOB_ITEMS.ADD_NOTE : JOB_ITEMS.DELETE_NOTE;
    default:
      return console.error("invalid mutation");
  }
};

export const determineMutationResult = (type, data) => {
  switch (type) {
    case "add":
      const { addJob } = data;
      return addJob;
    case "edit":
      const { editJob } = data;
      return editJob;
    default:
      console.error("invalid type: " + type);
  }
};
