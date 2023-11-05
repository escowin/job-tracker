import { useEffect } from "react";
import Auth from "../utils/auth";
import "../assets/css/job-form.css";
import DocForm from "../components/DocForm";

function AddJob({ setMain }) {
  const loggedIn = Auth.loggedIn();
  useEffect(() => setMain("add-job"), [setMain]);
  if (!loggedIn) {
    return <section>log in to view contents</section>;
  }

  return (
    <DocForm initialValues={{}} doc={"job"} type={"add"} className={"page"} />
  );
}

export default AddJob;
