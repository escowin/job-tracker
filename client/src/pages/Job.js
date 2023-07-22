import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { QUERY_JOB } from "../utils/queries";
import Auth from "../utils/auth";
import { formatDate } from "../utils/helpers";
import NoteList from "../components/NoteList";
import JobOptions from "../components/JobOptions";
import "../assets/css/job.css"

function Job() {
  const loggedIn = Auth.loggedIn();
  const { id: _id } = useParams();
  const { loading, data } = useQuery(QUERY_JOB, {
    variables: { id: _id },
  });
  const job = data?.job || {};

  if (!loggedIn) {
    return <section>log in to view contents</section>;
  }

  if (loading) {
    return <section>loading...</section>;
  }

  return (
    <>
      <section className={`details-section ${job.status}`} id="job-section">
        <h2>{job.role}</h2>
        <article className="job-details">
          <h3>Company</h3>
          <h3>Status</h3>
          <h3>Applied</h3>
          <p>{job.company}</p>
          <p>{job.status}</p>
          <p>{formatDate(job.dateSubmitted)}</p>
        </article>
      </section>
      <JobOptions jobId={job._id}/>
      <section className="list-section" id="notes-section">
        <h2>Notes</h2>
        {job.noteCount > 0 && <NoteList notes={job.notes} jobId={job._id} status={job.status}/>}
      </section>
    </>
  );
}

export default Job;
