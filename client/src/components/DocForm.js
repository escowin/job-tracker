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

function DocForm(props) {
  const { initialValues, setEditSelected, doc, type, className } = props;
  // retrieves form fields dynamically based on the sub-document via bracket notation
  const fields = form[doc];

  // job-specific variables
  const navigate = useNavigate();
  const jobPath = window.location.pathname.includes("/job");

  // dynamically sets up server graphql mutation & error handling
  const [document, { error }] = useMutation(docMutation(doc, type),
    {
      update(cache, { data }) {
        const mutationResult = determineMutationResult(doc, type, data);
        if (doc === "job") {
        const virtuals = fields.find((item) => item.name === "status").radios;
        return updateCache.me(cache, mutationResult, virtuals);        
        } else {
          return updateCache.me(cache, mutationResult)
        }

      },
    }
  );

  // sets up form state management
  const [formState, setFormState] = useState({});

  // populates form state with profile data when component mounts
  useEffect(() => {
    // filters 'profile' object based on the 'details' array
    const docFields = {};
    fields.forEach((field) => {
      if (field.type === "date") {
        const today = new Date().toISOString().split("T")[0];
        docFields[field.name] = initialValues[field.name] || today;
      } else if (field.name === "source") {
        docFields[field.name] = initialValues[field.name] || "company";
      } else {
        docFields[field.name] = initialValues[field.name] || "";
      }
    });
    // sets the filtered 'profile' object as the initial 'formState'
    setFormState(docFields);
  }, [initialValues, fields]);

  // handles changes in input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  // handles form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const mutation = {
        ...formState,
        ...(type === "edit" ? { id: initialValues._id } : {}),
      };

      // sends data from client to server
      await document({ variables: mutation });
      `${type}-${doc}` === "add-job" ? navigate("/") : setEditSelected(false);
    } catch (err) {
      console.error(err);
    }
  };

  const displayField = (field, i) => {
    switch (field.type) {
      case "radio":
        return !jobPath && field.name === "status" ? null : (
          <fieldset className="wrapper" id={field.name} key={i}>
            <legend>{format.title(field.name)}</legend>
            {field.radios.map((radio, j) => (
              <label
                key={j}
                htmlFor={radio === "company" ? `${radio}-r` : radio}
              >
                <input
                  type={field.type}
                  id={radio === "company" ? `${radio}-r` : radio}
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
              minLength={field.min ? field.min : null}
              maxLength={field.max ? field.max : null}
              required={field.req ? field.req : null}
              value={formState[field.name] || ""}
              onChange={handleChange}
              autoComplete="off"
            />
          </label>
        );
    }
  };

  // renders appropriate UI elements and attributes based on the formFields array
  return (
    <section className={`${className} form-section`} id={`${type}-${doc}-section`}>
      <form
        className={`${doc}-form`}
        id={`${type}-${doc}`}
        onSubmit={handleFormSubmit}
      >
        <h2>form</h2>
        {fields.map((field, i) => displayField(field, i))}
        <button className="wrapper" type="submit">
          save
        </button>
        {error && <span>error</span>}
      </form>
    </section>
  );
}

export default DocForm;
