function JobApplication({ jobApplications }) {
  return (
    <section className="job-apps">
      <h2>job applications</h2>
      <article>
        <p>company</p>
        <p>role</p>
        <p>status</p>
        <p>date submitted</p>
      </article>
      {jobApplications.map((job, i) => (
        <article key={i} className="job">
          <p>{job.company}</p>
          <p>{job.role}</p>
          <p>{job.status}</p>
          <p>{job.dateSubmitted}</p>
        </article>
      ))}
    </section>
  );
}

export default JobApplication;
