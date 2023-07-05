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
      <h2>home page</h2>
      {!loggedIn ? <section>log in to view contents</section> : null}
      {loggedIn && user ? (
        <>
          <section>
            <p>username : {user.username}</p>
            <p>hired count: {user.hiredCount}</p>
            <p>rejected count: {user.rejectedCount}</p>
            <p>total submitted: {user.totalSubmitted}</p>
          </section>

          <section>
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
