import { useState, useEffect } from "react";

const ProtectedComponent = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProtectedData = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/auth/protected", {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhbmkiLCJlbWFpbF9pZCI6ImFuaWtyaXNoMjgwNEBnbWFpbC5jb20iLCJleHAiOjE3NDI3OTUwMzh9.Wf-UVGZ30cjum8jdLVNGmfKn77EElUZHuCq8hwMNm_U"
                },
                credentials: "include", // Important if using cookies for authentication
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json();
            console.log("Protected Data:", data);
        } catch (error) {
            console.error("Error fetching protected data:", error);
        }
    };

    fetchProtectedData();

  }, []);

  return (
    <div>
      <h2>Protected API Response</h2>
      {message && <p>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default ProtectedComponent;
