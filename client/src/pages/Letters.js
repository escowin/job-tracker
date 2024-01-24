import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { QUERY_LETTERS } from "../utils/queries";
import Auth from "../utils/auth";
import { format } from "../utils/helpers";
import DocForm from "../components/DocForm";
import "../assets/css/letters.css"

function Letters({ setMain }) {
  const loggedIn = Auth.loggedIn();
  // queried variables
  const { loading, data } = useQuery(QUERY_LETTERS);
  const letters = data?.letters || [];

  // state variables
  useEffect(() => setMain("letters"), [setMain]);
  const [selectedLetter, setSelectedLetter] = useState("");
  const [displayForm, setDisplayForm] = useState(false);

  const selectedLetterData = letters.find(
    (letter) => letter._id === selectedLetter
  );

  const handleClick = (type) => {
    console.log(`clicked ${type}`);

    switch (type) {
      case "add":
        console.log(`logic ${type}`);
        setDisplayForm(true)
        break;
      case "edit":
        console.log(`logic ${type}`);
        setDisplayForm(true)
        break;
      case "delete":
        console.log(`logic ${type}`);
        break;
      default:
        console.log(`invalid ${type}`);
    }
  };

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
        <button onClick={() => handleClick("add")}>add</button>
        <ul id="letters-list">
          {letters.map((letter, i) => (
            <li key={i} onClick={() => setSelectedLetter(letter._id)}>
              <span>{letter.type}</span>
              <span>{format.date(letter.createdAt)}</span>
            </li>
          ))}
        </ul>
      </section>
      {!displayForm ? (
        <section className="profile-section">
          {selectedLetterData ? (
            <>
              <h2>
                {selectedLetterData.type} | {selectedLetterData.createdAt}
              </h2>
              <p>{selectedLetterData.text}</p>
              <div>
                <button onClick={() => handleClick("edit")}>edit</button>
                <button onClick={() => handleClick("delete")}>delete</button>
              </div>
            </>
          ) : (
            <p>Select a letter</p>
          )}
        </section>
      ) : (
        <DocForm id={""} initialValues={""} doc={"letter"} type={"add"} className={"add"}/>
      )}
    </>
  );
}

export default Letters;
