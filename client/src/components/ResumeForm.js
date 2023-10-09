function ResumeForm({ fields, setAddItem }) {
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log("form submit");
  };

  return (
    <form className="resume-form-item" onSubmit={handleFormSubmit}>
      {fields.map((field, i) => (
        <label key={i} htmlFor={field}>
          {field}
          <input type="text" name={field} id={field} />
        </label>
      ))}
      <button type="submit">submit</button>
      <button type="button" onClick={() => setAddItem(null)}>cancel</button>
    </form>
  );
}

export default ResumeForm;
