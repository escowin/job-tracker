import { useMutation } from "@apollo/client";
import { ADD_LINK, ADD_EDU, ADD_EXP } from "../utils/mutations";

function ResumeForm({ fields, setAddItem }) {
  // defines array from `fields` prop, excluding keys that start with '_'
  const formFields = Object.keys(fields).filter(
    (field) => !field.startsWith("_")
  );

  console.log(fields.__typename);

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

  console.log(determineMutation(fields.__typename));

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log("form submit");
  };

  // form elements dynamically scale based on the composition of `formFields` array
  return (
    <form className="resume-form-item" onSubmit={handleFormSubmit}>
      {formFields.map((field, i) => (
        <label key={i} htmlFor={field}>
          {field}
          <input type="text" name={field} id={field} />
        </label>
      ))}
      <button type="submit">submit</button>
      <button type="button" onClick={() => setAddItem(null)}>
        cancel
      </button>
    </form>
  );
}

export default ResumeForm;
