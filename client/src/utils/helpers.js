import { QUERY_ME } from "./queries";
import {
  USER,
  JOB,
  RESUME,
  JOB_ITEMS,
  RESUME_ITEMS,
  LETTER,
} from "./mutations";
import Auth from "./auth";

// Formats client side strings
export const format = {
  today: () => new Date().toISOString().split("T")[0],
  id: (string) => (string ? string.replace(/-/g, " ") : string),
  date: (string) => (string ? string.replace(/-/g, ".") : string),
  title: (string) =>
    string ? string.charAt(0).toUpperCase() + string.slice(1) : string,
  unCamel: (string) =>
    string ? string.replace(/([A-Z])/g, " $1").toLowerCase() : string,
  kebabToCamel: (string) => {
    if (!string) {
      return "";
    }
    // uses regex to capitalize letters preceded by hyphens, then removes the hyphen
    const formattedString = string
      .replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
      .replace(/-/g, "");
    return formattedString;
  },
  camelToKebab: (string) => {
    if (!string) {
      return "";
    }
    // swaps spaces for hyphens before caps, then converts entire string to lowercase
    const formattedString = string
      .replace(/([a-z])([A-Z])/g, "$1-$2")
      .toLowerCase();
    return formattedString;
  },
  // Replaces the first comma in the string with a new line
  newLine: (string) => {
    const regex = /,/;
    const result = regex.test(string)
      ? string.replace(regex, (match) => match.replace(",", "\n"))
      : string;

    return result;
  },
};

// Updates client side cache object to mirror updates in server side database
export const updateCache = {
  me: (cache, mutationData, virtuals, type) => {
    try {
      const queryData = cache.readQuery({ query: QUERY_ME });
      const me = queryData?.me;

      if (me) {
        const updatedJobs =
          type === "add" ? [mutationData, ...me.jobs] : me.jobs;
        cache.writeQuery({
          query: QUERY_ME,
          data: {
            me: {
              ...me,
              jobs: updatedJobs,
              totalCount: updatedJobs.length,
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

//  Client side form objects mirror server side model schema settings
export const form = {
  // Document mutation forms
  login: [
    { name: "username", type: "text", min: 1, max: 25 },
    { name: "password", type: "password", min: 5, max: 25 },
  ],
  job: [
    { name: "role", type: "text", max: 75 },
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
    { name: "address", type: "text", max: 100 },
    { name: "location", type: "text", max: 50 },
    { name: "zip", type: "number", max: 10 },
    { name: "currentCompany", type: "text", max: 50 },
  ],
  letter: [
    { name: "type", type: "radio", radios: ["cover", "rec"], req: true },
    { name: "text", type: "textarea", req: true },
  ],
  // Sub-document mutation forms
  notes: [
    { name: "interview", type: "checkbox" },
    { name: "note", type: "textarea", max: 180 },
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
};

// Algorithmically returns GraphQL document schema object
export const docMutation = (doc, type) => {
  switch (doc) {
    case "job":
      switch (type) {
        case "add":
          return JOB.ADD_JOB;
        case "edit":
          return JOB.EDIT_JOB;
        case "delete":
          return JOB.DELETE_JOB;
        default:
          console.error(`invalid mutation: ${doc}-${type}`);
      }
      break;
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
    case "letter":
      switch (type) {
        case "add":
          return LETTER.ADD_LETTER;
        case "edit":
          return LETTER.EDIT_LETTER;
        case "delete":
          return LETTER.DELETE_LETTER;
        default:
          console.error(`invalid mutation: ${doc}-${type}`);
      }
      break;
    default:
      return console.error("invalid mutation");
  }
};

// Algorithmically returns GraphQL subdocument schema object
export const subDocMutation = (doc, type) => {
  switch (doc) {
    case "education":
      return type === "add" ? RESUME_ITEMS.ADD_EDU : RESUME_ITEMS.DELETE_EDU;
    case "experience":
      return type === "add" ? RESUME_ITEMS.ADD_EXP : RESUME_ITEMS.DELETE_EXP;
    case "link":
    case "links":
      return type === "add" ? RESUME_ITEMS.ADD_LINK : RESUME_ITEMS.DELETE_LINK;
    case "notes":
      return type === "add" ? JOB_ITEMS.ADD_NOTE : JOB_ITEMS.DELETE_NOTE;
    default:
      return console.error("invalid mutation: " + doc);
  }
};

// Algorithmically computes & returns GraphQL mutation response
export const determineMutationResult = (doc, type, data) => {
  const dynamicKey = `${type}${format.title(doc)}`;
  const { [dynamicKey]: result } = data;
  return result;
};

// Carries out conditional action following a succesful mutation from the client side
export const postMutation = (type, navigate, setEditSelected, data) => {
  if (type === "login" || type === "sign-up") {
    type === "login"
      ? Auth.login(data.login.token)
      : Auth.login(data.addUser.token);
  } else {
    type === "add" ? navigate("/") : setEditSelected(false);
  }
};
