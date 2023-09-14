import { format } from "../utils/helpers";

function JobProfile({ job }) {
  const jobStats = [
    { value: job?.company, label: "Company" },
    { value: job?.source, label: "Source" },
    { value: job?.status, label: "Status" },
    { value: job?.interviewCount, label: "Interviews" },
    { value: job?.dateSubmitted, label: "Applied" },
  ];

  return (
    <section className="details-section" id="job-profile">
      <h2 className={job.status}>{job.role}</h2>
      {jobStats.map((stat, i) => (
        <article key={i} className="job-detail">
          <h3>{stat.label}</h3>
          <p className={job.status}>
            {stat.value !== job?.dateSubmitted
              ? stat.value
              : format.date(stat.value)}
          </p>
        </article>
      ))}
    </section>
  );
}

export default JobProfile;
