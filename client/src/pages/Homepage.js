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

  return (
    <>
      <h2>home page</h2>
      {loggedIn && user ? (
        <section>
          <p>username : {user.username}</p>
          <p>hired count: {user.hiredCount}</p>
          <p>rejected count: {user.rejectedCount}</p>
          <p>total submitted: {user.totalSubmitted}</p>
        </section>
      ) : (
        <section>logged out homepage</section>
      )}
    </>
  );
}

export default Homepage;
