import React, { useState } from "react";

function App() {
  const [limit, setLimit] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [responses, setResponses] = useState([]);

  const handleClick = async () => {
    setIsLoading(true);
    const parallelism = limit > 0 ? limit : 1;

    const interval = Math.floor(1000 / parallelism);
    const delay = async (ms) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    for (let i = 1; i <= 1000; i++) {
      if (i % parallelism === 0) {
        await delay(interval);
      }
      sendRequest(i);
    }
  };

  const sendRequest = async (index) => {
    try {
      const response = await fetch("http://localhost:3000/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ index }),
      });
      const data = await response.json();
      setResponses((prev) => [...prev, data]);
      if (index === 1000) {
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <label>
        Limit (0-100):
        <input
          type="number"
          min="0"
          max="100"
          value={limit}
          onChange={(e) => setLimit(parseInt(e.target.value))}
        />
      </label>
      <button onClick={handleClick} disabled={isLoading}>
        {isLoading ? "Loading..." : "Start"}
      </button>
      <ul>
        {responses.map((response, index) => (
          <li key={index}>{response}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
