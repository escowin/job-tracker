import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { QUERY_JOB } from "../utils/queries";
import Auth from "../utils/auth";
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
      <section className={`job-section details-section ${job.status}`}>
        <h2>{job.role}</h2>
        <article className="job-details">
          <p>Company</p>
          <p>{job.company}</p>
          <p>Status</p>
          <p>{job.status}</p>
          <p>Date applied</p>
          <p>{job.dateSubmitted}</p>
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
