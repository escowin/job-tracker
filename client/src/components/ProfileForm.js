import { format } from "../utils/helpers";

function ProfileForm(props) {
  const { id, profile, details, setEditSelected } = props;
  //   console.log(props);
  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("form submission");

    try {
      setEditSelected(false);
    } catch (err) {
      console.error(err);
    }
  };

  console.log(details);
  return (
    <section id="profile-section">
      <form onSubmit={handleFormSubmit}>
        <h2>form</h2>
        {details.map((detail, i) => (
          <label key={i} className="wrapper" htmlFor={detail}>
            {format.unCamel(detail)}
            <input
              type="input"
              name={detail}
              id={detail}
              value={profile[detail]}
            />
          </label>
        ))}

        <button>save</button>
      </form>
    </section>
  );
}

export default ProfileForm;
