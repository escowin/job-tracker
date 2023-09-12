import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { QUERY_JOB } from "../utils/queries";
import Auth from "../utils/auth";
import { formatDate } from "../utils/helpers";
import NoteList from "../components/NoteList";
import JobOptions from "../components/JobOptions";
import "../assets/css/job.css";

function Job() {
  const loggedIn = Auth.loggedIn();
  const { id: _id } = useParams();
  const { loading, data } = useQuery(QUERY_JOB, {
    variables: { id: _id },
  });
  const job = data?.job || {};
  const jobStats = [
    { value: job?.company, label: "Company" },
    { value: job?.source, label: "Source" },
    { value: job?.status, label: "Status" },
    { value: job?.interviewCount, label: "Interviews" },
    { value: job?.dateSubmitted, label: "Applied" },
  ];

  if (!loggedIn) {
    return <section>log in to view contents</section>;
  }

  if (loading) {
    return <section>loading...</section>;
  }

  return (
    <>
      <JobOptions jobId={job._id} />
      <section className="details-section" id="job-profile">
        <h2 className={job.status}>{job.role}</h2>
        {jobStats.map((stat, i) => (
          <article key={i} className="job-detail">
            <h3>{stat.label}</h3>
            <p className={job.status}>
              {stat.value !== job?.dateSubmitted
                ? stat.value
                : formatDate(stat.value)}
            </p>
          </article>
        ))}
      </section>
      <section className="list-section" id="notes-section">
        <h2>Notes</h2>
        {job.noteCount > 0 && (
          <NoteList notes={job.notes} jobId={job._id} status={job.status} />
        )}
      </section>
    </>
  );
}

export default Job;
