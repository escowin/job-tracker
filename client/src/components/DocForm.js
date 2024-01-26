// SEQUENCE:
// 1. Import necessary functions and libraries.
// 2. Define the function DocForm with props.
// 3. Extract necessary props from the 'props' object.
// 4. Set the 'fields' variable dynamically based on the 'type' and 'doc'.
// 5. Set up a mutation function using the 'useMutation' hook and handle cache updates.
// 6. Initialize variables for specific cases, such as 'navigate' and 'jobPath'.
// 7. Set up state management for form data using 'useState'.
// 8. Populate the form state with data based on 'initialValues' and 'fields' using 'useEffect'.
// 9. Define functions to handle changes in input fields and form submission.
// 10. Implement a function to display the appropriate UI elements based on the 'field' type.
// 11. Render the UI elements and the form.

// IF-THEN-ELSE:
// - Conditionally check the type to set certain variables and handle mutation differently.

// FOR:
// - Loop over the 'fields' array to display each field in the form.

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import {
  determineMutationResult,
  docMutation,
  form,
  format,
  updateCache,
  postMutation,
} from "../utils/helpers";
import "../assets/css/job-form.css";

function DocForm(props) {
  // console.log(props);
  const { initialValues, setEditSelected, doc, type, className } = props;
  // Conditionally handling to account for unique mutations
  const fields =
    type === "login" || type === "sign-up" ? form.login : form[doc];

  // console.log(fields);
  // Server-related variables
  // - Variable is a dynamically defined GraphQL schema object
  const [document, { error }] = useMutation(docMutation(doc, type), {
    // Updates client-side cache to reflect changes to server side data
    update(cache, { data }) {
      const mutationResult = determineMutationResult(doc, type, data);
      if (doc === "job") {
        const virtuals = fields.find((item) => item.name === "status").radios;
        return updateCache.me(cache, mutationResult, virtuals, type);
      } else {
        return updateCache.me(cache, mutationResult);
      }
    },
  });

  // Job-specific variables
  // - Used to send mobile-users back to the main page after adding a job
  const navigate = useNavigate();
  // -
  const jobPath = window.location.pathname.includes("/job");

  // sets up form state management
  const [formState, setFormState] = useState({});
  console.log(formState)

  // populates form state with profile data when component mounts
  useEffect(() => {
    // filters 'profile' object based on the 'details' array
    const docFields = {};
    fields.forEach((field) => {
      if (field.type === "date") {
        const today = new Date()
          .toLocaleDateString("en-CA", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })
          .split("/")
          .join("/");
        docFields[field.name] = initialValues[field.name] || today;
      } else if (field.name === "source") {
        docFields[field.name] = initialValues[field.name] || "company";
      } else if (field.name === "username" || field.name === "password") {
        docFields[field.name] = "";
      } else {
        docFields[field.name] = initialValues[field.name] || "";
      }
    });
    // Sets the filtered 'profile' object as the initial 'formState'
    setFormState(docFields);
  }, [initialValues, fields]);

  // Handles changes in input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  // Handles form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Carries out client-server communication
    try {
      // User details form checks & parses string to num type to allow mutation w/ zip to go through
      if (formState.zip) {
        formState.zip = parseInt(formState.zip)
      }

      // Sets the object to mirror the GraphQL schema
      const mutation = {
        ...formState,
        ...(type === "edit" ? { id: initialValues._id } : {}),
      };

      // Conditionally determines mutation sequence
      if (type === "login" || type === "sign-up") {
        const { data } = await document({ variables: mutation });
        postMutation(type, navigate, setEditSelected, data);
      } else {
        await document({ variables: mutation });
        postMutation(type, navigate, setEditSelected);
      }
    } catch (err) {
      // Error handling
      console.error(err);
    }
  };

  // Conditionally determines attributes of form element
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
      case "textarea":
        return (
          <label key={i} className="wrapper" htmlFor={field.name}>
            <textarea
             id={field.name}
             name={field.name}
             minLength={field.min ? field.min : null}
             maxLength={field.max ? field.max : null}
             required={field.req ? field.req : null}
             value={formState[field.name] || ""}
             onChange={handleChange}
             autoComplete="off"
             ></textarea>
          </label>
        );
      default:
        return (
          <label key={i} className="wrapper" htmlFor={field.name}>
            {format.title(format.unCamel(field.name))}
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

  // Dynamically renders scalable UI elements & attributes
  return (
    <section
      className={`${className} form-section`}
      id={`${type}-${doc}-section`}
    >
      <form
        className={`${doc}-form`}
        id={`${type}-${doc}`}
        onSubmit={handleFormSubmit}
      >
        <h2>{format.title(format.id(type))}</h2>
        {fields.map((field, i) => displayField(field, i))}
        <button className="wrapper" type="submit">
          {type !== "login" && type !== "sign-up" ? "save" : "submit"}
        </button>
        {error && <span>{format.title(type)} failed</span>}
      </form>
    </section>
  );
}

export default DocForm;
