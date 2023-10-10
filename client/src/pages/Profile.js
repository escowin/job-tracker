import { useState } from "react";
import { useQuery } from "@apollo/client";
import { QUERY_PROFILE } from "../utils/queries";
import Auth from "../utils/auth";
import Resume from "../components/Resume";
import "../assets/css/profile.css";
import ProfileDetails from "../components/ProfileDetails";
import ProfileForm from "../components/ProfileForm";
import ResumesList from "../components/ResumesList";

function Profile() {
  const loggedIn = Auth.loggedIn();
  const { loading, data } = useQuery(QUERY_PROFILE);
  const profile = data?.me || {};
  const details = Object.keys(profile).filter(
    (key) =>
      !key.startsWith("_") && key !== "username" && !Array.isArray(profile[key])
  );

  // state variables
  const [selectedResume, setSelectedResume] = useState("");
  const [editSelected, setEditSelected] = useState(false);

  if (loading) {
    return <section className="message">Loading...</section>;
  }

  return (
    <>
      {loggedIn ? (
        <>
          {!editSelected ? (
            <ProfileDetails
              profile={profile}
              details={details}
              setEditSelected={setEditSelected}
            />
          ) : (
            <ProfileForm
              id={profile._id}
              profile={profile}
              details={details}
              setEditSelected={setEditSelected}
            />
          )}
          <ResumesList id={profile._id} profile={profile} setSelectedResume={setSelectedResume}/>
          <Resume resumeId={selectedResume} />
        </>
      ) : (
        <section>log in to view contents</section>
      )}
    </>
  );
}

export default Profile;
