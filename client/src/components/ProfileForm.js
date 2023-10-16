import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { docMutation, form, format } from "../utils/helpers";

function ProfileForm(props) {
  const { id, profile, setEditSelected, doc, type } = props;
  // retrieves form fields dynamically based on the sub-document via bracket notation
  const formFields = form[doc];

  // dynamically sets up server graphql mutation & error handling
  const [user, { error }] = useMutation(docMutation(doc, type));

  // sets up form state management
  const [formState, setFormState] = useState({});

  // populates form state with profile data when component mounts
  useEffect(() => {
    // filters 'profile' object based on the 'details' array
    const filteredProfile = {};
    formFields.forEach((field) => (filteredProfile[field.name] = profile[field.name]));
    // sets the filtered 'profile' object as the initial 'formState'
    setFormState(filteredProfile);
  }, [profile, formFields]);

  // handles changes in input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // handles form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      // sends data from client to server
      await user({ variables: { id, ...formState } });
      setEditSelected(false);
    } catch (err) {
      console.error(err);
    }
  };

  // renders appropriate UI elements and attributes based on the formFields array
  return (
    <section id="profile-section">
      <form onSubmit={handleFormSubmit}>
        <h2>form</h2>
        {formFields.map((field, i) => (
          <label key={i} htmlFor={field.name}>
            {format.unCamel(field.name)}
            <input
              type={field.type}
              name={field.name}
              id={field.name}
              value={formState[field.name] || ""}
              minLength={field.min ? field.min : null}
              maxLength={field.max ? field.max : null}
              onChange={handleChange}
            />
          </label>
        ))}
        <button>save</button>
        {error && <span>error</span>}
      </form>
    </section>
  );
}

export default ProfileForm;
