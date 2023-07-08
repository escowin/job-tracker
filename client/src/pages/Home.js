import { useQuery } from "@apollo/client";
import { QUERY_ME } from "../utils/queries";
import Auth from "../utils/auth";
import Profile from "../components/Profile";
import JobLists from "../components/JobsList";
import "../assets/css/home.css"

function Home() {
  // user info is dependent in being logged in
  const loggedIn = Auth.loggedIn();
  const { loading, data } = useQuery(QUERY_ME);
  const user = data?.me || {};
  const jobApplications = user?.jobApplications || [];

  if (loading) {
    return <section>Loading...</section>;
  }

  return (
    <>
      {loggedIn && user ? (
        <>
          <Profile user={user} />
          <JobLists jobApplications={jobApplications} />
        </>
      ) : (
        <section>log in to view contents</section>
      )}
    </>
  );
}

export default Home;
