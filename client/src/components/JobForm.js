import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { ADD_JOB, EDIT_JOB } from "../utils/mutations";
import { QUERY_ME } from "../utils/queries";
import { format } from "../utils/helpers";
import "../assets/css/job-form.css";

function JobForm(props) {
  const jobPath = window.location.pathname.includes("/job");
  const { initialValues, setEditSelected, id, type } = props;
  // defines state & form properties
  const fields = [
    { name: "role", max: 20, type: "input" },
    { name: "company", max: 50, type: "input" },
    {
      name: "status",
      max: 15,
      type: "radio",
      radios: ["pending", "waitlisted", "interviewing", "rejected", "hired"],
      jobPage: true,
    },
    {
      name: "source",
      max: 10,
      type: "radio",
      radios: ["company", "job-board", "job-fair", "referral"],
    },
    { name: "applied", max: 10, type: "date" },
  ];

  // console.log(
  //   jobPath ? fields : fields.filter((field) => field.name !== "status")
  // );

  //   // maps array object key w/ empty string value to define initial form state
  //   const initialState = Object.fromEntries(
  //     fields.map((field) => [field.name, ""])
  //   );
  //   const [formState, setFormState] = useState(initialState);

  //   // updates state object's key-values with corresponding user input
  //   const handleChange = (e) => {
  //     const { name, value } = e.target;
  //     setFormState({ ...formState, [name]: value });
  //   };

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [applied, setApplied] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedSource, setSelectedSource] = useState("");
  const statusValues = ["pending", "waitlisted", "rejected", "hired"];
  const sourceValues = ["company", "job-board", "job-fair", "referral"];

  const formStates = [
    { name: "company", value: company, setState: setCompany },
    { name: "role", value: role, setState: setRole },
    { name: "applied", value: applied, setState: setApplied },
    { name: "status", value: selectedStatus, setState: setSelectedStatus },
    { name: "source", value: selectedSource, setState: setSelectedSource },
  ];

  // const jobPath = window.location.pathname.includes("/job");
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
                waitlistedCount: updatedJobs.filter(
                  (job) => job.status === "waitlisted"
                ).length,
                rejectedCount: updatedJobs.filter(
                  (job) => job.status === "rejected"
                ).length,
                hiredCount: updatedJobs.filter((job) => job.status === "hired")
                  .length,
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
      setApplied(initialValues.applied || format.today());
      setSelectedStatus(initialValues.status || "");
      setSelectedSource(initialValues.source || "");
    } else {
      setSelectedStatus("pending");
      setSelectedSource("job-board");
    }
  }, [initialValues]);

  //  captures & sets form state
  const handleChange = (e) => {
    const newState = formStates.find((state) => state.name === e.target.name);
    newState ? newState.setState(e.target.value) : console.error("error");
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    let variables = {
      company,
      role,
      applied,
      source: selectedSource,
    };

    if (jobPath) {
      variables = {
        ...variables,
        status: selectedStatus,
      };
      console.log(variables);
    }

    try {
      if (jobPath) {
        // resets state to false after mutation
        await editJob({ variables: { id: initialValues._id, ...variables } });
        setEditSelected(false);
      } else {
        console.log(variables);
        // sends the user to homepage after mutation
        await addJob({ variables });
        navigate("/");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // const handleFormSubmit = async (e) => {
  //   e.preventDefault();

  //   if (jobPath) {
  //     let variables = {...formState}
  //     console.log(variables)
  //   }
  // }

  // UI | elements & attributes are conditionally rendered.
  const displayField = (field, i) => {
    switch (field.type) {
      case "radio":
        return !jobPath && field.name === "status" ? null : (
          <fieldset className="wrapper" id={field.name} key={i}>
            <legend>{format.title(field.name)}</legend>
            {field.radios.map((radio, i) => (
              <label key={i} htmlFor={field.name}>
                <input
                  type={field.type}
                  id={field.name}
                  name={field.name}
                  max={field.max}
                />
                {format.id(radio)}
              </label>
            ))}
          </fieldset>
        );
      default:
        return (
          <label key={i} className="wrapper" htmlFor={field.name}>
            {format.title(field.name)}
            <input
              type={field.type}
              id={field.name}
              name={field.name}
              max={field.max}
            />
          </label>
        );
    }
  };

  return (
    <section className={`${type} form-section`} id={id}>
      <form className="job-form" id={id} onSubmit={handleFormSubmit}>
        <h2>{format.title(format.id(id))}</h2>
        {fields.map((field, i) => displayField(field, i))}
        <button className="wrapper" type="submit">
          submit
        </button>
        {error && <span>error</span>}
      </form>
    </section>
  );
}

export default JobForm;
