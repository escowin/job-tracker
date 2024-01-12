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
  const { loading, data } = useQuery(QUERY_LETTERS);
  console.log(loading);

  const letters = {
    cover: data?.letters
      ? data.letters.filter((letter) => letter.type === "cover")
      : [],
    rec: data?.letters
      ? data.letters.filter((letter) => letter.type === "rec")
      : [],
  };

  console.log(letters);
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
    // hardcoded index value for testing purposes only
    text: letters.cover[0]?.text.replace(/{job}/, role) || "",
  };

  // hardcoded index value for testing purposes only
  const recLetter = letters.rec[0]?.text;
  console.log(recLetter);

  return (
    <section id="letters-section">
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
      <article id="letters">
        <div className="letter-header">
          <h3>{coverLetter.me.name}</h3>
          <p>{`${coverLetter.me.contact}\n\n`}</p>
          <p>{`${coverLetter.date}\n\n`}</p>
          <h3>Dear {coverLetter.company.hrManager},</h3>
          <p>{coverLetter.company.name}</p>
          <p>{format.newLine(coverLetter.company.address)}</p>
        </div>
        <div className="cover-letter">
          <p>{coverLetter.text}</p>
        </div>
        <div className="rec-letter">
          <p>{recLetter}</p>
        </div>
      </article>
    </section>
  );
}

export default CoverLetter;
