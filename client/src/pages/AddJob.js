// import { useNavigate } from "react-router-dom";
import JobForm from "../components/JobForm";
import Auth from "../utils/auth";

function AddJob() {
  const loggedIn = Auth.loggedIn();
  // const navigate = useNavigate()

  if (!loggedIn) {
    return <section>log in to view contents</section>;
  }

  return (
    <section className="job-form-section">
      <JobForm initialValues={{}} />
    </section>
  );
}

export default AddJob;
