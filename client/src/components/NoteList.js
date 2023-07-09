function NoteList({ notes }) {
  return (
    <>
      {notes.map((note, i) => (
        <article key={i}>
          <p>{note.createdAt}</p>
          <p>{note.note}</p>
        </article>
      ))}
    </>
  );
}

export default NoteList;
