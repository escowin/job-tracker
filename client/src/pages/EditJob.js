import JobForm from "../components/JobForm";
import { useQuery } from "@apollo/client"
import { QUERY_JOB } from "../utils/queries";

function EditJob() {
  const { loading, data } = useQuery(QUERY_JOB);
  console.log(data)

  if (loading) {
    return <secton>Loading...</secton>
  }
  
  return (
    <>
      <JobForm />
    </>
  );
}

export default EditJob;
