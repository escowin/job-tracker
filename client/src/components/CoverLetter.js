// SEQUENCE
// 1. Import libraries and dependencies
// 2. Define the CoverLetter component function
// 3. Set up state management variables
// 4. User input tr

import { useState } from "react";
import "../assets/css/cover-letter.css";

function CoverLetter() {
  const [formState, setFormState] = useState({});
  const fields = ["company", "address", "city", "state"];
  console.log(formState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prevState => ({
      ...prevState,
      [name]: value.trim()
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("form submit");

    try {
      console.log(formState);
    } catch (err) {
      console.error(err);
    }
  };

  const coverLetter = {
    me: {
      // name, email, phone, address
    },
    date: new Date().toLocaleString("en-us", {
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone: "America/Chicago",
    }),
    company: {
      hrManager: "hiring manager",
      name: formState.company,
      address: formState.address,
      city: formState.city,
      state: formState.state,
    },
    body: [
      // cover letter data queried from server
    ],
  };

  const recLetter = {
    body: [
      // rec letter data queried from server
    ],
  };
  return (
    <>
      <section id="form-section">
        <form onSubmit={handleFormSubmit} id="cover-letter-form">
          <h2>Cover letter form</h2>
          {fields.map((field, i) => (
            <label key={i} htmlFor={field}>
              {field}
              <input name={field} id={field} onChange={handleChange} />
            </label>
          ))}
          <button type="submit">submit</button>
        </form>
      </section>
      <section id="contact-section">
        <h3>{coverLetter.me.name}</h3>
        <p>{coverLetter.me.address}</p>
        <p>{coverLetter.me.cityState}</p>
        <p>{coverLetter.me.phone}</p>
        <p>{coverLetter.me.email}</p>
      </section>

      <section id="date">
        <p>{coverLetter.date}</p>
      </section>

      <section id="company-section">
        <h3>Dear {coverLetter.company.hrManager},</h3>
        <p>{coverLetter.company.name}</p>
        <p>{coverLetter.company.address},</p>
        <p>
          {coverLetter.company.city}, {coverLetter.company.state}
        </p>
      </section>

      <section className="letter" id="body-section">
        {coverLetter.body.map((string, i) => (
          <p key={i}>{string}</p>
        ))}
        <p>Thank you,</p>
        <p>{me.name}</p>
      </section>

      <div className="pagebreak"></div>

      <section className="letter" id="cover-letter">
        <h3>Recommendation letter</h3>
        {recLetter.body.map((string, i) => (
          <p key={i}>{string}</p>
        ))}
      </section>

      <section className="letter-details">
        {recLetter.outro.map((string, i) => (
          <p key={i}>{string}</p>
        ))}
      </section>
    </>
  );
}

export default CoverLetter;
