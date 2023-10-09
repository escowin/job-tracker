import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { QUERY_RESUME } from "../utils/queries";
import ResumeForm from "./ResumeForm";

function Resume({ resumeId }) {
  const _id = resumeId;
  const { loading, data } = useQuery(QUERY_RESUME, { variables: { id: _id } });
  const resume = data?.resume || {};

  const [addItem, setAddItem] = useState(false);

  const handleAddItem = () => setAddItem(true);

  // copies profile stat to clipboard when triggered
  const copyDetail = async (data) => {
    try {
      let stat = data;
      await navigator.clipboard.writeText(stat);
    } catch (err) {
      console.error(err);
    }
  };

  if (!resumeId) {
    return (
      <section id="resume-section">
        <p className="message">select resume</p>
      </section>
    );
  }

  if (loading) {
    return <section id="resume-section">loading</section>;
  }

  // bug | form for every section is triggered when state oject is set true
  return (
    <section id="resume-section">
      <h2>{resume.title}</h2>
      <article id="links">
        <h3>
          <button onClick={handleAddItem}>+</button>
          Links
        </h3>
        {addItem && (
          <ResumeForm fields={["url", "link"]} setAddItem={setAddItem} />
        )}
        {resume.links.map((link, i) => (
          <div key={i} className="link">
            <button onClick={() => copyDetail(link.url)}>copy</button>
            <p>{link.link}</p>
            <button
              className="delete-btn"
              onClick={() => console.log(link._id)}
            >
              delete
            </button>
          </div>
        ))}
      </article>
      <article id="edu">
        <h3>
          <button onClick={handleAddItem}>+</button>
          Education
        </h3>
        {addItem && (
          <ResumeForm fields={["school", "location"]} setAddItem={setAddItem} />
        )}

        {resume.education.map((edu, i) => (
          <div key={i} className="edu">
            {Object.entries(edu)
              .filter(([key]) => !key.startsWith("_"))
              .map(([key, value], j) => (
                <React.Fragment key={j}>
                  <button onClick={() => copyDetail(value)}>copy</button>
                  <p>{value}</p>
                </React.Fragment>
              ))}
            <button className="delete-btn" onClick={() => console.log(edu._id)}>
              delete
            </button>
          </div>
        ))}
      </article>
      <article id="exp">
        <h3>
          <button onClick={handleAddItem}>+</button>
          Experience
        </h3>
        {addItem && (
          <ResumeForm fields={["company", "role", "location", "description"]} setAddItem={setAddItem} />
        )}
        {resume.experience.map((exp, i) => (
          <div key={i} className="exp">
            {Object.entries(exp)
              .filter(([key]) => !key.startsWith("_"))
              .map(([key, value], j) => (
                <React.Fragment key={j}>
                  <button onClick={() => copyDetail(value)}>copy</button>
                  <p style={{ whiteSpace: "pre-line" }}>{value}</p>
                </React.Fragment>
              ))}
            <button className="delete-btn" onClick={() => console.log(exp._id)}>
              delete
            </button>
          </div>
        ))}
      </article>
    </section>
  );
}

export default Resume;
