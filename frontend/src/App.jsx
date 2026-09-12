import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [message, setMessage] = useState("Connecting to backend...");

  useEffect(() => {
    axios
    .get("http://localhost:8080/api/ping")
      .then((response) => {
        setMessage(response.data);
      })
      .catch((error) => {
        console.error(error);
        setMessage("Backend connection failed!");
      });
  }, []);

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>QueueLess</h1>
      <h2>Module 0 - Environment Setup</h2>

      <p>
        Backend status:
        <strong> {message}</strong>
      </p>
    </div>
  );
}

export default App;