import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { JOB } from "../utils/mutations";
import { QUERY_JOB, QUERY_ME } from "../utils/queries";
import ResumeItemForm from "./ItemForm";

function JobOptions(props) {
  // console.log(props)
  // props
  const { jobId, setEditSelected } = props
  // database variables
  const { id: _id } = useParams();
  const [removeJob] = useMutation(JOB.DELETE_JOB, {
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
            totalCount: updatedJobs.length,
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

  // option variables
  const navigate = useNavigate();
  const handleGoBack = () => navigate(-1);
  const handleEdit = () => setEditSelected(true);
  const handleDelete = async () => {
    try {
      await removeJob({ variables: { id: _id } });
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="form-section aside" id="job-options">
      <h2>Options</h2>
      <article className="job-buttons">
        <button onClick={handleGoBack}>back</button>
        <button onClick={handleEdit}>edit</button>
        <button onClick={() => handleDelete(job._id)} className="delete">
          delete
        </button>
      </article>
      {/* <NoteForm jobId={jobId}/> */}
      <ResumeItemForm subDoc={"notes"} setAddItem={null} jobId={jobId} />
    </section>
  );
}

export default JobOptions;
