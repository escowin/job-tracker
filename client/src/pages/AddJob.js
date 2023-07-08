import JobForm from "../components/JobForm";
import Auth from "../utils/auth";

function AddJob() {
  const loggedIn = Auth.loggedIn();

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
