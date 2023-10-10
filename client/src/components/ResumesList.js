import { useState, useEffect } from "react";

function ResumesList({ id, setSelectedResume, profile }) {
  console.log(id);
  const fields = [{ name: "title", min: 1, max: 25 }];
  const initialState = Object.fromEntries(
    fields.map((field) => [field.name, ""])
  );
  const [addResume, setAddResume] = useState(false);
  const [formState, setFormState] = useState("");

  const handleAddItem = () => {
    console.log("add resume");
    setAddResume(true);
  };

  const handleFormSubmit = () => {
    console.log("form submit");
  };

  const handleChange = (e) => {
    console.log("input form");
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
