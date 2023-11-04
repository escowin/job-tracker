// SEQUENCE:
// 1. Import necessary functions and libraries.
// 2. Define the function DocForm with props.
// 3. Extract necessary props from the 'props' object.
// 4. Set the 'fields' variable dynamically based on the 'type' and 'doc'.
// 5. Set up a mutation function using the 'useMutation' hook and handle cache updates.
// 6. Set up state management for form data using 'useState'.
// 7. Populate the form state with data based on 'fields' using 'useEffect'.
// 8. Define functions to handle changes in input fields and form submission.
// 9. Implement a function to display the appropriate UI elements based on the 'field' type.
// 10. Render the UI elements and the form.

// IF-THEN-ELSE:
// - Conditionally check the type to set certain variables and handle mutation differently.

// FOR:
// - Loop over the 'fields' array to display each field in the form.


import { useState } from "react";
import { useMutation } from "@apollo/client";
import { subDocMutation } from "../utils/helpers";
import { form } from "../utils/helpers";

// todo: consolidate `resumeId` & `jobId` prop
function ItemForm(props) {
  const { subDoc, setAddItem, resumeId, jobId } = props
  // Retrieves form fields dynamically based on the sub-document via bracket notation
  const fields = form[subDoc]; // ie. form.links, form.education, etc

  // Dynamically determined GraphQL schema object  & error handling. String is formatted to reduce redundant case values in helper
  const [item, { error }] = useMutation(
    subDocMutation(subDoc.toLowerCase(), "add")
  );

  // Sets up form state management
  const [formState, setFormState] = useState({});

  // Handles changes in input fields
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormState((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));
  };

  // Handles form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Carries out client-server communication
    try {
      // Conditionally sets the object to mirror the GraphQL schema
      if (subDoc === "notes") {
        await item({ variables: { jobId, ...formState } });
      } else {
        await item({ variables: { resumeId, ...formState } });
        setAddItem(false);
      }
    } catch (err) {
      // Error handling
      console.error(err);
    }
  };

  // Conditionally determines composition & attributes of form input element
  const displayInput = (field) => {
    const commonAttributes = {
      id: field.name,
      name: field.name,
      maxLength: field.max ? field.max : null,
      minLength: field.min ? field.min : null,
      required: field.req ? field.req : null,
      onChange: handleChange,
    };

    switch (field.type) {
      case "textarea":
        // Lead with spread operator for stylistic reasons
        return <textarea {...commonAttributes} rows={4}></textarea>;
      default:
        return <input {...commonAttributes} type={field.type} />;
    }
  };

  // Dynamically renders scalable UI form
  return (
    <form className="item-form" onSubmit={handleFormSubmit}>
      {fields.map((field, i) => (
        <label key={i} htmlFor={field.name}>
          {field.name}
          {displayInput(field)}
        </label>
      ))}
      <button type="submit">submit</button>
      <button type="button" className="delete" onClick={() => setAddItem(null)}>
        cancel
      </button>
      {error && <span>error</span>}
    </form>
  );
}

export default ItemForm;
