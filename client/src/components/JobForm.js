import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { ADD_JOB, EDIT_JOB } from "../utils/mutations";
import { QUERY_ME } from "../utils/queries";

function JobForm({ initialValues }) {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [dateSubmitted, setDateSubmitted] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const statusValues = ["pending", "rejected", "hired"];
  const editPath = window.location.pathname.includes("/edit-job");
  const navigate = useNavigate();

  const [addJobApplication, { error }] = useMutation(ADD_JOB, {
    update(cache, { data: { addJobApplication } }) {
      try {
        const { me } = cache.readQuery({ query: QUERY_ME });
        cache.writeQuery({
          query: QUERY_ME,
          data: {
            me: {
              ...me,
              jobApplications: [...me.jobApplications, addJobApplication],
            },
          },
        });
      } catch (err) {
        console.warn("first job app submitted by user");
      }
    },
  });

  const [editJobApplication] = useMutation(EDIT_JOB);

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
        await editJobApplication({
          variables: { id: initialValues._id, ...variables },
        });
      } else {
        await addJobApplication({ variables });
      }
      // redirects user back to home
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <h2>job application</h2>
      <form onSubmit={handleFormSubmit} className="job-form">
        <article className="wrapper">
          <label htmlFor="company">Company</label>
          <input name="company" value={company} onChange={handleChange} />
        </article>
        <article className="wrapper">
          <label htmlFor="role">Role</label>
          <input name="role" value={role} onChange={handleChange} />
        </article>
        {editPath ? (
          <>
            <fieldset>
              <legend>status</legend>
              {statusValues.map((status, i) => (
                <div key={i}>
                  <input
                    type="radio"
                    name="status"
                    value={status}
                    checked={status === selectedStatus}
                    onChange={handleChange}
                  />
                  <label htmlFor={status}>{status}</label>
                </div>
              ))}
            </fieldset>
          </>
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
    </>
  );
}

export default JobForm;
