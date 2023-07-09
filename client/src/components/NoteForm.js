import { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_NOTE } from "../utils/mutations";

function NoteForm({ jobId }) {
  const [addNote, { error }] = useMutation(ADD_NOTE)
  const [note, setNote] = useState("");
  const handleChange = (e) => setNote(e.target.value);
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      await addNote({
        variables: { jobId, note },
      });
      setNote('')
    } catch (err) {
      console.error(err)
    }
  };

  return (
    <article>
      <form onSubmit={handleFormSubmit} className="note-form">
        <label>add note</label>
        <input name="note" value={note} onChange={handleChange}></input>
        <button type="submit">submit</button>
      </form>
      {error && <span>error</span>}
    </article>
  );
}

export default NoteForm;
