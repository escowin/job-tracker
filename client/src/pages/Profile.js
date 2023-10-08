import { useState } from "react";
import { useQuery } from "@apollo/client";
import { QUERY_PROFILE } from "../utils/queries";
import Auth from "../utils/auth";
import Resume from "../components/Resume";
import "../assets/css/profile.css";

function Profile() {
  const loggedIn = Auth.loggedIn();
  const { loading, data } = useQuery(QUERY_PROFILE);
  const profile = data?.me || {};
  const details = Object.keys(profile).filter(
    (key) =>
      key !== "__typename" &&
      key !== "_id" &&
      key !== "username" &&
      !Array.isArray(profile[key])
  );
  console.log(details)

  // state variables
  const [selectedResume, setSelectedResume] = useState("");
  // const [selectedEdit, setSelectedEdit] = useState(false)

  // copies profile stat to clipboard when triggered
  const copyDetail = async (data) => {
    try {
      let stat = data;
      console.log(stat);
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
          <section id="profile-section">
            <h2>{profile.username} details</h2>
            {details.map((detail, i) => (
              <article key={i} className="profile-detail">
                <h3>{detail}</h3>
                <p>{profile[detail]}</p>
                <button onClick={() => copyDetail(profile[detail])}>
                  copy
                </button>
              </article>
            ))}
            <button onClick={() => console.log("edit details")}>edit</button>
          </section>

          <section id="resumes-section">
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
