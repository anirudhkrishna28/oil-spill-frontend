import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Input, Button, Box, Heading, Text } from "@chakra-ui/react";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email_id: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Navigation hook

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://127.0.0.1:8000/auth/register", formData);
      console.log("Registration Successful:", response.data);
      navigate("/login"); // Redirect to Login Page
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box textAlign="center" maxW="400px" mx="auto" mt="50px" p="5" boxShadow="md" borderRadius="lg">
      <Heading size="lg">Register</Heading>

      <Input
        placeholder="Username"
        name="username"
        value={formData.username}
        onChange={handleChange}
        mt={4}
      />
      <Input
        placeholder="Email"
        name="email_id"
        type="email"
        value={formData.email_id}
        onChange={handleChange}
        mt={4}
      />
      <Input
        placeholder="Password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        mt={4}
      />

      {error && <Text color="red.500" mt={2}>{error}</Text>}

      <Button colorScheme="blue" mt={4} onClick={handleRegister} isLoading={loading}>
        Register
      </Button>

      <Text mt={3}>
        Already have an account? <a href="/login" style={{ color: "blue" }}>Login here</a>
      </Text>
    </Box>
  );
}
