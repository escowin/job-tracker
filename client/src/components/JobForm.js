import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { docMutation, format, updateCache } from "../utils/helpers";
import "../assets/css/job-form.css";

function JobForm(props) {
  // rule | graphql schemas are sources of truth
  // consolidate form field variable
  // set form field values by reading graphql schema that corresponds with doc prop
  // graphql mutation is determined by switch case key (doc prop)
  // use bracket notation to dynamically update cache
  console.log(props)

  const { initialValues, setEditSelected, id, className, doc, type } = props;
  const navigate = useNavigate();
  const jobPath = window.location.pathname.includes("/job");
  // defines state & form properties
  const fields = [
    { name: "role", max: 20, type: "input" },
    { name: "company", max: 50, type: "input" },
    {
      name: "status",
      max: 15,
      type: "radio",
      radios: ["pending", "waitlisted", "interviewing", "rejected", "hired"],
    },
    {
      name: "source",
      max: 10,
      type: "radio",
      radios: ["company", "job-board", "job-fair", "referral"],
    },
    { name: "applied", max: 10, type: "date" },
  ];

  // server
  // to-do :
  // - 1 | update virtual counts when status updates
  // - 2 | default `applied` input field value to today when adding a job

  const [job, { error }] = useMutation(docMutation(doc, type), {
    update(cache, { data }) {
      const virtuals = fields.find((item) => item.name === "status").radios;
      updateCache.me(cache, addJob, virtuals);
      console.log(data) // prints addJob or editJob object based on `type` prop used in docMutation()
    },
  });

  // state | maps array object key w/ empty string value to define initial form state
  const initialState = Object.fromEntries(
    fields.map((field) => [field.name, ""])
  );
  const [formState, setFormState] = useState(initialState);

  useEffect(() => {
    if (initialValues) {
      setFormState({
        role: initialValues.role || "",
        company: initialValues.company || "",
        status: initialValues.status || "",
        source: initialValues.source || "",
        applied: initialValues.applied || "",
      });
    } else {
      setFormState((prevState) => ({
        ...prevState,
        status: "pending",
        source: "job-board",
      }));
    }
  }, [initialValues]);

  // updates state object's key-values with corresponding user input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const mutation = {
        ...formState,
        ...(id === "edit-job" ? { id: initialValues._id } : {}),
      };
      await job({ variables: mutation });
      id === "add-job" ? navigate("/") : setEditSelected(false);
    } catch (err) {
      console.error(err);
    }
  };

  // UI | elements & attributes are conditionally rendered.
  const displayField = (field, i) => {
    switch (field.type) {
      case "radio":
        return !jobPath && field.name === "status" ? null : (
          <fieldset className="wrapper" id={field.name} key={i}>
            <legend>{format.title(field.name)}</legend>
            {field.radios.map((radio, j) => (
              <label key={j} htmlFor={radio}>
                <input
                  type={field.type}
                  id={radio}
                  name={field.name}
                  max={field.max}
                  value={radio}
                  checked={formState[field.name] === radio}
                  onChange={handleChange}
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
              value={formState[field.name]}
              onChange={handleChange}
            />
          </label>
        );
    }
  };

  return (
    <section className={`${className} form-section`} id={`${type}-${doc}`}>
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
