import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { QUERY_LETTERS } from "../utils/queries";
import Auth from "../utils/auth";
import { format } from "../utils/helpers";
// import DocForm from "../components/DocForm";

function Letters({ setMain }) {
  const loggedIn = Auth.loggedIn();
  // queried variables
  const { loading, data } = useQuery(QUERY_LETTERS);
  const letters = data?.letters || [];

  // state variables
  useEffect(() => setMain("letters"), [setMain]);
  const [selectedLetter, setSelectedLetter] = useState("");
  const selectedLetterData = letters.find((letter) => letter._id === selectedLetter);

  console.log(letters);
  console.log(selectedLetterData);

  if (!loggedIn) {
    return <section>log in to view contents</section>;
  }

  if (loading) {
    return <section className="message">Loading...</section>;
  }

  return (
    <>
      <section className="list-section">
        <h2>Letters</h2>
        <ul id="letters-list">
          {letters.map((letter, i) => (
            <li key={i} onClick={() => setSelectedLetter(letter._id)}>
              <span>{letter.type}</span>
              <span>{format.date(letter.createdAt)}</span>
            </li>
          ))}
        </ul>
      </section>
      <section className="profile-section">
        {selectedLetterData ? (
          <>
          <h2>{selectedLetterData.type} | {selectedLetterData.createdAt}</h2>
          <p>{selectedLetterData.text}</p>
          {/* options: edit, delete */}
          </>
        ) : (<p>Select a letter</p>)}
      </section>
      <section className="form-section">
        letter form. options: save, cancel
      </section>
      {/* <DocForm id={"tbd"} initialValues={letters}/> */}
    </>
  );
}

export default Letters;
