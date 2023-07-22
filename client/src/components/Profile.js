import { capitalizeFirstLetter } from "../utils/helpers";

function Profile({ user }) {
  const stats = user.stats;

  return (
    <section className="user-profile details-section">
      <h2>{capitalizeFirstLetter(user.username)} overview</h2>
      {stats.map((stat, i) => (
        <article key={i} className="stat">
          <p>{stat.label}</p>
          <p className={`${stat.label} count`}>{stat.value}</p>
        </article>
      ))}
    </section>
  );
}

export default Profile;
