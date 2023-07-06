import { useQuery } from "@apollo/client";
import { QUERY_ME } from "../utils/queries";
import Auth from "../utils/auth";

function Homepage() {
  // user info is dependent in being logged in
  const loggedIn = Auth.loggedIn();
  const { loading, data } = useQuery(QUERY_ME);
  const user = data?.me || {};

  if (loading) {
    return <section>Loading...</section>;
  }

  // change sections into components with user data props
  return (
    <>
      
      {!loggedIn ? <section>log in to view contents</section> : null}
      {loggedIn && user ? (
        <>
          <section>
            <h2>user info</h2>
            <article>
              <p>username : {user.username}</p>
              <p>hired count: {user.hiredCount}</p>
              <p>rejected count: {user.rejectedCount}</p>
              <p>total submitted: {user.totalSubmitted}</p>
            </article>
          </section>

          <section>
            <h2>job applications</h2>
            {user.jobApplications.map((job, i) => (
              <article key={i}>
                <p>{job.company}</p>
                <p>{job.role}</p>
                <p>{job.status}</p>
                <p>{job.dateSubmitted}</p>
              </article>
            ))}
          </section>
        </>
      ) : null}
    </>
  );
}

export default Homepage;
