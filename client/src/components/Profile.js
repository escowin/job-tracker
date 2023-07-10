function Profile({ user }) {
  return (
    <section className="user-profile">
      <h2>{user.username} overview</h2>
      <article>
        <p>pending</p>
        <p className="pending count">{user.pendingCount}</p>
      </article>
      <article>
        <p>rejected</p>
        <p className="rejected count">{user.rejectedCount}</p>
      </article>
      <article>
        <p>hired</p>
        <p className="hired count">{user.hiredCount}</p>
      </article>
      <article>
        <p>total</p>
        <p className="count">{user.totalSubmitted}</p>
      </article>
      <article>
        <p>rate</p>
        <p>{user.rate}</p>
      </article>
    </section>
  );
}

export default Profile;
