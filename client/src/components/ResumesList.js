import { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_RESUME } from "../utils/mutations";

function ResumesList({ id, setSelectedResume, profile }) {
  // graphql schema used to send data to server database
  const [resume, { error }] = useMutation(ADD_RESUME);
  // defines form elements & initial state key-value to match corresponding graphql mutation schema
  const fields = [{ name: "title", min: 1, max: 25 }];
  const initialState = Object.fromEntries(fields.map((field) => [field.name, ""]));
  // defines component state variables with initial values
  const [addResume, setAddResume] = useState(false);
  const [formState, setFormState] = useState(initialState);

  // ui actions
  // defines state as true to make resume form appear in ui
  const handleAddItem = () => setAddResume(true);
  // updates form state key-values with captured user input data
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };
  // submits current form state data to the server database through a graphql mutation
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("form submit");
      await resume({ variables: formState });
      setFormState(initialState);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section id="resumes-section">
      <h2>
        <button onClick={handleAddItem}>+</button>
        <span>Resumes</span>
      </h2>
      {addResume && (
        <form onSubmit={handleFormSubmit}>
          <h3>Add resume</h3>
          {fields.map((field, i) => (
            <label key={i} htmlFor={field.name}>
              {field.name}
              <input
                name={field.name}
                id={field.name}
                min={field.min}
                max={field.max}
                value={formState[field.name]}
                onChange={handleChange}
              />
            </label>
          ))}
          <button type="submit">save</button>
          <button type="button" onClick={() => setAddResume(null)}>
            cancel
          </button>
          {error && <span>error</span>}
        </form>
      )}

      <article>
        {profile.resumes.map((resume, i) => (
          <button key={i} onClick={() => setSelectedResume(resume._id)}>
            {resume.title}
          </button>
        ))}
      </article>
    </section>
  );
}

export default ResumesList;
