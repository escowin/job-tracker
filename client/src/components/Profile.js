import { capitalizeFirstLetter } from "../utils/helpers";

function Profile({ user }) {
  // change prop to only pass the username and count properties since this component doesn't need to use the jobs array
  console.log(user.stats)
  return (
    <section className="user-profile details-section">
      <h2>{capitalizeFirstLetter(user.username)} overview</h2>
      {/* <article className="stat">
        <p>pending</p>
        <p className="pending count">{user.pendingCount}</p>
      </article>
      <article className="stat">
        <p>rejected</p>
        <p className="rejected count">{user.rejectedCount}</p>
      </article>
      <article className="stat">
        <p>hired</p>
        <p className="hired count">{user.hiredCount}</p>
      </article>
      <article className="stat">
        <p>total</p>
        <p className="count">{user.totalSubmitted}</p>
      </article>
      <article className="stat">
        <p>rate</p>
        <p>{user.rate}</p>
      </article> */}
    </section>
  );
}

export default Profile;
