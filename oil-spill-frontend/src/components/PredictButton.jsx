import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  CardMedia,
  Collapse,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup, Rectangle } from "react-leaflet";
import "leaflet/dist/leaflet.css";

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
    <Box textAlign="center" p={2}>
      {/* Predict Button */}
      <Button
        variant="contained"
        onClick={handlePredict}
        disabled={loading}
        sx={{
          backgroundColor: "black", // Black button
          color: "white", // White text
          "&:hover": {
            backgroundColor: "#333", // Darker black on hover
          },
          marginBottom: 2, // Add spacing below the button
        }}
      >
        {loading ? "Processing..." : "Run Prediction"}
      </Button>

      {/* Display Skeletons While Loading */}
      {loading && (
        <Stack spacing={2}>
          {[...Array(3)].map((_, index) => (
            <Box key={index}>
              <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
              <Skeleton variant="rectangular" width="100%" height={100} />
            </Box>
          ))}
        </Stack>
      )}

      {/* Display Response */}
      {response && (
        <Box>
          {response.data.map((item, index) => {
            // Convert backend image path to frontend URL
            const formattedPath = item.image_path.replace(
              "app/downloads",
              "/downloads"
            );
            const imageUrl = `http://127.0.0.1:8000${formattedPath}`;
            const geolocation = item.geolocation;

            // Extract top and bottom geo-coordinates
            const [topLat, topLng] = geolocation.top_geo_coord.split(", ").map(Number);
            const [bottomLat, bottomLng] = geolocation.bottom_geo_coord.split(", ").map(Number);

            // Define the rectangle bounds
            const bounds = [
              [topLat, topLng], // Top-left corner
              [bottomLat, bottomLng], // Bottom-right corner
            ];

            return (
              <Collapse in={true} timeout={500} key={index}>
                <Card
                  sx={{
                    marginY: 1,
                    maxWidth: 700, // Slightly larger horizontally
                    margin: "0 auto", // Center the box
                    transition: "transform 0.3s",
                    "&:hover": { transform: "scale(1.02)" },
                  }}
                >
                  <CardContent>
                    {/* Box Heading */}
                    <Typography
                      variant="subtitle1"
                      component="div"
                      sx={{
                        textAlign: "center",
                        marginBottom: 1,
                        fontWeight: "bold",
                      }}
                    >
                      Prediction Details
                    </Typography>

                    {/* Table Format for Data */}
                    <TableContainer component={Paper} sx={{ marginBottom: 1 }}>
                      <Table size="small">
                        <TableBody>
                          <TableRow>
                            <TableCell sx={{ fontWeight: "bold", fontSize: "0.75rem" }}>Image ID</TableCell>
                            <TableCell sx={{ fontSize: "0.75rem" }}>{item.image_id}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ fontWeight: "bold", fontSize: "0.75rem" }}>Oil Spill %</TableCell>
                            <TableCell sx={{ fontSize: "0.75rem" }}>{item.oil_spill_percentage}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ fontWeight: "bold", fontSize: "0.75rem" }}>Criticality</TableCell>
                            <TableCell sx={{ fontSize: "0.75rem" }}>{item.criticality}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ fontWeight: "bold", fontSize: "0.75rem" }}>Timestamp</TableCell>
                            <TableCell sx={{ fontSize: "0.75rem" }}>{item.timestamp}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ fontWeight: "bold", fontSize: "0.75rem" }}>Location</TableCell>
                            <TableCell sx={{ fontSize: "0.75rem" }}>{geolocation.location}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ fontWeight: "bold", fontSize: "0.75rem" }}>Top Coordinates</TableCell>
                            <TableCell sx={{ fontSize: "0.75rem" }}>{geolocation.top_geo_coord}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ fontWeight: "bold", fontSize: "0.75rem" }}>Bottom Coordinates</TableCell>
                            <TableCell sx={{ fontSize: "0.75rem" }}>{geolocation.bottom_geo_coord}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>

                    {/* Processed Image */}
                    {imageUrl && (
                      <CardMedia
                        component="img"
                        height="40" // Very small image
                        image={imageUrl}
                        alt={`Processed Image: ${item.image_id}`}
                        sx={{
                          borderRadius: 2,
                          display: "block",
                          margin: "0 auto", // Center the image
                          marginBottom: 1,
                        }}
                      />
                    )}

                    {/* Map with Red Rectangle */}
                    <Box>
                      <MapContainer
                        center={[topLat, topLng]} // Center the map on top coordinates
                        zoom={13}
                        style={{
                          height: "200px", // Map is bigger
                          width: "100%",
                          borderRadius: "8px",
                          marginTop: "10px",
                        }}
                      >
                        <TileLayer
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        {/* Rectangle Highlighting the Area */}
                        <Rectangle
                          bounds={bounds}
                          pathOptions={{ color: "red", weight: 2 }} // Red area
                        />
                        {/* Top Marker */}
                        <Marker position={[topLat, topLng]}>
                          <Popup>
                            <Typography variant="body2">
                              <strong>Top Coordinates:</strong> {geolocation.top_geo_coord}
                              <br />
                              <strong>Location:</strong> {geolocation.location}
                            </Typography>
                          </Popup>
                        </Marker>
                        {/* Bottom Marker */}
                        <Marker position={[bottomLat, bottomLng]}>
                          <Popup>
                            <Typography variant="body2">
                              <strong>Bottom Coordinates:</strong> {geolocation.bottom_geo_coord}
                              <br />
                              <strong>Location:</strong> {geolocation.location}
                            </Typography>
                          </Popup>
                        </Marker>
                      </MapContainer>
                    </Box>
                  </CardContent>
                </Card>
              </Collapse>
            );
          })}
        </Box>
      )}

      {/* Display Error */}
      {error && (
        <Typography mt={3} color="error">
          {error}
        </Typography>
      )}
    </Box>
  );
}
