import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { QUERY_RESUME } from "../utils/queries";
import ItemForm from "./ItemForm";
import ResumeItem from "./ResumeItem";

function Resume({ resumeId }) {
  // resume document id derived from prop
  const _id = resumeId;

  // server data retrieved from graphql query
  const { loading, data } = useQuery(QUERY_RESUME, { variables: { id: _id } });
  const resume = data?.resume || {};

  // state variables
  const [addItem, setAddItem] = useState(null);
  const handleAddItem = (item) => setAddItem(item);

  // UI display
  // - conditional displays
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

  // elements render dynamically by only mapping `resume` array keys
  return (
    <section id="resume-section">
      <h2>{resume.title}</h2>
      {Object.keys(resume).map(
        (key) =>
          Array.isArray(resume[key]) && (
            <article key={key} id={key}>
              <h3>{key.charAt(0).toUpperCase() + key.slice(1)}</h3>
              <button className="add-btn" onClick={() => handleAddItem(key)}>+</button>
              {addItem === key && (
                <ItemForm subDoc={key} setAddItem={setAddItem} resumeId={_id} />
              )}
              {resume[key].map((item, i) => (
                <ResumeItem key={i} item={item} resumeId={_id} arr={key} />
              ))}
            </article>
          )
      )}
    </section>
  );
}

export default Resume;
