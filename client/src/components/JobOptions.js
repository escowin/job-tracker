import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { ADD_NOTE, DELETE_JOB } from "../utils/mutations";
import { QUERY_JOB, QUERY_ME } from "../utils/queries";

function JobOptions({ jobId }) {
  const { id: _id } = useParams();
  const [removeJob] = useMutation(DELETE_JOB, {
    update(cache, { data }) {
      // reads query_me data from cache
      const { me } = cache.readQuery({ query: QUERY_ME });
      // removes deleted job from job app array
      const updatedJobs = me.jobs.filter((job) => job._id !== _id);
      // writes updated query_me data to cache
      cache.writeQuery({
        query: QUERY_ME,
        data: {
          me: {
            ...me,
            jobs: updatedJobs,
            pendingCount: updatedJobs.filter((job) => job.status === "pending")
              .length,
            rejectedCount: updatedJobs.filter(
              (job) => job.status === "rejected"
            ).length,
            hiredCount: updatedJobs.filter((job) => job.status === "hired")
              .length,
            totalSubmitted: updatedJobs.length,
            rate: me.hiredCount / (updatedJobs.length + 1),
          },
        },
      });
    },
  });
  const { data } = useQuery(QUERY_JOB, {
    variables: { id: _id },
  });
  const job = data?.job || {};

  const navigate = useNavigate();
  const handleDelete = async () => {
    try {
      const { data } = await removeJob({
        variables: { id: _id },
      });
      console.log(data);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };
  const handleGoBack = () => navigate(-1);
  const handleEdit = () => navigate(`/edit-job/${jobId}`);

  // note form variables
  const [addNote, { error }] = useMutation(ADD_NOTE);
  const [note, setNote] = useState("");
  const [interview, setInterview] = useState(false);

  const handleChange = (e) => setNote(e.target.value);
  const handleChecked = (e) => {
    const checked = e.target.checked;
    setInterview(checked);
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      await addNote({
        variables: { jobId, note, interview },
      });
      setNote("");
      setInterview(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="form-section" id="job-options">
      <h2>Options</h2>
      <article className="job-buttons">
        <button onClick={handleGoBack}>back</button>
        <button onClick={handleEdit}>edit</button>
        <button onClick={() => handleDelete(job._id)} className="warning">
          delete
        </button>
      </article>

      <form onSubmit={handleFormSubmit} className="note-form">
        <label>note</label>
        <textarea name="note" value={note} onChange={handleChange} />
        <article id="note-checkbox">
          <label htmlFor="interview">interview</label>
          <input
            type="checkbox"
            name="interview"
            id="interview"
            onClick={handleChecked}
            value={interview}
          />
        </article>
        <button type="submit">submit</button>
      </form>
      {error && <span>error</span>}
    </section>
  );
}

export default JobOptions;
