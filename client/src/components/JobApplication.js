function JobApplication({jobApplications}) {
    return (
        <section>
        <h2>job applications</h2>
        {jobApplications.map((job, i) => (
          <article key={i}>
            <p>{job.company}</p>
            <p>{job.role}</p>
            <p>{job.status}</p>
            <p>{job.dateSubmitted}</p>
          </article>
        ))}
      </section>
    )
}

export default JobApplication;