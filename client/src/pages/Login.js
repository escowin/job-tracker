import { useState } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../utils/mutations";
import Auth from "../utils/auth";

function Login() {
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
    <section>
      <h2>Login</h2>
      <form className="login-form" onSubmit={handleFormSubmit}>
        <label htmlFor="username">username</label>
        <input
          name="username"
          value={formState.username}
          onChange={handleChange}
        />
        <label htmlFor="password">password</label>
        <input
          name="password"
          type="password"
          value={formState.password}
          onChange={handleChange}
        />

        <button type="submit">submit</button>
      </form>
      {error && <p>Login failed</p>}
    </section>
  );
}

export default Login;
