import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { QUERY_ME } from "../utils/queries";
import { UPDATE_PENDING_JOBS } from "../utils/mutations";
import Auth from "../utils/auth";
import Profile from "../components/Profile";
import JobLists from "../components/JobsList";
import JobForm from "../components/JobForm";

import "../assets/css/home.css";

function Home() {
  // user info is dependent in being logged in
  const loggedIn = Auth.loggedIn();
  const [updatePendingJobs, { error }] = useMutation(UPDATE_PENDING_JOBS);
  const { loading, data } = useQuery(QUERY_ME);
  // Wrap the initialization of 'user' in a useMemo Hook to memorize `user`. Ensures variable remains stable between renders, preventing unnecessary useEffect re-renders. 
  const user = useMemo(
    () => (loading || !data?.me ? {} : data.me),
    [loading, data]
  );
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
    loggedIn && user?.username ? updatePendingJobs() : console.error(error);

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
  }, [loggedIn, user, error, updatePendingJobs]);

  if (loading) {
    return <section className="message">Loading...</section>;
  }

  return (
    <>
      {loggedIn && user?.username ? (
        <>
          {minWidth && (
            <JobForm initialValues={{}} id={"add-job"} type="aside" />
          )}
          <Profile user={{ username: user.username, stats: userStats }} />
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
