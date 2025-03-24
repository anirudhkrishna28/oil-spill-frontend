import { useDropzone } from "react-dropzone";
import { useState, useCallback } from "react";
import { Box, Button, Spinner, Text } from "@chakra-ui/react";
import { LuUpload } from "react-icons/lu";
import axios from "axios";

export default function MyFileUpload() {
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState("");

  // Replace with actual token (store in state/localStorage)
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhbmkiLCJlbWFpbF9pZCI6ImFuaWtyaXNoMjgwNEBnbWFpbC5jb20iLCJleHAiOjE3NDI4Mzc3OTh9.CPowZPHb-qXjG3JBHHJFQrF0ub5SvofLBxt5xVxMJv0";

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

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    setUploading(true);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/file_management/upload-image/",
        formData,
        {
          headers: {
            "Authorization": `Bearer ${token}`, // JWT token
            "Content-Type": "multipart/form-data", // Ensure proper encoding
          },
        }
      );

      setMessage(`Upload successful! UUID: ${response.data.id}`);
      console.log(response.data)
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
