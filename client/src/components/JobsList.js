import { Link } from "react-router-dom";

function JobLists({ jobs }) {
  if (!jobs.length) {
    return <section>submit a job</section>;
  }

  return (
    <section className="job-apps">
      <h2>job s</h2>
      <article>
        <p>company</p>
        <p>role</p>
        <p>status</p>
        <p>date submitted</p>
      </article>
      {jobs.map((job, i) => (
        <article key={i} className={`${job.status} job`}>
          <p>{job.company}</p>
          <p>
            <Link to={`/job/${job._id}`}>{job.role}</Link>
          </p>
          <p>{job.status}</p>
          <p>{job.dateSubmitted}</p>
        </article>
      ))}
    </section>
  );
}

export default JobLists;
