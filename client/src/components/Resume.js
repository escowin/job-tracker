import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { QUERY_RESUME } from "../utils/queries";
import ResumeForm from "./ResumeForm";
import ResumeItem from "./ResumeItem";

function Resume({ resumeId }) {
  const _id = resumeId;
  const { loading, data } = useQuery(QUERY_RESUME, { variables: { id: _id } });
  const resume = data?.resume || {};

  const [addItem, setAddItem] = useState(null);

  const handleAddItem = (item) => setAddItem(item);

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

  return (
    <section id="resume-section">
      <h2>{resume.title}</h2>
      <article id="links">
        <h3>
          <button onClick={() => handleAddItem("link")}>+</button>
          Links
        </h3>
        {addItem === "link" && (
          <ResumeForm fields={["url", "link"]} setAddItem={setAddItem} />
        )}
        {resume.links.map((link, i) => (
          <ResumeItem item={link} key={i} />
        ))}
      </article>
      <article id="edu">
        <h3>
          <button onClick={() => handleAddItem("edu")}>+</button>
          Education
        </h3>
        {addItem === "edu" && (
          <ResumeForm fields={["school", "location"]} setAddItem={setAddItem} />
        )}

        {resume.education.map((edu, i) => (
          <ResumeItem item={edu} key={i} />
        ))}
      </article>
      <article id="exp">
        <h3>
          <button onClick={() => handleAddItem("exp")}>+</button>
          Experience
        </h3>
        {addItem === "exp" && (
          <ResumeForm
            fields={["company", "role", "location", "description"]}
            setAddItem={setAddItem}
          />
        )}
        {resume.experience.map((exp, i) => (
          <ResumeItem item={exp} key={i} />
        ))}
      </article>
    </section>
  );
}

export default Resume;
