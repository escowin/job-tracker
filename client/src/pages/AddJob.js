import JobForm from "../components/JobForm";
import Auth from "../utils/auth";
import "../assets/css/job-form.css"

function AddJob() {
  const loggedIn = Auth.loggedIn();

  if (!loggedIn) {
    return <section>log in to view contents</section>;
  }

  return (
    <section className="job-form-section">
      <JobForm initialValues={{}} title={"add job"} />
    </section>
  );
}

export default AddJob;
