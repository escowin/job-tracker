import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { QUERY_JOB, QUERY_ME } from "../utils/queries";
import { DELETE_JOB } from "../utils/mutations";
import Auth from "../utils/auth";
import NoteList from "../components/NoteList";
import NoteForm from "../components/NoteForm";
import "../assets/css/job.css"

function Job() {
  const loggedIn = Auth.loggedIn();
  const { id: _id } = useParams();
  const [removeJob, { error }] = useMutation(DELETE_JOB, {
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
          },
        },
      });
    },
  });
  const { loading, data } = useQuery(QUERY_JOB, {
    variables: { id: _id },
  });
  const job = data?.job || {};

  // button navigation
  const navigate = useNavigate();
  const handleEdit = () => navigate(`/edit-job/${_id}`);
  const handleGoBack = () => navigate(-1);
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

  if (!loggedIn) {
    return <section>log in to view contents</section>;
  }

  if (loading) {
    return <section>loading...</section>;
  }

  return (
    <>
      <section className={`job-section ${job.status}}`}>
        <h2>{job.role}</h2>
        <article className="job-details">
          <p>Company</p>
          <p>{job.company}</p>
          <p>Status</p>
          <p>{job.status}</p>
          <p>Date applied</p>
          <p>{job.dateSubmitted}</p>
        </article>
        <article className="job-buttons">
          <button onClick={handleGoBack}>go back</button>
          <button onClick={handleEdit}>edit</button>
          <button onClick={() => handleDelete(job._id)}>delete</button>
          {error && <span>error</span>}
        </article>
      </section>
      <section className="notes-section">
        <NoteForm jobId={job._id}/>
        <h2>Notes</h2>
        {job.noteCount > 0 && <NoteList notes={job.notes} jobId={job._id} />}
      </section>
    </>
  );
}

export default Job;
