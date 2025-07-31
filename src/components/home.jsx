import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { allSuggestions } from "./suggestions";
import "./css/home.css";

function Home() {
  const [q, setQ] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const value = event.target.value;
    setQ(value);

    if (value.trim() === "") {
      setFilteredSuggestions([]);
    } else {
      const filtered = allSuggestions.filter((item) =>
        item.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQ(suggestion);
    setFilteredSuggestions([]);
    navigate(`/books?q=${encodeURIComponent(suggestion)}`);
  };

  const handleSearch = () => {
    if (q.trim() !== "") {
      setFilteredSuggestions([]);
      navigate(`/books?q=${encodeURIComponent(q)}`);
    }
  };

  return (
    <div className="container home-top">
      <img
        src="./onlibooks.jpeg"
        className="rounded-circle mx-auto d-block homeImage"
        alt=""
      />
      <div className="container my-4">
        <div className="row justify-content-center">
          <div className="col-md-8 position-relative">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <FaSearch />
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search for books..."
                value={q}
                onChange={handleInputChange}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                onBlur={() => setTimeout(() => setFilteredSuggestions([]), 100)}
              />
              <button
                className="btn btn-primary"
                type="button"
                onClick={handleSearch}
              >
                Search
              </button>
            </div>
            {filteredSuggestions.length > 0 && (
              <ul className="list-group position-absolute w-75 z-3">
                {filteredSuggestions.slice(0, 5).map((s, idx) => (
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
        </div>
      </div>
    </div>
  );
}

export default Home;
