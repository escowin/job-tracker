import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { QUERY_JOB } from "../utils/queries";
import Auth from "../utils/auth";
import JobNotes from "../components/JobNotes";
import JobOptions from "../components/JobOptions";
import DocProfile from "../components/DocProfile";
import DocForm from "../components/DocForm";
import "../assets/css/job.css";
import CoverLetter from "../components/CoverLetter";

function Job({ setMain, contactInfo }) {
  // state variables
  const [editSelected, setEditSelected] = useState(false);
  useEffect(() => setMain("job"), [setMain]);

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
    return <section>loading...</section>;
  }

  // Job.js purpose:
  // - edit button clicked in JobOptions determines whether DocForm or DocProfile renders
  return (
    <>
      <JobOptions jobId={job._id} setEditSelected={setEditSelected} />
      {editSelected ? (
        <DocForm
          initialValues={job}
          setEditSelected={setEditSelected}
          doc={"job"}
          type={"edit"}
          className={"section"}
        />
      ) : (
        <DocProfile doc={job} title={job.role} className={job.status} />
      )}
      <JobNotes notes={job.notes} jobId={job._id} status={job.status} />
      <CoverLetter company={job.company} role={job.role} contactInfo={contactInfo} />
    </>
  );
}

export default Job;
