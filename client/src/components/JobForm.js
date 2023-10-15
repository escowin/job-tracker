import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import {
  determineMutationResult,
  docMutation,
  form,
  format,
  updateCache,
} from "../utils/helpers";
import "../assets/css/job-form.css";

// to-do: document-related forms will rely on fields prop
function JobForm(props) {
  // rule | graphql schemas are sources of truth
  // use bracket notation to dynamically update cache

  const { initialValues, setEditSelected, className, doc, type } = props;
  const navigate = useNavigate();
  const jobPath = window.location.pathname.includes("/job");
  // from 
  const fields = form[doc]

  // server
  const [job, { error }] = useMutation(docMutation(doc, type), {
    update(cache, { data }) {
      const mutationResult = determineMutationResult(type, data)
      const virtuals = fields.find((item) => item.name === "status").radios;
      return updateCache.me(cache, mutationResult, virtuals);
    },
  });

  // state | maps array object key w/ empty string value to define initial form state
  const initialState = Object.fromEntries(
    fields.map((field) => [field.name, ""])
  );
  const [formState, setFormState] = useState(initialState);

  useEffect(() => {
    if (initialValues) {
      const today = new Date().toISOString().split("T")[0];
      setFormState({
        role: initialValues.role || "",
        company: initialValues.company || "",
        status: initialValues.status || "",
        source: initialValues.source || "",
        // loads today's date in `add form` date-type input element for better ux
        applied: initialValues.applied || today,
      });
    } else {
      setFormState((prevState) => ({
        ...prevState,
        status: "pending",
        source: "company",
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
        ...(type === "edit" ? { id: initialValues._id } : {}),
      };
      await job({ variables: mutation });
      type === "add" ? navigate("/") : setEditSelected(false);
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
    <section className={`${className} form-section`} id={`${type}-${doc}-section`}>
      <form className="job-form" id={`${type}-${doc}`} onSubmit={handleFormSubmit}>
        <h2>{format.title(type)} {doc}</h2>
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
