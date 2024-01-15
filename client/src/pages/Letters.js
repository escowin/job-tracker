import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { QUERY_LETTERS } from "../utils/queries";
import Auth from "../utils/auth";
// import DocForm from "../components/DocForm";

function Letters({ setMain }) {
  useEffect(() => setMain("letters"), [setMain]);
  const loggedIn = Auth.loggedIn();
  const { loading, data } = useQuery(QUERY_LETTERS);
  const letters = data?.letters || [];

  console.log(letters);

  if (!loggedIn) {
    return <section>log in to view contents</section>;
  }

  if (loading) {
    return <section className="message">Loading...</section>;
  }

  return (
    <>
      <section>letters list. options: add, edit, delete</section>
      <section>letter profile. options: edit, delete</section>
      <section>letter form. options: save, cancel</section>
      {/* <DocForm id={"tbd"} initialValues={letters}/> */}
    </>
  );
}

export default Letters;
