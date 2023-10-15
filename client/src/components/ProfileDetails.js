import { format } from "../utils/helpers";

function ProfileDetails({ profile, details, setEditSelected }) {
  const copyDetail = async (data) => {
    try {
      let stat = data;
      await navigator.clipboard.writeText(stat);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = () => setEditSelected(true);

  return (
    <section id="profile-section">
      <h2>{profile.username} details</h2>
      {details.map((detail, i) => (
        <article key={i} className="profile-detail">
          <h3>{format.unCamel(detail)}</h3>
          <p>{profile[detail]}</p>
          <button onClick={() => copyDetail(profile[detail])}>copy</button>
        </article>
      ))}
      <button onClick={handleEdit}>edit</button>
    </section>
  );
}

export default ProfileDetails;
