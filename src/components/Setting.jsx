import React, { useEffect, useState } from "react";
import "./css/settings.css";
import http from "./httpService";

const FilterCheckbox = ({ id, name, label, checked, onChange }) => (
  <div className="form-check mb-2 no-border">
    <input
      className="form-check-input"
      type="checkbox"
      id={id}
      name={name}
      checked={checked}
      onChange={onChange}
    />
    <label className="form-check-label" htmlFor={id}>
      {label}
    </label>
  </div>
);

const Setting = () => {
  const checkArr = [
    {
      id: "printType",
      name: "printType",
      label: "PrintType -- (Restrict to book or magazines)",
    },
    {
      id: "langRestrict",
      name: "langRestrict",
      label:
        "Languages -- (Restrict volumes returned to those tagged with the specified language)",
    },
    {
      id: "filter",
      name: "filter",
      label: "Filter -- (Filter search result by volume type and availability)",
    },
    {
      id: "orderBy",
      name: "orderBy",
      label: "OrderBy -- (Order of the volume search result)",
    },
  ];

  const [options, setOptions] = useState([]);
  const [message, setMessage] = useState("");
  // Fetch Options from  API
  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      const response = await http.get(`/options`);
      setOptions(response.data);
    } catch (error) {
      console.error("Error fetching Options:", error);
    }
  };

  const handleChange = async (e) => {
    const { name, type, checked, value } = e.target;
    const updatedValue = type === "checkbox" ? checked : Number(value);

    // New state to send in POST request
    const newOptions = {
      ...options,
      [name]: updatedValue,
    };

    setOptions(newOptions);

    // Prevent invalid `max` values
    if (name === "maxResults" && updatedValue < 1) {
      setMessage("Max value must be at least 1");
      return;
    }

    setTimeout(async () => {
      try {
        const response = await http.post("/option", {
          maxResults: newOptions.maxResults,
          printType: newOptions.printType,
          filter: newOptions.filter,
          orderBy: newOptions.orderBy,
          langRestrict: newOptions.langRestrict,
        });
        setMessage(response.data.message);
      } catch (error) {
        console.error("Error saving settings:", error);
        setMessage("Failed to save settings");
      }
    }, 2000);
  };

  const messColor = (mess) => {
    if (/Failed|Error|Invalid/i.test(mess)) return "danger";
    if (/Success|Updated|Created/i.test(mess)) return "success";
    return "info";
  };

  return (
    <div className="container py-4 settingsTop">
      <h5 className="fw-bold mb-3">
        Select Options for Filtering on Left Panel
      </h5>

      {checkArr.map((item) => (
        <FilterCheckbox
          key={item.id}
          id={item.id}
          name={item.name}
          label={item.label}
          checked={options[item.name]}
          onChange={handleChange}
        />
      ))}

      <h5 className="text-success fw-semibold mb-2 no-border">
        No of entries on a page
      </h5>
      <div className="col-md-4">
        <input
          className="form-control"
          type="number"
          name="maxResults"
          placeholder="Enter number"
          value={options.maxResults || ""}
          min="1"
          onChange={handleChange}
        />
      </div>
      {message && (
        <div className={`alert alert-${messColor(message)} mt-3`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default Setting;
