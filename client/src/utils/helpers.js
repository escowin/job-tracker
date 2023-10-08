import { QUERY_ME } from "./queries";
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
