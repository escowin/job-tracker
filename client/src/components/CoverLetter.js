import { useState } from "react";
import { useQuery } from "@apollo/client";
import { QUERY_LETTERS } from "../utils/queries";
import { format } from "../utils/helpers";

function CoverLetter({ company, role, contactInfo }) {
  // query letters
  // split letters array by type ('cover', 'rec')
  // display cover letters as a list of radios (listed & organized by date)
  // - ensures only one cover letter can be active
  // display rec letters as a list of checkboxes
  // - allows multiple rec letters to be added, viewable only in print media query
  const { loading, data } = useQuery(QUERY_LETTERS);

  const letters = {
    cover: data?.letters
      ? data.letters.filter((letter) => letter.type === "cover")
      : [],
    rec: data?.letters
      ? data.letters.filter((letter) => letter.type === "rec")
      : [],
  };

  const [formState, setFormState] = useState({});
  const fields = ["address", "tech", "team", "reqs"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value.trim(),
    }));
  };

  const coverLetter = {
    // contactInfo set by Home, passed down as prop from App > Job > CoverLetter 
    me: contactInfo,
    date: new Date().toLocaleString("en-us", {
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone: "America/Chicago",
    }),
    company: `Hiring Manager,\n${company}\n${format.newLine(
      formState.address
    )}`,
    // hardcoded bracket notation for testing purposes
    text:
      letters.cover[0]?.text
        .replace(/{job}/, role)
        .replace(
          /{tech}|{team}|{reqs}/g,
          (match) => formState[match.replace(/{|}/g, "")]
        ) || "",
  };

  const recLetters = letters.rec;

  if (loading) {
    return <section id="letters-section">loading...</section>;
  }

  return (
    <section id="letters-section" className="display-print">
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
          <p>{coverLetter.me.name}</p>
          <p>{`${coverLetter.me}\n\n`}</p>
          <p>{`${coverLetter.date}\n\n`}</p>
          <p>Dear {coverLetter.company}</p>
        </div>
        <div className="letter cover-letter break">
          <p>{`\n${coverLetter.text}`}</p>
        </div>
        {recLetters.map((letter, i) => (
          <div key={i} className="letter rec-letter break">
            <h3>Recommendation letter</h3>
            <p>{`\n${letter.text}\n`}</p>
          </div>
        ))}
      </article>
    </section>
  );
}

export default CoverLetter;
