import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { QUERY_ME } from "../utils/queries";
import { JOB } from "../utils/mutations";
import Auth from "../utils/auth";
import JobLists from "../components/JobsList";
import DocProfile from "../components/DocProfile";
import DocForm from "../components/DocForm";
import "../assets/css/home.css";

function Home({ setMain, setContactInfo }) {
  // user info is dependent in being logged in
  const loggedIn = Auth.loggedIn();
  const [updatePendingJobs, { error }] = useMutation(JOB.UPDATE_PENDING_JOBS);
  const { loading, data } = useQuery(QUERY_ME);
  const user = data?.me || [];
  const jobs = user?.jobs || [];

// Updates the contact information state variable in the App component when user data is available, ensuring the cover letter header in the Job component displays accurate information.
useEffect(() => {
    if (data && data.me) {
      const userInfo = data.me;
      const contactInfo = `${userInfo.firstName} ${userInfo.lastName}\n${userInfo.address}\n${userInfo.location} ${userInfo.zip}\n${userInfo.phone}\n${userInfo.email}`;
      setContactInfo(contactInfo);
    }
  }, [data, setContactInfo]);

  const overview = { 
    __typename: user.__typename,
    username: user.username,
    noResponseCount: user.noResponseCount,
    rejectedCount: user.rejectedCount,
    waitlistedCount: user.waitlistedCount,
    pendingCount: user.pendingCount,
    interviewingCount: user.interviewingCount,
    hiredCount: user.hiredCount,
    rate: user.rate,
  }

  // form component renders by tracking the state of the display width
  const [minWidth, setMinWidth] = useState(window.innerWidth >= 750);
  useEffect(() => {
    setMain("home");
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
  }, [loggedIn, error, updatePendingJobs, setMain]);

  if (loading) {
    return <section className="message">Loading...</section>;
  }

  return (
    <>
      {loggedIn && user?.username ? (
        <>
          {minWidth && (
            <DocForm
              initialValues={{}}
              className={"aside"}
              doc={"job"}
              type={"add"}
            />
          )}
          <DocProfile
            doc={overview}
            className={""}
            title={`${user.username} overview`}
          />
          <JobLists jobs={jobs}/>
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
