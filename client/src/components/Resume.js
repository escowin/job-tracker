import { useQuery } from "@apollo/client";
import { QUERY_RESUME } from "../utils/queries";

function Resume({ resumeId }) {
  const _id = resumeId;
  const { loading, data } = useQuery(QUERY_RESUME, {
    variables: { id: _id },
  });
  const resume = data?.resume || {};
  console.log(_id);
  console.log(resume);

  if (loading) {
    return <section>loading</section>;
  }

  return <section>resume</section>;
}

export default Resume;
