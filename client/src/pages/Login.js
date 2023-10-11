import { useState } from "react";
import { useMutation } from "@apollo/client";
import { docMutation, format } from "../utils/helpers";
import Auth from "../utils/auth";
import "../assets/css/login.css";

function Login({ doc, type }) {
  console.log(doc);
  console.log(type);
  const [formState, setFormState] = useState({ username: "", password: "" });
  const [user, { error }] = useMutation(docMutation(doc, type));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await user({
        variables: { ...formState },
      });
      type === "login"
        ? Auth.login(data.login.token)
        : Auth.login(data.addUser.token);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className={`${doc}-form-section`}>
      <h2>{format.title(type)}</h2>
      <form className={`${doc}-form`} onSubmit={handleFormSubmit}>
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
      {error && <p>{format.title(type)} failed</p>}
    </section>
  );
}

export default Login;
