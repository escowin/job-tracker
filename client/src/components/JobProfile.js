import { format } from "../utils/helpers";

function JobProfile({ job }) {
  const jobStats = [
    { value: job?.company, label: "Company" },
    { value: format.id(job?.source), label: "Source" },
    { value: job?.status, label: "Status" },
    { value: job?.interviewCount, label: "Interviews" },
    { value: format.date(job?.applied), label: "Applied" },
  ];

  return (
    <section className="details-section" id="job-profile">
      <h2 className={job.status}>{job.role}</h2>
      {jobStats.map((stat, i) => (
        <article key={i} className="job-detail">
          <h3>{stat.label}</h3>
          <p className={job.status}>{stat.value}</p>
        </article>
      ))}
    </section>
  );
}

export default JobProfile;
