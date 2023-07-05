import { useQuery } from "@apollo/client";
import { QUERY_ME } from "../utils/queries";
import Auth from "../utils/auth";

function Homepage() {
  // const { loading, data } = useQuery(QUERY_ME);
  // const user = data?.user || [];
  const loggedIn = Auth.loggedIn();
  const { data } = useQuery(QUERY_ME);
  console.log(data)
  console.log(loggedIn)

  return (
    <>
      <h2>home page</h2>
      <section>
        {/* <p>username : {userData.me.username}</p>
        <p>job apps: {userData.me.jobApplications.length}</p> */}
      </section>
    </>
  );
}

export default Homepage;
