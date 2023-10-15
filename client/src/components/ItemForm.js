import { useState } from "react";
import { useMutation } from "@apollo/client";
import { subDocMutation } from "../utils/helpers";
import { form } from "../utils/helpers";

// goal: component will handle all sub document add mutations.
// todo: consolidate `resumeId` & `jobId` prop

function ItemForm({ subDoc, setAddItem, resumeId, jobId }) {
  // retrieves form fields dynamically based on the sub-document via bracket notation
  const formFields = form[subDoc]; // ie. form.links, form.education, etc

  // dynamically sets up server graphql mutation & error handling
  const [item, { error }] = useMutation(subDocMutation(subDoc, "add"));

  // sets up form state management
  const [formState, setFormState] = useState({});

  // handles changes in input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // handles form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log(formState);
    try {
      if (subDoc === "notes") {
        await item({ variables: { jobId, ...formState } });
      } else {
        await item({ variables: { resumeId, ...formState } });
        setAddItem(false);
      }
      // sends data from client to server
    } catch (err) {
      console.error(err);
    }
  };

  // renders appropriate UI elements and attributes based on the formFields array
  const displayInput = (field) => {
    switch (field.type) {
      case "textarea":
        return (
          <textarea
            id={field.name}
            name={field.name}
            rows={4}
            maxLength={field.max ? field.max : null}
            onChange={handleChange}
          ></textarea>
        );
      default:
        return (
          <input
            type={field.type}
            name={field.name}
            id={field.name}
            minLength={field.min ? field.min : null}
            maxLength={field.max ? field.max : null}
            required={field.req ? field.req : null}
            onChange={handleChange}
          />
        );
    }
  };

  return (
    <form className="resume-form-item" onSubmit={handleFormSubmit}>
      {formFields.map((field, i) => (
        <label key={i} htmlFor={field.name}>
          {field.name}
          {displayInput(field)}
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

export default ItemForm;
