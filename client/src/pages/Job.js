import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { QUERY_JOB } from "../utils/queries";
import Auth from "../utils/auth";

function Job() {
  const [goBack, setGoBack] = useState(false);
  const loggedIn = Auth.loggedIn();
  const { id: _id } = useParams();
  const { loading, data } = useQuery(QUERY_JOB, {
    variables: { id: _id },
  });
  const job = data?.jobApplication || {};

  if (loading) {
    return <section>loading...</section>;
  }

  if (goBack) {
    window.history.back();
    return null;
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
        <button onClick={()=> setGoBack(true)}>go back</button>
        <button>edit</button>
        <button>delete</button>
      </section>
    </>
  );
}

export default Job;
