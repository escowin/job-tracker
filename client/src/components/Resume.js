import { useQuery } from "@apollo/client";
import { QUERY_RESUME } from "../utils/queries";

function Resume({ resumeId }) {
  const _id = resumeId;
  const { loading, data } = useQuery(QUERY_RESUME, {
    variables: { id: _id },
  });
  const resume = data?.resume || {};
  console.log(resume);

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
    return <section>select resume</section>;
  }

  if (loading) {
    return <section>loading</section>;
  }

  return (
    <section id="resume">
      <article>
        <h3>links</h3>
        {resume.links.map((link, i) => (
          <div key={i}>
            <p>{link.link}</p>
            <button onClick={() => copyDetail(link.url)}>copy</button>
          </div>
        ))}
      </article>
      <article>
        <h3>education</h3>
        {resume.education.map((edu, i) => (
          <div key={i}>
            <p>{edu.school}</p>
            <button onClick={() => copyDetail(edu.school)}>copy</button>
            <p>{edu.location}</p>
            <button onClick={() => copyDetail(edu.location)}>copy</button>
          </div>
        ))}
      </article>
      <article>
        <h3>experience</h3>
        {resume.experience.map((exp, i) => (
          <div key={i}>
            <p>{exp.role}</p>
            <button onClick={() => copyDetail(exp.role)}>copy</button>
            <p>{exp.company}</p>
            <button onClick={() => copyDetail(exp.company)}>copy</button>
            <p>{exp.location}</p>
            <button onClick={() => copyDetail(exp.location)}>copy</button>
            <p style={{ whiteSpace: "pre-line" }}>{exp.description}</p>
            <button onClick={() => copyDetail(exp.description)}>copy</button>
          </div>
        ))}
      </article>
    </section>
  );
}

export default Resume;
