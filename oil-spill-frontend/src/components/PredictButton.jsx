import { useState } from "react";
import { Box, Button, Spinner, Text, Image } from "@chakra-ui/react";
import axios from "axios";

export default function PredictButton() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handlePredict = async () => {
    setLoading(true);
    setResponse(null);
    setError(null);

    try {
      // Retrieve token and file ID from local storage
      const token = localStorage.getItem("token");
      const uuid_global = localStorage.getItem("uploaded_file_id");

      if (!token) {
        setError("Authentication required. Please log in.");
        setLoading(false);
        return;
      }

      if (!uuid_global) {
        setError("No uploaded file found. Please upload an image first.");
        setLoading(false);
        return;
      }

      const apiUrl = `http://127.0.0.1:8000/prediction/predict?uuid_global=${uuid_global}`;

      const res = await axios.post(apiUrl, null, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      setResponse(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || "Error processing request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box textAlign="center" p={4}>
      {/* Predict Button */}
      <Button colorScheme="blue" onClick={handlePredict} isDisabled={loading}>
        {loading ? <Spinner size="sm" /> : "Run Prediction"}
      </Button>

      {/* Display Response */}
      {response && (
        <Box mt={4} p={3} borderWidth={1} borderRadius="md">
          <Text fontWeight="bold" color="green.500">
            {response.msg}
          </Text>
          {response.data.map((item, index) => {
            // Convert backend image path to frontend URL
            const formattedPath = item.image_path.replace(
              "app/downloads",
              "/downloads"
            );
            const imageUrl = `http://127.0.0.1:8000${formattedPath}`;

            return (
              <Box key={index} mt={2} p={2} borderWidth={1} borderRadius="md">
                <Text>
                  <strong>Image ID:</strong> {item.image_id}
                </Text>
                <Text>
                  <strong>Oil Spill %:</strong> {item.oil_spill_percentage.toFixed(2)}%
                </Text>
                <Text>
                  <strong>Criticality:</strong> {item.criticality}
                </Text>
                <Text>
                  <strong>Timestamp:</strong> {item.timestamp}
                </Text>
                {imageUrl && (
                  <Box mt={3}>
                    <Text>Processed Image:</Text>
                    <Image
                      src={imageUrl}
                      alt="Processed Oil Spill"
                      borderRadius="md"
                      maxW="300px"
                    />
                  </Box>
                )}
              </Box>
            );
          })}
        </Box>
      )}

      {/* Display Error */}
      {error && (
        <Text mt={3} color="red.500">
          {error}
        </Text>
      )}
    </Box>
  );
}
