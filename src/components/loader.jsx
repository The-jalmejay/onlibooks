import React from "react";
import "./css/loader.css"; 

const Loader = () => {
  return (
    <section className="loader-section">
      <div className="dots">
        {Array.from({ length: 15 }, (_, i) => (
          <span key={i} style={{ "--i": i + 1 }}></span>
        ))}
      </div>
    </section>
  );
};

export default Loader;
