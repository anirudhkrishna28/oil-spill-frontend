import * as React from "react";
import { AppProvider } from "@toolpad/core/AppProvider";
import { SignInPage } from "@toolpad/core/SignInPage";
import { useTheme } from "@mui/material/styles";
import { useNavigate, Link } from "react-router-dom"; // Import Link
import { extendTheme } from "@mui/material/styles";
import { Box, Typography } from "@mui/material"; // Import Box and Typography for styling
import WaterDropIcon from '@mui/icons-material/WaterDrop';

const providers = [{ id: "credentials", name: "Email and Password" }];

const BRANDING = {
  logo: (
<WaterDropIcon/>
  ),
  title: "Oil Spill Detection",
};

const signIn = async (_provider, formData) => {
  const email = formData?.get("email");
  const password = formData?.get("password");

  try {
    const response = await fetch("http://127.0.0.1:8000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email_id: email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.detail || "Invalid credentials. Please try again.");
      return { type: "CredentialsSignin", error: data.detail || "Login failed" };
    }

    if (!data.token) {
      alert("Login successful, but no token received.");
      return { type: "CredentialsSignin", error: "No token received" };
    }

    localStorage.setItem("token", data.token);
    return { type: "CredentialsSignin", error: null };
  } catch (error) {
    return { type: "CredentialsSignin", error: "Something went wrong." };
  }
};

export default function Login() {
  const navigate = useNavigate();

  const demoTheme = extendTheme({
    colorSchemes: { light: true, dark: true },
    colorSchemeSelector: "class",
    breakpoints: {
      values: { xs: 0, sm: 600, md: 600, lg: 1200, xl: 1536 },
    },
  });

  return (
    <AppProvider branding={BRANDING} theme={demoTheme}>
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 5 }}>
      <Box textAlign="center" mt={2}>
          <Typography variant="body2">
            Don't have an account?{" "}
            <Link to="/register" style={{ textDecoration: "none", color: "blue" }}>
              Register here
            </Link>
          </Typography>
        </Box>
        <SignInPage
          signIn={async (provider, formData) => {
            const result = await signIn(provider, formData);
            if (!result.error) {
              navigate("/analytics");
            }
            return result;
          }}
          providers={providers}
          slotProps={{
            emailField: { label: "Email ID", placeholder: "example@domain.com" },
            passwordField: { label: "Password", type: "password" },
            submitButton: { children: "Login Now", variant: "contained", color: "primary" },
            title: { children: "Welcome Back!" },
            subtitle: { children: "" },
          }}
        />

        {/* 🔹 Register Link INSIDE Login Box (Below Login Button) */}

      </Box>
    </AppProvider>
  );
}
