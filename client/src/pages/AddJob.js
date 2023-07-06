import { useState } from "react";

function AddJob() {
   const [company, setCompany] = useState("");
   const [role, setRole] = useState("");
   const [dateSubmitted, setDateSubmitted] = useState("");

   const handleChange = (e) => {
    if (e.target.name === "company") {
      console.log(e.target.value)
    } else if (e.target.name === "role") {
      console.log(e.target.value)
    } else if (e.target.name === "date-submitted") {
      console.log(e.target.value)
    }
   }

   const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log(e)
   }
  return (
    <>
      <section>
        <h2>add job app</h2>
        <form onSubmit={handleFormSubmit}>
          <label htmlFor="company">Company</label>
          <input name="company" onChange={handleChange}/>
          <label htmlFor="role">Role</label>
          <input name="role" onChange={handleChange}/>
          <label htmlFor="date-submitted">Date submitted</label>
          <input name="date-submitted" type="date" onChange={handleChange}/>

          <button type="submit">submit</button>
        </form>
      </section>
    </>
  );
}

export default AddJob;
