import { useState } from "react";
import { useMutation } from "@apollo/client";
import { RESUME } from "../utils/mutations";
import { QUERY_PROFILE } from "../utils/queries";

function ResumesList({ id, setSelectedResume, profile }) {
  let deletedResumeid;
  // graphql schema used to send data to server database
  const [resume, { error }] = useMutation(RESUME.ADD_RESUME);
  const [deleteResume] = useMutation(RESUME.DELETE_RESUME, {
    update(cache, { data }) {
      const { me } = cache.readQuery({ query: QUERY_PROFILE });
      const updatedResumes = me.resumes.filter(
        (resume) => resume._id !== deletedResumeid
      );

      cache.writeQuery({
        query: QUERY_PROFILE,
        data: {
          me: {
            ...me,
            resumes: updatedResumes,
          },
        },
      });
    },
  });

  // defines form elements & initial state key-value to match corresponding graphql mutation schema
  const fields = [{ name: "title", min: 1, max: 25 }];
  const initialState = Object.fromEntries(
    fields.map((field) => [field.name, ""])
  );
  // defines component state variables with initial values
  const [addResume, setAddResume] = useState(false);
  const [formState, setFormState] = useState(initialState);

  // ui actions
  // defines state as true to make resume form appear in ui
  const handleAddItem = () => setAddResume(true);
  // deletes specified resume from the server database via graphql object
  // to-do: implement useEffect as a middleman to ensure only double-clicks trigger handleDelete
  const handleDelete = async (_id) => {
    try {
      deletedResumeid = _id;
      await deleteResume({ variables: { id: _id } });
    } catch (err) {
      console.error(err);
    }
  };
  // updates form state key-values with captured user input data
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };
  // submits current form state data to the server database through a graphql mutation
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await resume({ variables: formState });
      setFormState(initialState);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section id="resumes-section">
      <h2>Resumes</h2>
      <button onClick={handleAddItem}>+</button>
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

      <ul id="resumes-list">
        {profile.resumes.map((resume, i) => (
          <li key={i}>
            <button onClick={() => setSelectedResume(resume._id)}>
              {resume.title}
            </button>
            <button className="delete" onClick={() => handleDelete(resume._id)}>delete</button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default ResumesList;
