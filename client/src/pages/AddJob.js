import JobForm from "../components/JobForm";
import Auth from "../utils/auth";
import "../assets/css/job-form.css";

function AddJob() {
  const loggedIn = Auth.loggedIn();
  if (!loggedIn) {
    return <section>log in to view contents</section>;
  }

  return <JobForm initialValues={{}} doc={"job"} type={"add"} className={"page"}/>;
}

export default AddJob;
