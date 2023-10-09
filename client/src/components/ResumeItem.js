import React from "react";

function ResumeItem({ item }) {
  const resumeItem = item.__typename.toLowerCase();
//   console.log(resumeItem)
  // copies profile stat to clipboard when triggered
  const copyDetail = async (data) => {
    try {
      let stat = data;
      await navigator.clipboard.writeText(stat);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={resumeItem}>
      {resumeItem === "link" ? (
        <>
          <button onClick={() => copyDetail(item.url)}>copy</button>
          <p>{item.link}</p>
        </>
      ) : (
        <>
          {Object.entries(item)
            .filter(([key]) => !key.startsWith("_"))
            .map(([key, value], j) => (
              <React.Fragment key={j}>
                <button onClick={() => copyDetail(value)}>copy</button>
                <p style={{ whiteSpace: "pre-line" }}>{value}</p>
              </React.Fragment>
            ))}
        </>
      )}

      <button className="delete-btn" onClick={() => console.log(item._id)}>
        delete
      </button>
    </div>
  );
}

export default ResumeItem;
