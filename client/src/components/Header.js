import { Link } from "react-router-dom";
import Auth from "../utils/auth";

function Header() {
  const navLinks = [{ name: "add job", path: "add-job", class: "hide-m" }];

  const logout = (e) => {
    e.preventDefault();
    Auth.logout();
  };

  return (
    <header>
      <h1>
        <Link to="/" className="link">job tracker</Link>
      </h1>
      <nav>
        {Auth.loggedIn() ? (
          <>
            {navLinks.map((link, i) => (
              <Link key={i} to={`/${link.path}`} className={`link ${link.class}`}>
                {link.name}
              </Link>
            ))}
            <a href="/" onClick={logout} className="link">
              log out
            </a>
          </>
        ) : (
          <>
            <Link to="/login" className="link">log in</Link>
            <Link to="/signup" className="link">sign up</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
