import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { EDIT_USER } from "../utils/mutations";
import { format } from "../utils/helpers";

function ProfileForm(props) {
  const { id, profile, details, setEditSelected } = props;
  const [formState, setFormState] = useState({});
  const [user, { error }] = useMutation(EDIT_USER);

  // populates form state with profile data when component mounts
  useEffect(() => {
    // filters 'profile' object based on the 'details' array
    const filteredProfile = {};
    details.forEach((detail) => (filteredProfile[detail] = profile[detail]));
    // sets the filtered 'profile' object as the initial 'formState'
    setFormState(filteredProfile);
  }, [profile, details]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // updates form state with user input
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      // updates server-side user data through graphql mutation before exiting form component
      await user({ variables: { id, ...formState } });
      setEditSelected(false);
    } catch (err) {
      console.error(err);
    }
  };

  // UI elements & attributes
  const determineType = (detail) => {
    switch (detail) {
      case "phone":
        return "tel";
      case "email":
        return "email";
      default:
        return "text";
    }
  };

  return (
    <section id="profile-section">
      <form onSubmit={handleFormSubmit}>
        <h2>form</h2>
        {details.map((detail, i) => (
          <label key={i} className="wrapper" htmlFor={detail}>
            {format.unCamel(detail)}
            <input
              type={determineType(detail)}
              name={detail}
              id={detail}
              value={formState[detail] || ""}
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
