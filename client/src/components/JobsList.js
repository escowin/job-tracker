import { Link } from "react-router-dom";
import { format } from "../utils/helpers";

function JobLists({ jobs }) {
  if (!jobs.length) {
    return <section>submit a job</section>;
  }
  const fields = ["source", "company", "role", "status", "notes", "applied"]

  return (
    <section className="jobs list-section" id="jobs">
      <h2 className="list-header">job applications</h2>
      <article>
        {fields.map((field, i) => (
          field === "source" || field === "applied" || field === "status" ? <h3 key={i} className="display-md">{field}</h3> : <h3 key={i}>{field}</h3>
        ))}
      </article>
      {jobs.map((job, i) => (
        <article key={i} className={`${format.camelToKebab(job.status)} job`}>
          <p className="display-md">{format.id(job.source)}</p>
          <Link to={`/job/${job._id}`} className="link">{job.company}</Link>
          <Link to={`/job/${job._id}`} className="link">{job.role}</Link>
          <p className="display-md">{format.unCamel(job.status)}</p>
          <p className="count">{job.noteCount}</p>
          <p className="display-md">{format.date(job.applied)}</p>
        </article>
      ))}
    </section>
  );
}

export default JobLists;
