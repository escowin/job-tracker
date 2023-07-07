import { useQuery } from "@apollo/client";
import { QUERY_ME } from "../utils/queries";
import Auth from "../utils/auth";
import Profile from "../components/Profile";
import JobApplication from "../components/JobApplication";

function Homepage() {
  // user info is dependent in being logged in
  const loggedIn = Auth.loggedIn();
  const { loading, data } = useQuery(QUERY_ME);
  const user = data?.me || {};

  
  if (loading) {
    return <section>Loading...</section>;
  }

  return (
    <>      
      {!loggedIn && !user ? <section>log in to view contents</section> : null}
      {loggedIn && user ? (
        <>
          <Profile user={user}/>
          <JobApplication jobApplications={user.jobApplications} />
        </>
      ) : null}
    </>
  );
}

export default Homepage;
