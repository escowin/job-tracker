import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { QUERY_JOB } from "../utils/queries";
// import Auth from "../utils/auth";

function Job() {
  // const loggedIn = Auth.loggedIn();
  const { id: _id } = useParams();
  const { loading, data } = useQuery(QUERY_JOB, {
    variables: { id: _id },
  });
  const job = data?.jobApplication || {};

  // button navigation
  const navigate = useNavigate();
  const handleEdit = () => navigate(`/edit-job/${_id}`);
  const handleGoBack = () => navigate(-1);

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
        <button>delete</button>
      </section>
    </>
  );
}

export default Job;
