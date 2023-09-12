import { Link } from "react-router-dom";
import { formatDate } from "../utils/helpers";

function JobLists({ jobs }) {
  if (!jobs.length) {
    return <section>submit a job</section>;
  }

  console.log(jobs)
  return (
    <section className="jobs list-section" id="jobs">
      <h2>job applications</h2>
      <article>
        <h3>source</h3>
        <h3>company</h3>
        <h3>role</h3>
        <h3>status</h3>
        <h3>notes</h3>
        <h3 className="display-md">submitted</h3>
      </article>
      {jobs.map((job, i) => (
        <article key={i} className={`${job.status} job`}>
          <p>{job.source}</p>
          <Link to={`/job/${job._id}`} className="link">{job.company}</Link>
          <Link to={`/job/${job._id}`} className="link">{job.role}</Link>
          <p>{job.status}</p>
          <p className="count">{job.noteCount}</p>
          <p className="display-md">{formatDate(job.dateSubmitted)}</p>
        </article>
      ))}
    </section>
  );
}

export default JobLists;
