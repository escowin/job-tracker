function Profile({user}) {
    console.log(user)
  return (
    <section>
      <h2>user info</h2>
      <article>
        <p>username : {user.username}</p>
        <p>hired count: {user.hiredCount}</p>
        <p>rejected count: {user.rejectedCount}</p>
        <p>total submitted: {user.totalSubmitted}</p>
      </article>
    </section>
  );
}

export default Profile;
