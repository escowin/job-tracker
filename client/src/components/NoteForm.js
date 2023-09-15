import { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_NOTE } from "../utils/mutations";

function NoteForm({ jobId }) {
  const [note, setNote] = useState("");
  const [interview, setInterview] = useState(false);

  const [addNote, { error }] = useMutation(ADD_NOTE);

  const handleChange = (e) => setNote(e.target.value);
  const handleChecked = (e) => {
    const checked = e.target.checked;
    setInterview(checked);
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      await addNote({
        variables: { jobId, note, interview },
      });
      setNote("");
      setInterview(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="note-form">
      <label>note</label>
      <textarea name="note" value={note} onChange={handleChange} />
      <article id="note-checkbox">
        <label htmlFor="interview">interview</label>
        <input
          type="checkbox"
          name="interview"
          id="interview"
          onClick={handleChecked}
          value={interview}
        />
      </article>
      <button type="submit">submit</button>
      {error && <span>error</span>}
    </form>
  );
}

export default NoteForm;
