import { useQuery } from "@apollo/client";
import { QUERY_ME } from "../utils/queries";
import Auth from "../utils/auth";

function Homepage() {
  const loggedIn = Auth.loggedIn();
  const { data: userData } = useQuery(QUERY_ME);
  console.log(userData.me);

  return (
    <>
      <h2>home page</h2>
      {loggedIn && userData ? (
        <section>
          <p>username : {userData.me.username}</p>
          <p>job apps: {userData.me.totalSubmitted}</p>
        </section>
      ) : null}
    </>
  );
}

export default Homepage;
