import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { QUERY_ME } from "../utils/queries";
import { JOB } from "../utils/mutations";
import Auth from "../utils/auth";
import UserStats from "../components/UserStats";
import JobLists from "../components/JobsList";
import DocForm from "../components/DocForm";
// import ProfileForm from "../components/ProfileForm";
import "../assets/css/home.css";

function Home() {
  // user info is dependent in being logged in
  const loggedIn = Auth.loggedIn();
  const [updatePendingJobs, { error }] = useMutation(JOB.UPDATE_PENDING_JOBS);
  const { loading, data } = useQuery(QUERY_ME);
  const user = data?.me || [];
  const jobs = user?.jobs || [];

  const userStats = [
    { value: user?.pendingCount, label: "pending" },
    { value: user?.waitlistedCount, label: "waitlisted" },
    { value: user?.rejectedCount, label: "rejected" },
    { value: user?.interviewingCount, label: "interviewing" },
    { value: user?.hiredCount, label: "hired" },
    { value: user?.noResponseCount, label: "no-response" },
    { value: user?.totalSubmitted, label: "total" },
    { value: user?.rate, label: "rate" },
  ];

  // form component renders by tracking the state of the display width
  const [minWidth, setMinWidth] = useState(window.innerWidth >= 750);
  useEffect(() => {
    // Triggers update mutation when the component loads for a logged-in user with a defined username
    loggedIn ? updatePendingJobs() : console.error(error);

    // Updates the `minWidth` state based on the window width
    const handleResize = () => {
      setMinWidth(window.innerWidth >= 750);
    };

    // Adds event listener to track window width changes
    window.addEventListener("resize", handleResize);

    // Cleans up event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [loggedIn, error, updatePendingJobs]);

  if (loading) {
    return <section className="message">Loading...</section>;
  }

  return (
    <>
      {loggedIn && user?.username ? (
        <>
          {minWidth && (
            // <JobForm initialValues={{}} className={"aside"} doc={"job"} type={"add"} />
            <DocForm initialValues={{}} className={"aside"} doc={"job"} type={"add"} />
          )}
          <UserStats user={{ username: user.username, stats: userStats }} />
          <JobLists jobs={jobs} />
        </>
      ) : (
        <section className="message">
          <Link to="/login" className="link">
            log in
          </Link>{" "}
          to view contents
        </section>
      )}
    </>
  );
}

export default Home;
