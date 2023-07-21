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
  const minWidth = window.innerWidth >= 1024;

  if (loading) {
    return <section className="message">Loading...</section>;
  }

  return (
    <>
      {loggedIn && user?.username ? (
        <>
          <Profile user={user} />
          {minWidth && <JobForm initialValues={{}} title={"add job"} />}
          <JobLists jobs={jobs} />
        </>
      ) : (
        <section className="message"><Link to="/login">log in</Link> to view contents</section>
      )}
    </>
  );
}

export default Home;
