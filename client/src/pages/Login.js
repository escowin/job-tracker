import { useState } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../utils/mutations";
import Auth from "../utils/auth";
import "../assets/css/login.css";

function Login({doc, type}) {
  const [formState, setFormState] = useState({ username: "", password: "" });
  const [login, { error }] = useMutation(LOGIN_USER);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await login({
        variables: { ...formState },
      });
      Auth.login(data.login.token);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="login-section">
      <h2>Login</h2>
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
      {error && <p>Login failed</p>}
    </section>
  );
}

export default Login;
