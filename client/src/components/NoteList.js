import { useMutation } from "@apollo/client";
import { DELETE_NOTE } from "../utils/mutations";

function NoteList({ notes, jobId }) {
  const [deleteNote, { error }] = useMutation(DELETE_NOTE);
  const handleDeleteNote = async (_id) => {
    try {
      const { data } = await deleteNote({
        variables: { jobId: jobId, id: _id },
      });
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {notes.map((note, i) => (
        <article key={i}>
          <p>{note.createdAt}</p>
          <p>{note.note}</p>
          <button onClick={() => handleDeleteNote(note._id)}>delete</button>
          {error && <span>error</span>}
        </article>
      ))}
    </>
  );
}

export default NoteList;
