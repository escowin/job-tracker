import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_NOTE } from "../utils/mutations";

function NoteForm({ jobId }) {
  const navigate = useNavigate();
  const handleGoBack = () => navigate(-1);
  const handleEdit = () => navigate(`/edit-job/${jobId}`);

  const [addNote, { error }] = useMutation(ADD_NOTE);
  const [note, setNote] = useState("");
  const handleChange = (e) => setNote(e.target.value);
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      await addNote({
        variables: { jobId, note },
      });
      setNote("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="form-section">
      <article className="job-buttons">
        <button onClick={handleGoBack}>go back</button>
        <button onClick={handleEdit}>edit</button>
      </article>

      <form onSubmit={handleFormSubmit} className="note-form">
        <label>add note</label>
        <textarea name="note" value={note} onChange={handleChange} />
        <button type="submit">submit</button>
      </form>
      {error && <span>error</span>}
    </section>
  );
}

export default NoteForm;
