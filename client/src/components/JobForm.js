import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { ADD_JOB, EDIT_JOB } from "../utils/mutations";
import { QUERY_ME } from "../utils/queries";
import { capitalizeFirstLetter } from "../utils/helpers";

function JobForm({ initialValues, title }) {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [dateSubmitted, setDateSubmitted] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const statusValues = ["pending", "waitlisted", "rejected", "hired"];
  const sourceValues = ["job-board", "job-fair", "referral", "company-site"];
  const editPath = window.location.pathname.includes("/edit-job");
  const navigate = useNavigate();

  const [addJob, { error }] = useMutation(ADD_JOB, {
    update(cache, { data: { addJob } }) {
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
                pendingCount: updatedJobs.filter(
                  (job) => job.status === "pending"
                ).length,
                totalSubmitted: updatedJobs.length,
                rate: me.hiredCount / (updatedJobs.length + 1),
              },
            },
          });
        }
      } catch (err) {
        console.error(err);
        console.warn("first job app submitted by user");
      }
    },
  });

  const [editJob] = useMutation(EDIT_JOB);

  useEffect(() => {
    if (initialValues) {
      setCompany(initialValues.company || "");
      setRole(initialValues.role || "");
      setDateSubmitted(initialValues.dateSubmitted || "");
      setSelectedStatus(initialValues.status || "");
    } else {
      setSelectedStatus("pending");
    }
  }, [initialValues]);

  //  captures & sets form state
  const handleChange = (e) => {
    console.log(e.target)
    if (e.target.name === "company") {
      setCompany(e.target.value);
    } else if (e.target.name === "role") {
      setRole(e.target.value);
    } else if (e.target.name === "date-submitted") {
      setDateSubmitted(e.target.value);
    } else if (e.target.name === "status") {
      setSelectedStatus(e.target.value);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    let variables = {
      company,
      role,
      dateSubmitted,
    };

    if (editPath) {
      variables = {
        ...variables,
        status: selectedStatus,
      };
    }

    try {
      if (editPath) {
        await editJob({
          variables: { id: initialValues._id, ...variables },
        });
      } else {
        await addJob({ variables });
      }
      // redirects user back to home
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="form-section">
      <h2>{capitalizeFirstLetter(title)}</h2>

      <form onSubmit={handleFormSubmit} className="job-form">
        <article className="wrapper">
          <label htmlFor="company">Company</label>
          <input name="company" value={company} onChange={handleChange} />
        </article>
        <article className="wrapper">
          <label htmlFor="role">Role</label>
          <input name="role" value={role} onChange={handleChange} />
        </article>
        <fieldset className="wrapper" id="source">
          <legend>source</legend>
          {sourceValues.map((source, i) => (
            <label htmlFor={source} key={i}>
              <input type="radio" name="source" value={source} onChange={handleChange} />
              {source}
            </label>
          ))}
        </fieldset>
        {editPath ? (
          <fieldset>
            <legend>status</legend>
            {statusValues.map((status, i) => (
              <label htmlFor={status} key={i}>
                <input
                  type="radio"
                  name="status"
                  value={status}
                  checked={status === selectedStatus}
                  onChange={handleChange}
                />
                {status}
              </label>
            ))}
          </fieldset>
        ) : null}
        <article>
          <label htmlFor="date-submitted">Date submitted</label>
          <input
            name="date-submitted"
            type="date"
            value={dateSubmitted}
            onChange={handleChange}
          />
        </article>
        <article className="wrapper">
          <button type="submit">submit</button>
        </article>
        {error && <span>error</span>}
      </form>
    </section>
  );
}

export default JobForm;
