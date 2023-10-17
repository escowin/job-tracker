import { format } from "../utils/helpers";

function JobProfile({ doc, title, className }) {
  const docType = doc.__typename.toLowerCase();
  // object dynamically matches fields of document prop to strengthen component reusability
  const details = {};
  for (let key in doc) {
    if (!Array.isArray(doc[key]) && !key.startsWith("_")) {
      details[key] = doc[key];
    }
  }
  console.log(details);

  // const jobStats = [
  //   { value: job?.company, label: "Company" },
  //   { value: job?.source, label: "Source" },
  //   { value: job?.status, label: "Status" },
  //   { value: job?.interviewCount, label: "Interviews" },
  //   { value: job?.applied, label: "Applied" },
  // ];

  // doc objects w/ array keys
  // user    | jobs, resumes
  // job     | notes (sub-doc)
  // resumes | edu, exp, links, letters (sub-docs)

  // job key-values
  // string | company, role, status, source, applied
  // num    | interviewCount, noteCount

  // to do: use props to set h2 element attributes & text
  // resolve: define the className attribute when this object contains a `status` key
  return (
    <section className="details-section profile-section" id={`${docType}-profile`}>
      <h2 className={className}>{title}</h2>
      {Object.entries(details).map(([key, value], i) => (
        <article key={i} className={`${docType}-detail`}>
          <h3>{key}</h3>
          <p className={key === "status" ? `${value}` : ''}>
            {key !== "applied" ? `${value}` : format.date(value)}
          </p>
        </article>
      ))}
      {/* {jobStats.map((stat, i) => (
        <article key={i} className="job-detail">
          <h3>{stat.label}</h3>
          <p className={job.status}>
            {stat.value !== job?.applied ? stat.value : format.date(stat.value)}
          </p>
        </article>
      ))} */}
    </section>
  );
}

export default JobProfile;
