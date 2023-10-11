import { QUERY_ME } from "./queries";
import {
  USER,
  ADD_EDU,
  ADD_EXP,
  ADD_JOB,
  ADD_LINK,
  ADD_RESUME,
  DELETE_EDU,
  DELETE_EXP,
  DELETE_LINK,
  EDIT_JOB,
} from "./mutations";

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
  me: (cache, addJob, virtuals) => {
    try {
      const queryData = cache.readQuery({ query: QUERY_ME });
      const me = queryData?.me;

      if (me) {
        const updatedJobs = [addJob, ...me.jobs];
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
  // job: () => {},
};

// returns graphql schemas for useMutation hook on document-level forms
export const docMutation = (doc, type) => {
  switch (doc) {
    case "job":
      return type === "add" ? ADD_JOB : EDIT_JOB;
    case "resume":
      return type === "add" ? ADD_RESUME : console.log(`use ${type}_${doc}`);
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
      return type === "add" ? ADD_EDU : DELETE_EDU;
    case "Experience":
      return type === "add" ? ADD_EXP : DELETE_EXP;
    case "Link":
      return type === "add" ? ADD_LINK : DELETE_LINK;
    default:
      return console.error("invalid mutation");
  }
};
