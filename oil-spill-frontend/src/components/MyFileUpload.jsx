import { useDropzone } from "react-dropzone";
import { useState, useCallback } from "react";
import { Box, Button, Spinner, Text } from "@chakra-ui/react";
import { LuUpload } from "react-icons/lu";
import axios from "axios";

export default function MyFileUpload() {
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState("");

  // Retrieve token and existing folder name from local storage
  const token = localStorage.getItem("token");
  const existingFolder = localStorage.getItem("uploaded_file_id");

  // Handle File Selection
  const onDrop = useCallback((acceptedFiles) => {
    setFiles(acceptedFiles);
    setMessage("");
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/jpeg, image/png",
    maxSize: 5 * 1024 * 1024, // 5MB max file size
  });

  // Upload Files using Axios
  const handleUpload = async () => {
    if (files.length === 0) {
      setMessage("No files selected!");
      return;
    }

    if (!token) {
      setMessage("Authentication required. Please log in.");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    const apiUrl = `http://127.0.0.1:8000/file_management/upload-image/?existing=${!!existingFolder}&existing_folder_name=${existingFolder || ""}`;

    setUploading(true);
    try {
      const response = await axios.post(apiUrl, formData, {
        headers: {
          Authorization: `Bearer ${token}`, // JWT token
          "Content-Type": "multipart/form-data",
        },
      });

      const { id } = response.data;

      // Store the folder ID if it's a new upload
      if (!existingFolder) {
        localStorage.setItem("uploaded_file_id", id);
      }

      setMessage(`Upload successful! UUID: ${id}`);
      console.log("Uploaded file ID:", id);
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
        <Text>Drag & drop images here, or click to select</Text>
        <Text color="gray.500">.png, .jpg up to 5MB</Text>
      </Box>

      {/* Selected File List */}
      <Box mt={3}>
        {files.map((file) => (
          <Text key={file.name}>{file.name}</Text>
        ))}
      </Box>

      {/* Upload Button */}
      <Button
        colorScheme="blue"
        mt={3}
        onClick={handleUpload}
        isDisabled={uploading}
      >
        {uploading ? <Spinner size="sm" /> : "Upload Files"}
      </Button>

      {/* Display Message */}
      {message && (
        <Text mt={3} color="red.500">
          {message}
        </Text>
      )}
    </Box>
  );
}
