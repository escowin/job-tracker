import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { QUERY_JOB } from "../utils/queries";
import { DELETE_JOB } from "../utils/mutations";
// import Auth from "../utils/auth";

function Job() {
  // const loggedIn = Auth.loggedIn();
  const { id: _id } = useParams();
  const [removeJob, { error }] = useMutation(DELETE_JOB);
  const { loading, data } = useQuery(QUERY_JOB, {
    variables: { id: _id },
  });
  const job = data?.jobApplication || {};

  // button navigation
  const navigate = useNavigate();
  const handleEdit = () => navigate(`/edit-job/${_id}`);
  const handleGoBack = () => navigate(-1);
  const handleDelete = async (id) => {
    try {
      const { data } = await removeJob({
        variables: { id },
      });
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <section>loading...</section>;
  }

  return (
    <>
      <section>
        <h2>job application</h2>
        <article>
          <p>{job.company}</p>
          <p>{job.role}</p>
          <p>{job.status}</p>
          <p>{job.dateSubmitted}</p>
        </article>
      </section>
      <section>
        <button onClick={handleGoBack}>go back</button>
        <button onClick={handleEdit}>edit</button>
        <button onClick={() => handleDelete(job._id)}>delete</button>
      </section>
    </>
  );
}

export default Job;
