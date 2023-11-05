import { useEffect } from "react";
import DocForm from "../components/DocForm";
import "../assets/css/login.css";

function Login({ doc, type, setMain }) {
  useEffect(() => setMain("login"), [setMain]);

  // dynamically renders ui elements & attributes with props & mapped array objects
  return <DocForm doc={doc} type={type} className={"page"} />;
}

export default Login;
