import DocForm from "../components/DocForm";
import "../assets/css/login.css";

function Login({ doc, type }) {
  console.log(doc)

  // dyanmically renders ui elements & attributes with props & mapped array objects
  return (
    <DocForm doc={doc} type={type} className={"page"} />
  );
}

export default Login;
