// SEQUENCE:
// 1. Import necessary helper function 'format' for UI display.
// 2. Extract necessary props from the component's props parameter.
// 3. Set the variable 'DOC' string value as the lowercase version of 'doc.__typename' to convey its mongodb origins.
// 4. Initialize an empty object 'details' to store details.
// 5. Initialize 'detailsKey' variable.
// 6. Define a function 'commonConditions' that checks for certain conditions based on the document and key.
// 7. Iterate through the keys in 'doc' using a for loop.
// 8. Inside the loop, handle different cases based on the 'DOC'.
// 9. Return a section component containing formatted details based on the 'DOC' and 'details' object.

// IF-THEN-ELSE:
// - Conditionally check for specific keys and handle them differently based on the 'DOC'.

// FOR:
// - Loop over the 'Object.entries(details)' to render each detail.

import { format } from "../utils/helpers";

function DocProfile({ doc, title, className }) {
  // Variables name set to uppercase to reflect database origins.
  // Value set to lowercase for coding simplicity.
  const DOC = doc.__typename.toLowerCase();

  const details = {};
  let detailsKey;
  const commonConditions = (doc, key) => {
    return !Array.isArray(doc[key]) && !key.startsWith("_");
  };

  // Loops through each key-value of the 'doc' object
  for (let key in doc) {
    detailsKey = key.replace("Count", "");
    // Conditionally composes the 'details' object key-values to mirror 'doc' object key-values through bracket notation
    switch (DOC) {
      case "user":
        if (commonConditions(doc, key) && !key.startsWith("username")) {
          details[detailsKey] = doc[key];
        }
        break;
      case "job":
        if (
          commonConditions(doc, key) &&
          !key.startsWith("role") &&
          !key.startsWith("note")
        ) {
          details[detailsKey] = doc[key];
        }
        break;
      // Error handling
      default:
        console.error("invalid case: " + DOC);
    }
  }

  // Dynamically renders scalable UI elements & attributes
  return (
    <section className="details-section profile-section" id={`${DOC}-profile`}>
      <h2 className={className}>{format.title(title)}</h2>
      {Object.entries(details).map(([key, value], i) => (
        <article
          key={i}
          className={`${DOC}-detail ${
            DOC === "user" && format.camelToKebab(key)
          }`}
        >
          <h3>{format.title(format.unCamel(key))}</h3>

          <p className={className}>
            {key !== "applied" ? `${value}` : format.date(value)}
          </p>
        </article>
      ))}
    </section>
  );
}

export default DocProfile;
