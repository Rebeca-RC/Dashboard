import React, { useState, useEffect } from "react";

const SpreadsheetLogin = () => {
  const [sheetName, setSheetName] = useState("");
  const [validSheet, setValidSheet] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch spreadsheet data (simulate API call)
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://docs.google.com/spreadsheets/d/10R5dQ7M0ZgWfCoSbJH8Vpjj9YuOUN9kR6wvp-x6jkTs/edit?gid=176146954#gid=176146954"
        );
        const result = await response.json();
        setData(result.sheets || []);
      } catch (err) {
        setError("Failed to load spreadsheet data");
      }
    };
    fetchData();
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    const sheetExists = data.some((sheet) => sheet.name === sheetName);
    if (sheetExists) {
      setValidSheet(true);
    } else {
      setError("Invalid sheet name. Please try again.");
    }
  };

  return (
    <div>
      {!validSheet ? (
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Enter Sheet Name"
            value={sheetName}
            onChange={(e) => setSheetName(e.target.value)}
          />
          <button type="submit">Login</button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      ) : (
        <div>
          <h2>Dashboard for {sheetName}</h2>
          <p>Sheet data will be displayed here...</p>
        </div>
      )}
    </div>
  );
};

export default SpreadsheetLogin;
