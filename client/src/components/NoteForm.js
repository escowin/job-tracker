import { useState } from "react";

function NoteForm() {
  const [note, setNote] = useState("");
  const handleChange = (e) => setNote(e.target.value);
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log(note);
  };

  return (
    <article>
      <form onSubmit={handleFormSubmit} className="note-form">
        <label>add note</label>
        <input name="note" value={note} onChange={handleChange}></input>
        <button type="submit">submit</button>
      </form>
    </article>
  );
}

export default NoteForm;
