import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { ADD_JOB, EDIT_JOB } from "../utils/mutations";
import { QUERY_ME } from "../utils/queries";
import { format } from "../utils/helpers";
import "../assets/css/job-form.css"

function JobForm({ initialValues, id }) {

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [dateSubmitted, setDateSubmitted] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedSource, setSelectedSource] = useState("")
  const statusValues = ["pending", "waitlisted", "rejected", "hired"];
  const sourceValues = ["company", "job-board", "job-fair", "referral"];

  const formStates = [
    { name: "company", value: company, setState: setCompany },
    { name: "role", value: role, setState: setRole },
    { name: "date-submitted", value: dateSubmitted, setState: setDateSubmitted },
    { name: "status", value: selectedStatus, setState: setSelectedStatus },
    { name: "source", value: selectedSource, setState: setSelectedSource },
  ]
  
  const editPath = id.includes("edit");
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
      setSelectedSource(initialValues.source || "");
    } else {
      setSelectedStatus("pending");
      setSelectedSource("job-board")
    }
  }, [initialValues]);

  //  captures & sets form state
  const handleChange = (e) => {
    const newState = formStates.find(state => state.name === e.target.name)
    newState ? newState.setState(e.target.value) : console.error("error")
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    let variables = {
      company,
      role,
      dateSubmitted,
      source: selectedSource
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
    <section className="job-form-section" id="edit-section">
      <h2>{format.title(format.id(id))}</h2>

      <form onSubmit={handleFormSubmit} className="job-form" id={id}>
        <label className="wrapper" htmlFor="role">Role
          <input name="role" value={role} onChange={handleChange} />
        </label>

        <label className="wrapper" htmlFor="company">Company
          <input name="company" value={company} onChange={handleChange} />
        </label>

        <fieldset className="wrapper" id="source">
          <legend>Source</legend>
          {sourceValues.map((source, i) => (
            <label htmlFor={source} key={i}>
              <input 
                type="radio" 
                name="source" 
                value={source}
                checked={source === selectedSource}
                onChange={handleChange} />
              {format.id(source)}
            </label>
          ))}
        </fieldset>
        {editPath ? (
          <fieldset className="wrapper">
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
        <label className="wrapper" htmlFor="date-submitted">Applied
          <input
            name="date-submitted"
            type="date"
            value={dateSubmitted}
            onChange={handleChange}
          />
        </label>
        <button className="wrapper" type="submit">submit</button>
        {error && <span>error</span>}
      </form>
    </section>
  );
}

export default JobForm;
