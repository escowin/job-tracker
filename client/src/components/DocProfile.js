import { format } from "../utils/helpers";

function DocProfile({ doc, title, className }) {
  const docType = doc.__typename.toLowerCase();

  // object dynamically matches fields of document prop to strengthen component reusability
  const details = {};
  let detailsKey;
  const commonConditions = (doc, key) => {
    return !Array.isArray(doc[key]) && !key.startsWith("_");
  };

  for (let key in doc) {
    detailsKey = key.replace("Count", "");
    switch (docType) {
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
      default:
        console.log("invalid case: " + docType);
    }
  }

  return (
    <section
      className="details-section profile-section"
      id={`${docType}-profile`}
    >
      <h2 className={className}>{format.title(title)}</h2>
      {Object.entries(details).map(([key, value], i) => (
        <article
          key={i}
          className={`${docType}-detail ${
            docType === "user" && format.camelToKebab(key)
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
