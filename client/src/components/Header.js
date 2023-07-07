import { Link } from "react-router-dom";
import Auth from "../utils/auth";

function Header() {
  const navLinks = [
    { name: "home", path: "" },
    { name: "add-job", path: "add-job" },
  ];

  const logout = (e) => {
    e.preventDefault();
    Auth.logout();
  };

  return (
    <header>
      <h1>
        <Link to="/">job tracker</Link>
      </h1>
      <nav>
        {Auth.loggedIn() ? (
          <>
            {navLinks.map((link, i) => (
              <Link key={i} to={`/${link.path}`}>
                {link.name}
              </Link>
            ))}
            <a href="/" onClick={logout}>
              log out
            </a>
          </>
        ) : (
          <>
            <Link to={"/login"}>log in</Link>
            <Link to={"/signup"}>sign up</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
