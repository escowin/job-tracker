import { format } from "../utils/helpers";

function JobProfile({ doc, title, className }) {
  const docType = doc.__typename.toLowerCase();
  // object dynamically matches fields of document prop to strengthen component reusability

  // to-do (in order to replace UserStats component):
  // - rename `TotalSubmitted` to `TotalCount` across client & server to keep newKey simple
  // - filter out `username` from keys
  // - use conditionals to handle doc-specific details
  // - fold .details-section into .profile-section for common styles. use id attribute to maintain stylistic differences 

  const details = {};
  for (let key in doc) {
    if (
      !Array.isArray(doc[key]) &&
      !key.startsWith("_") &&
      !key.startsWith("note") &&
      !key.startsWith("role")
    ) {
      let newKey = key.replace("Count", "")
      details[newKey] = doc[key]
    }
  }

  return (
    <section
      className="details-section profile-section"
      id={`${docType}-profile`}
    >
      <h2 className={className}>{format.title(title)}</h2>
      {Object.entries(details).map(([key, value], i) => (
        <article key={i} className={`${docType}-detail`}>
          <h3>{format.title(key)}</h3>
          <p className={className}>
            {key !== "applied" ? `${value}` : format.date(value)}
          </p>
        </article>
      ))}
    </section>
  );
}

export default JobProfile;
