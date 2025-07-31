import React, { useState } from "react";
import "./css/leftOptionPanel.css"
const LeftOptionPanel = ({ options, onOptionChange, checkOption }) => {
  const [langArr] = useState([
    { display: "English", value: "en" },
    { display: "French", value: "fr" },
    { display: "Hindi", value: "hi" },
    { display: "Spanish", value: "es" },
    { display: "Chinese", value: "zh" },
  ]);

  const [filterArr] = useState([
    { display: "Full Volume", value: "full" },
    { display: "Partial Volume", value: "partial" },
    { display: "Free Google e-book", value: "free-ebooks" },
    { display: "Paid Google e-book", value: "paid-ebooks" },
  ]);

  const [printArr] = useState([
    { display: "All", value: "all" },
    { display: "Books", value: "books" },
    { display: "Magazines", value: "magazines" },
  ]);

  const [orderArr] = useState(["newest", "relevance"]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newOptions = {
      ...options,
      [name]: value,
      startIndex: 0,
      maxResults: checkOption.maxResults,

    };
    onOptionChange(newOptions);
  };

  const makeRadioboxes = (arr = [], selectedValue, name, label) => (
    <div className="mb-5"> 
      <h5 className="fw-bold text-secondary mb-3 ">{label}</h5> 
      <div className="d-grid gap-3 " >
        {arr.map((opt, index) => (
          <div
            key={index}
            className={`form-check   rounded shadow-sm border makeRadio ${
              selectedValue === opt.value ? "border-primary bg-light makeRadioSelected" : "border-light bg-white "
            }`}
            style={{ cursor: "pointer" }}
          >
            <input
              className="form-check-input me-3 "
              type="radio"
              name={name}
              id={`${name}-${opt.value}`}
              value={opt.value}
              checked={selectedValue === opt.value}
              onChange={handleChange}
            />
            <label
              className="form-check-label fs-5"
              htmlFor={`${name}-${opt.value}`}
              style={{ userSelect: "none" }}
            >
              {opt.display}
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  const makeDropdown = (arr, selected, name, placeholder, label) => (
    <div className="mb-5">
      <label className="fw-bold text-secondary mb-3 fs-5 ">{label}</label>
      <select
        className="form-select form-select-lg makeRadio "
        name={name}
        value={selected}
        onChange={handleChange}
        style={{ minHeight: "48px" }} 
      >
        <option value="">{placeholder}</option>
        {arr.map((opt) => (
          <option key={opt} value={opt}>
            {opt.charAt(0).toUpperCase() + opt.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );

  const { langRestrict = "", filter = "", printType = "", orderBy = "" } = options;

  return (
    <div className="p-4 bg-white shadow rounded">
      {checkOption.langRestrict &&
        makeRadioboxes(langArr, langRestrict, "langRestrict", "Language")}

      {checkOption.filter &&
        makeRadioboxes(filterArr, filter, "filter", "Content Type")}

      {checkOption.printType &&
        makeRadioboxes(printArr, printType, "printType", "Print Type")}

      {checkOption.orderBy &&
        makeDropdown(orderArr, orderBy, "orderBy", "Sort by", "Order By")}
    </div>
  );
};

export default LeftOptionPanel;



