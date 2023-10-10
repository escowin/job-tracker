import React from "react";
import { useMutation } from "@apollo/client";
import { determineMutation } from "../utils/helpers";
import { QUERY_RESUME } from "../utils/queries";

function ResumeItem({ item, resumeId, arr }) {
  let deletedItemId;
  const resumeItem = item.__typename.toLowerCase();
  const [deleteItem, { error }] = useMutation(
    determineMutation(item.__typename, "delete"),
    {
      update(cache, { data }) {
        const { resume } = cache.readQuery({
          query: QUERY_RESUME,
          variables: { id: resumeId },
        });

        // uses bracket notation to dynamically target corresponding resume array key
        const updatedResume = resume[arr].filter(
          (item) => item._id !== deletedItemId
        );

        // resume query is rewritten with updated resume data
        cache.writeQuery({
          query: QUERY_RESUME,
          variables: { id: resumeId },
          // updated array is dynamically set through bracket notation
          data: { resume: { ...resume, [arr]: updatedResume } },
        });
      },
    }
  );

  // copies profile stat to clipboard when triggered
  const copyDetail = async (data) => {
    try {
      let stat = data;
      await navigator.clipboard.writeText(stat);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (_id) => {
    try {
      // sets id value here in order to filter out item later in cache update
      deletedItemId = _id;
      await deleteItem({ variables: { resumeId: resumeId, id: _id } });
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

      <button
        className="delete-btn warning"
        onClick={() => handleDelete(item._id)}
      >
        {error ? "error" : "delete"}
      </button>
    </div>
  );
}

export default ResumeItem;