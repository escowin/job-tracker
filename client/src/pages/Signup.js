// consolidate page w/ login. use props to determine login & sign up logic
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_USER } from "../utils/mutations";
import Auth from "../utils/auth";

function Signup() {
  const [formState, setFormState] = useState({ username: "", password: "" });
  const [addUser, { error }] = useMutation(ADD_USER);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await addUser({
        variables: { ...formState },
      });
      Auth.login(data.addUser.token);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="login-section">
      <h2>Sign up</h2>
      <form className="login-form" onSubmit={handleFormSubmit}>
        <article className="wrapper">
          <label htmlFor="username">username</label>
          <input
            name="username"
            value={formState.username}
            onChange={handleChange}
          />
        </article>
        <article className="wrapper">
          <label htmlFor="password">password</label>
          <input
            name="password"
            type="password"
            value={formState.password}
            onChange={handleChange}
          />
        </article>

        <article className="wrapper">
          <button type="submit">submit</button>
        </article>
      </form>
      {error && <p>Sign up failed</p>}
    </section>
  );
}

export default Signup;
