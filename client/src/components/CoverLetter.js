// SEQUENCE
// 1. Import libraries and dependencies
// 2. Define the CoverLetter component function
// 3. Set up state management variables
// 4. User input tr

import { useState } from "react";
import { useQuery } from "@apollo/client";
import { QUERY_LETTERS } from "../utils/queries";
import { format } from "../utils/helpers";
// import "../assets/css/cover-letter.css";

function CoverLetter({ company, role }) {
  // query letters
  // split letters array by type ('cover', 'rec')
  // display cover letters as a list of radios (listed & organized by date)
  // - ensures only one cover letter can be active
  // display rec letters as a list of checkboxes
  // - allows multiple rec letters to be added, viewable only in print media query
  const [formState, setFormState] = useState({});
  const fields = ["address", "tech"];
  console.log(formState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value.trim(),
    }));
  };

  // test purposes only
  const string =
    "808 Main St\nManhattan, New York 12098\n310.500.1234\nuser@example.co";

  const coverLetter = {
    me: {
      name: "Patrick Bateman",
      contact: string,
    },
    date: new Date().toLocaleString("en-us", {
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone: "America/Chicago",
    }),
    company: {
      hrManager: "hiring manager",
      name: company,
      address: formState.address,
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
    <section id="cover-letter-section">
      <article id="letter-form">
        <form id="cover-letter-form">
          <h2>Cover letter details</h2>
          {fields.map((field, i) => (
            <label key={i} htmlFor={field}>
              {field}
              <input name={field} id={field} onChange={handleChange} />
            </label>
          ))}
        </form>
      </article>
      <article id="cover-letter">
        <div class="letter-header">
          <h3>{coverLetter.me.name}</h3>
          <p>{`${coverLetter.me.contact}\n\n`}</p>
          <p>{`${coverLetter.date}\n\n`}</p>
          <h3>Dear {coverLetter.company.hrManager},</h3>
          <p>{coverLetter.company.name}</p>
          <p>{format.newLine(coverLetter.company.address)}</p>
        </div>
        <div class="letter-body">{coverLetter.text}</div>
      </article>

      {/* <section className="letter" id="body-section">
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
      </section> */}
    </section>
  );
}

export default CoverLetter;
