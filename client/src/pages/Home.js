import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { QUERY_ME } from "../utils/queries";
import Auth from "../utils/auth";
import Profile from "../components/Profile";
import JobLists from "../components/JobsList";
import JobForm from "../components/JobForm";

import "../assets/css/home.css";

function Home() {
  // user info is dependent in being logged in
  const loggedIn = Auth.loggedIn();
  const { loading, data } = useQuery(QUERY_ME);
  const user = data?.me || {};
  const jobs = user?.jobs || [];

  const userStats = [
    { value: user?.pendingCount, label: "pending" },
    { value: user?.waitlistedCount, label: "waitlisted" },
    { value: user?.rejectedCount, label: "rejected" },
    { value: user?.hiredCount, label: "hired" },
    { value: user?.totalSubmitted, label: "total" },
    { value: user?.rate, label: "rate" },
  ];

  // form component renders by tracking the state of the display width
  const [minWidth, setMinWidth] = useState(window.innerWidth >= 1024);
  useEffect(() => {
    // Define a function to update the `minWidth` state based on the window width
    const handleResize = () => {
      setMinWidth(window.innerWidth >= 1024);
    };

    // Add event listener to track window width changes
    window.addEventListener("resize", handleResize);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (loading) {
    return <section className="message">Loading...</section>;
  }

  return (
    <>
      {loggedIn && user?.username ? (
        <>
          {minWidth && <JobForm initialValues={{}} title={"add-job"} />}
          <Profile
            user={{
              username: user.username,
              stats: userStats,
            }}
          />
          <JobLists jobs={jobs} />
        </>
      ) : (
        <section className="message">
          <Link to="/login" className="link">log in</Link> to view contents
        </section>
      )}
    </>
  );
}

export default Home;
