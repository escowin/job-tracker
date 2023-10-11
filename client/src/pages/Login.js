import { useState } from "react";
import { useMutation } from "@apollo/client";
import { docMutation, format } from "../utils/helpers";
import Auth from "../utils/auth";
import "../assets/css/login.css";

function Login({ doc, type }) {
  const fields = [
    { name: "username", type: "text", min: 1, max: 25 },
    { name: "password", type: "password", min: 5, max: 25 },
  ];
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

  // dyanmically renders ui elements & attributes with props & mapped array objects
  return (
    <section className={`${doc}-form-section`}>
      <h2>{format.title(type)}</h2>
      <form className={`${doc}-form`} onSubmit={handleFormSubmit}>
        {fields.map((field, i) => (
          <label key={i} className="wrapper" htmlFor={field.name}>
            {field.name}
            <input
              name={field.name}
              type={field.type}
              value={formState[field.name]}
              minLength={field.min}
              maxLength={field.max}
              onChange={handleChange}
              required
            />
          </label>
        ))}
        <button type="submit">submit</button>
      </form>
      {error && <p>{format.title(type)} failed</p>}
    </section>
  );
}

export default Login;
