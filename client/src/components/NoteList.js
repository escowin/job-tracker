function NoteList({ notes }) {
  return (
    <section>
      {notes.map((note, i) => (
        <article key={i}>
          <p>{note.createdAt}</p>
          <p>{note.note}</p>
        </article>
      ))}
    </section>
  );
}

export default NoteList;
