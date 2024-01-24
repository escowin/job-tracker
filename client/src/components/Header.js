import { Link } from "react-router-dom";
import Auth from "../utils/auth";
import { useState, useEffect } from "react";
import { format } from "../utils/helpers";

function Header() {
  const navLinks = [
    { name: "add job", path: "add-job", class: "hide-m" },
    { name: "profile", path: "profile", class: "" },
    { name: "letters", path: "letters", class: "" },
  ];
  const [currentLink, setCurrentLink] = useState("");

  const logout = (e) => {
    e.preventDefault();
    handleLinkClick();
    Auth.logout();
  };

  useEffect(() => {
    if (currentLink) {
      document.title = currentLink;
    }
  }, [currentLink]);

  const handleLinkClick = (name) => {
    name ? setCurrentLink(format.title(name)) : setCurrentLink("Job Tracker");
  };

  return (
    <header>
      <h1>
        <Link to="/" className="link" onClick={() => handleLinkClick()}>
          job tracker
        </Link>
      </h1>
      <nav>
        {Auth.loggedIn() ? (
          <>
            {navLinks.map((link, i) => (
              <Link
                key={i}
                to={`/${link.path}`}
                className={`link ${link.class}`}
                onClick={() => handleLinkClick(link.name)}
              >
                {link.name}
              </Link>
            ))}
            <a href="/" onClick={logout} className="link">
              log out
            </a>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="link"
              onClick={() => handleLinkClick("log in")}
            >
              log in
            </Link>
            <Link
              to="/signup"
              className="link"
              onClick={() => handleLinkClick("sign up")}
            >
              sign up
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
