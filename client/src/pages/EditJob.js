import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { QUERY_JOB } from "../utils/queries";
import JobForm from "../components/JobForm";
import Auth from "../utils/auth";

function EditJob() {
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
    return <secton>Loading...</secton>;
  }

  return (
    <section className="job-form-section">
      <JobForm initialValues={job} />
    </section>
  );
}

export default EditJob;
