import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "./css/navbar.css";
import { allSuggestions } from "./suggestions";
import auth from "./authservice";
const CustomNavLink = ({ to, children }) => {
  const location = useLocation();

  const url = new URL(to, window.location.origin);
  const targetPath = url.pathname;
  const targetSearch = new URLSearchParams(url.search);
  const currentSearch = new URLSearchParams(location.search);

  const isPathMatch = location.pathname === targetPath;

  // Check if all targetSearch params exist and match in currentSearch
  let isQueryMatch = true;
  for (const [key, value] of targetSearch.entries()) {
    if (currentSearch.get(key) !== value) {
      isQueryMatch = false;
      break;
    }
  }

  const isActive = isPathMatch && isQueryMatch;

  return (
    <NavLink className={isActive ? "nav-link there" : "nav-link"} to={to}>
      {children}
    </NavLink>
  );
};

function Navbar() {
  const [quy, setQ] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();
  const [isFixed, setIsFixed] = useState(true);
  const [user, setUser] = useState();
  useEffect(() => {
    const updateUser = () => {
      setUser(auth.getUser());
    };
    updateUser();
    window.addEventListener("userChanged", updateUser);
    return () => {
      window.removeEventListener("userChanged", updateUser);
    };
  }, []);

  useEffect(() => {
    const navbarCollapse = document.getElementById("navbarSupportedContent");
    const handleShow = () => setIsFixed(false);
    const handleHide = () => setIsFixed(true);

    navbarCollapse?.addEventListener("show.bs.collapse", handleShow);
    navbarCollapse?.addEventListener("hide.bs.collapse", handleHide);

    return () => {
      navbarCollapse?.removeEventListener("show.bs.collapse", handleShow);
      navbarCollapse?.removeEventListener("hide.bs.collapse", handleHide);
    };
  }, []);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setQ(value);

    if (value.trim() === "") {
      setSuggestions([]);
    } else {
      const filtered = allSuggestions.filter((item) =>
        item.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();
    if (quy.trim() !== "") {
      setSuggestions([]);
      navigate(`/books?q=${encodeURIComponent(quy)}`);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQ(suggestion);
    setSuggestions([]);
    navigate(`/books?q=${encodeURIComponent(suggestion)}`);
  };

  return (
    <nav
      className={`navbar navbar-expand-lg bg-body-tertiary ${
        isFixed ? "fixed-top" : ""
      }`}
    >
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="#">
          <img className="logo" src="onlibooks.png" alt="logo" />
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  isActive ? "nav-link there" : "nav-link"
                }
                aria-current="page"
                to="/"
                end
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <CustomNavLink to="/books?q=Harry Potter">
                Harry Potter
              </CustomNavLink>
            </li>
            <li className="nav-item">
              <CustomNavLink to="/books?q=Premchand">Premchand</CustomNavLink>
            </li>
            <li className="nav-item dropdown">
              <NavLink
                className="nav-link dropdown-toggle"
                to="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Books
              </NavLink>
              <ul className="dropdown-menu">
                <li className="nav-item">
                  <CustomNavLink to="/books?q=Amitav Ghosh">
                    Amitav Ghosh
                  </CustomNavLink>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li className="nav-item">
                  <CustomNavLink to="/books?q=Anita Desai">
                    Anita Desai
                  </CustomNavLink>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li className="nav-item">
                  <CustomNavLink to="/books?q=Kiran Desai">
                    Kiran Desai
                  </CustomNavLink>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li className="nav-item">
                  <CustomNavLink to="/books?q=Chetan Bhagat">
                    Chetan Bhagat
                  </CustomNavLink>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li className="nav-item">
                  <CustomNavLink to="/books?q=Rabindranath Tagore">
                    Rabindranath Tagore
                  </CustomNavLink>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li className="nav-item">
                  <CustomNavLink to="/books?q=Jane Austen">
                    Jane Austen
                  </CustomNavLink>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <CustomNavLink className="nav-link" to="/My Books">
                My Books
              </CustomNavLink>
            </li>
            <li className="nav-item">
              <CustomNavLink className="nav-link" to="/Settings">
                Settings
              </CustomNavLink>
            </li>
            <li className="nav-item">
              <CustomNavLink className="nav-link" to={user ? "/" : `/Login`}>
                {user ? user : `Login`}
              </CustomNavLink>
            </li>
            {user ? (
              <li className="nav-item">
                <CustomNavLink className="nav-link" to="/logout">
                  {`Logout`}
                </CustomNavLink>
              </li>
            ) : (
              ""
            )}
          </ul>

          {/* Search Form with Suggestion Help Text */}
          <form className="d-flex position-relative" onSubmit={handleSearch}>
            <div className="position-relative w-100">
              <input
                className="form-control me-2"
                type="search"
                placeholder=" 🔍 Search books..."
                aria-label="Search"
                value={quy}
                onChange={handleInputChange}
                onBlur={() => setTimeout(() => setSuggestions([]), 100)}
              />
              {suggestions.length > 0 && (
                <ul className="list-group position-absolute w-100 z-3">
                  {suggestions.map((s, idx) => (
                    <li
                      key={idx}
                      className="list-group-item list-group-item-action"
                      onClick={() => handleSuggestionClick(s)}
                      style={{ cursor: "pointer" }}
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button className="btn btn-outline-success" type="submit">
              Search
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
