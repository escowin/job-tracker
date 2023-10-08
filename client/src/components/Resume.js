import { useQuery } from "@apollo/client";
import { QUERY_RESUME } from "../utils/queries";

function Resume({ resumeId }) {
  const _id = resumeId;
  const { loading, data } = useQuery(QUERY_RESUME, {
    variables: { id: _id },
  });
  const resume = data?.resume || {};

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
    return <section id="resume-section">
      <p className="message">select resume</p></section>;
  }

  if (loading) {
    return <section id="resume-section">loading</section>;
  }

  return (
    <section id="resume-section">
      <h2>{resume.title}</h2>
      <article id="links">
        <h3>Links</h3>
        {resume.links.map((link, i) => (
          <div key={i}>
            <button onClick={() => copyDetail(link.url)}>copy</button>
            <p>{link.link}</p>
          </div>
        ))}
      </article>
      <article id="edu">
        <h3>Education</h3>
        {resume.education.map((edu, i) => (
          <div key={i}>
            <button onClick={() => copyDetail(edu.school)}>copy</button>
            <p>{edu.school}</p>
            <button onClick={() => copyDetail(edu.location)}>copy</button>
            <p>{edu.location}</p>
          </div>
        ))}
      </article>
      <article id="exp">
        <h3>experience</h3>
        {resume.experience.map((exp, i) => (
          <div key={i}>
            <button onClick={() => copyDetail(exp.role)}>copy</button>
            <p>{exp.role}</p>
            <button onClick={() => copyDetail(exp.company)}>copy</button>
            <p>{exp.company}</p>
            <button onClick={() => copyDetail(exp.location)}>copy</button>
            <p>{exp.location}</p>
            <button onClick={() => copyDetail(exp.description)}>copy</button>
            <p style={{ whiteSpace: "pre-line" }}>{exp.description}</p>
          </div>
        ))}
      </article>
    </section>
  );
}

export default Resume;
