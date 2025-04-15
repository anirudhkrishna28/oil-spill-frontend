import { useDropzone } from "react-dropzone";
import { useState, useCallback } from "react";
import { Box, Button, Spinner, Text } from "@chakra-ui/react";
import { LuUpload } from "react-icons/lu";
import axios from "axios";

export default function GeoLocationUpload() {
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  // Retrieve token and UUID from local storage
  const token = localStorage.getItem("token");
  const uuid = localStorage.getItem("uploaded_file_id");

  // Handle File Selection
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setMessage("");
    } else {
      setMessage("Invalid file format. Please upload a JSON file.");
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "application/json",
    maxSize: 2 * 1024 * 1024, // 2MB max file size
  });

  // Upload Metadata using Axios
  const handleUpload = async () => {
    if (!file) {
      setMessage("No file selected!");
      return;
    }

    if (!token) {
      setMessage("Authentication required. Please log in.");
      return;
    }

    if (!uuid) {
      setMessage("UUID is missing. Please provide a valid UUID.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const apiUrl = `http://127.0.0.1:8000/location/upload_metadata?uuid=${uuid}`;

    setUploading(true);
    try {
      const response = await axios.post(apiUrl, formData, {
        headers: {
          Authorization: `Bearer ${token}`, // JWT token
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage(response.data.message || "Upload successful!");
    } catch (error) {
      setMessage(
        `Upload failed: ${error.response?.data?.detail || error.message}`
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box maxW="xl" p={4} borderWidth={1} borderRadius="md" textAlign="center">
      {/* Drag and Drop Zone */}
      <Box
        {...getRootProps()}
        border="2px dashed gray"
        p={4}
        borderRadius="md"
        cursor="pointer"
      >
        <input {...getInputProps()} />
        <LuUpload size={30} />
        <Text>Drag & drop a JSON file here, or click to select</Text>
        <Text color="gray.500">.json file up to 2MB</Text>
      </Box>

      {/* Selected File Display */}
      <Box mt={3}>
        {file && <Text>{file.name}</Text>}
      </Box>

      {/* Upload Button */}
      <Button
        colorScheme="blue"
        mt={3}
        onClick={handleUpload}
        isDisabled={uploading}
      >
        {uploading ? <Spinner size="sm" /> : "Upload Metadata"}
      </Button>

      {/* Display Message */}
      {message && (
        <Text mt={3} color={message.startsWith("Upload successful") ? "green.500" : "red.500"}>
          {message}
        </Text>
      )}
    </Box>
  );
}
