import { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_LINK, ADD_EDU, ADD_EXP } from "../utils/mutations";

function ResumeForm({ fields, setAddItem, resumeId }) {
  // defines array from `fields` prop, excluding keys that start with '_'
  const formFields = Object.keys(fields).filter(
    (field) => !field.startsWith("_")
  );
  // determines sub document graphql mutation
  const determineMutation = (type) => {
    switch (type) {
      case "Education":
        return ADD_EDU;
      case "Experience":
        return ADD_EXP;
      case "Link":
        return ADD_LINK;
      default:
        return console.error("invalid mutation");
    }
  };
  // server graphql mutations variables
  const [item, { error }] = useMutation(determineMutation(fields.__typename));

  // state variables
  const [formState, setFormState] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    // updates form state with user input
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await item({ variables: { resumeId, ...formState } });
      setAddItem(false);
    } catch (err) {
      console.error(err);
    }
  };

  // form elements dynamically scale based on the composition of `formFields` array. input `type` attribute conditionally set to provide client-side validation
  return (
    <form className="resume-form-item" onSubmit={handleFormSubmit}>
      {formFields.map((field, i) => (
        <label key={i} htmlFor={field}>
          {field}
          <input
            type={field === "url" ? "url" : "text"}
            name={field}
            id={field}
            onChange={handleChange}
          />
        </label>
      ))}
      <button type="submit">submit</button>
      <button type="button" onClick={() => setAddItem(null)}>
        cancel
      </button>
      {error && <span>error</span>}
    </form>
  );
}

export default ResumeForm;
