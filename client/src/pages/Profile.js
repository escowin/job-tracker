import { useState } from "react";
import { useQuery } from "@apollo/client";
import { QUERY_PROFILE } from "../utils/queries";
import Auth from "../utils/auth";
import Resume from "../components/Resume";

function Profile() {
  const loggedIn = Auth.loggedIn();
  const { loading, data } = useQuery(QUERY_PROFILE);
  const profile = data?.me || {};
  const details = [
    { stat: "first name", data: profile.firstName },
    { stat: "last name", data: profile.lastName },
    { stat: "email", data: profile.email },
    { stat: "phone", data: profile.phone },
    { stat: "location", data: profile.location },
    { stat: "current company", data: profile.currentCompany },
  ];

  // state variables
  const [selectedResume, setSelectedResume] = useState("");

  // copies profile stat to clipboard when triggered
  const copyDetail = async (data) => {
    try {
      let stat = data;
      await navigator.clipboard.writeText(stat);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <section className="message">Loading...</section>;
  }

  return (
    <>
      {loggedIn ? (
        <>
          <section className="profile-section">
            <h2>{profile.username} details</h2>
            {details.map((detail, i) => (
              <article key={i} className="profile-detail">
                <p>{detail.stat}</p>
                <p>{detail.data}</p>
                <button onClick={() => copyDetail(detail.data)}>copy</button>
              </article>
            ))}
            <button onClick={() => console.log("edit details")}>edit</button>
          </section>
          <section id="resumes">
            <h2>resumes</h2>
            {profile.resumes.map((resume, i) => (
              <button key={i} onClick={() => setSelectedResume(resume._id)}>
                {resume.title}
              </button>
            ))}
          </section>
          <Resume resumeId={selectedResume} />
        </>
      ) : (
        <section>log in to view contents</section>
      )}
    </>
  );
}

export default Profile;
