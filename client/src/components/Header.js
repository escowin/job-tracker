import { Link } from "react-router-dom";
import Auth from "../utils/auth";

function Header() {
  const navLinks = [{ name: "home", path: "" }];

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
              Logout
            </a>
          </>
        ) : (
          <>
            <Link to={"/login"}>Login</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
