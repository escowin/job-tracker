function Profile({ user }) {
  return (
    <section className="user-profile">
      <h2>{user.username}</h2>
      <article>
        <p>pending</p>
        <p className="pending">{user.pendingCount}</p>
      </article>
      <article>
        <p>rejected</p>
        <p className="rejected">{user.rejectedCount}</p>
      </article>
      <article>
        <p>hired</p>
        <p className="hired">{user.hiredCount}</p>
      </article>
      <article>
        <p>submitted</p>
        <p>{user.totalSubmitted}</p>
      </article>
    </section>
  );
}

export default Profile;
