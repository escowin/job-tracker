import { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_JOB_APPLICATION } from "../utils/mutations";
import { QUERY_ME } from "../utils/queries";

function JobForm() {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [dateSubmitted, setDateSubmitted] = useState("");

  const [addJobApplication, { error }] = useMutation(ADD_JOB_APPLICATION, {
    update(cache, { data: { addJobApplication } }) {
      try {
        const { me } = cache.readQuery({ query: QUERY_ME });
        cache.writeQuery({
          query: QUERY_ME,
          data: {
            me: {
              ...me,
              jobApplications: [...me.jobApplications, addJobApplication],
            },
          },
        });
      } catch (err) {
        console.warn("first job app submitted by user");
      }
    },
  });

  //  captures & sets form state
  const handleChange = (e) => {
    if (e.target.name === "company") {
      setCompany(e.target.value);
    } else if (e.target.name === "role") {
      setRole(e.target.value);
    } else if (e.target.name === "date-submitted") {
      setDateSubmitted(e.target.value);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      await addJobApplication({
        variables: {
          company,
          role,
          dateSubmitted,
        },
      });

      setCompany("");
      setRole("");
      setDateSubmitted("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <h2>job application</h2>
      <form onSubmit={handleFormSubmit}>
        <label htmlFor="company">Company</label>
        <input name="company" onChange={handleChange} />
        <label htmlFor="role">Role</label>
        <input name="role" onChange={handleChange} />
        <label htmlFor="date-submitted">Date submitted</label>
        <input name="date-submitted" type="date" onChange={handleChange} />

        <button type="submit">submit</button>
      </form>
    </>
  );
}

export default JobForm;
