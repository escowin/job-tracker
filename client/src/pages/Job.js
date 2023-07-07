import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { QUERY_JOB } from "../utils/queries";
import Auth from "../utils/auth";

function Job() {
    const loggedIn = Auth.loggedIn()
    const { id: _id } = useParams()

    const { loading, data } = useQuery(QUERY_JOB, {
        variables: { id: _id }
    })
    const job = data?.jobApplication || {}
    console.log(job)

    if (loading) {
        return <section>loading...</section>
    }

    return <>test</>
}

export default Job