import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Routes, Route, useNavigate } from "react-router-dom";
import { createTheme } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import PublicIcon from "@mui/icons-material/Public";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import Button from "@mui/material/Button";
import axios from "axios";

// Import Components
import MyFileUpload from "./MyFileUpload";
import PredictButton from "./PredictButton";
import GeneratePDF from "./GeneratePDF";
import AnalyticsDashboard from "./AnalyticsDashboard";
import GeoLocationUpload from "./GeoLocationUpload";

// Define the navigation menu
const NAVIGATION = [
  { kind: "header", title: "Main Menu" },
  { segment: "analytics", title: "Analytics", icon: <AutoGraphIcon />, path: "/analytics" },
  { kind: "divider" },
  { kind: "header", title: "Oil Spill Detection" },
  { segment: "upload", title: "Upload Images", icon: <UploadFileIcon />, path: "/upload" },
  { segment: "upload-geo", title: "Upload Geolocation Data", icon: <PublicIcon />, path: "/upload-geo" },
  { segment: "predict", title: "Run Prediction", icon: <PlayArrowIcon />, path: "/predict" },
  { segment: "generate-pdf", title: "Generate Report", icon: <PictureAsPdfIcon />, path: "/generate-pdf" },
  { kind: "divider" },
];

// Define the theme
const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

async function fetchUserData() {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Authorization token is missing.");
      return null;
    }

    const response = await axios.get("http://127.0.0.1:8000/auth/protected", {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the headers
      },
    });

    if (response.status === 200) {
      return response.data; // { username, email_id }
    } else {
      console.warn("Unexpected response from the API:", response);
      return null;
    }
  } catch (error) {
    if (error.response) {
      console.error("API Error Response:", error.response.data);
    } else if (error.request) {
      console.error("No response received from the server:", error.request);
    } else {
      console.error("Error:", error.message);
    }
    return null;
  }
}

async function handleDeleteFilesAndClearStorage() {
  let token = localStorage.getItem("token");
  let uploadedFileId = localStorage.getItem("uploaded_file_id");

  if (!token) {
    token = "";
    console.error("Authorization token is missing.");
  }

  if (!uploadedFileId) {
    uploadedFileId = "";
    console.error("Uploaded file ID is missing.");
  }

  try {
    // Execute the API call to delete files
    const response = await axios.delete("http://127.0.0.1:8000/file_management/delete-files/", {
      headers: {
        Authorization: `Bearer ${token}`, // Set Authorization Bearer token
      },
      params: {
        uuid_global: uploadedFileId, // Pass uploaded_file_id as uuid_global
      },
    });

    if (response.status === 200) {
      console.log("Folders deleted successfully!");
    } else {
      console.warn("Unexpected response from the API:", response);
    }
  } catch (error) {
    if (error.response) {
      console.error("API Error Response:", error.response.data);
    } else if (error.request) {
      console.error("No response received from the server:", error.request);
    } else {
      console.error("Error:", error.message);
    }
  } finally {
    // Clear localStorage keys
    localStorage.removeItem("token");
    localStorage.removeItem("uploaded_file_id");
    console.log("LocalStorage keys cleared.");
  }
}

export default function Dashboard() {
  const [session, setSession] = React.useState(null);

  React.useEffect(() => {
    async function loadUserSession() {
      const userData = await fetchUserData();
      if (userData) {
        setSession({
          user: {
            name: userData.username,
            email: userData.email_id,
            image: "https://avatars.githubusercontent.com/u/19550456", // Default avatar or fetch dynamically if available
          },
        });
      }
    }

    loadUserSession();
  }, []);

  const authentication = React.useMemo(() => {
    return {
      signIn: () => {
        setSession({
          user: {
            name: "Anirudh Krishna",
            email: "anirudhkrishna28@gmail.com",
            image: "https://avatars.githubusercontent.com/u/19550456",
          },
        });
      },
      signOut: async () => {
        // First, delete files and clear storage
        await handleDeleteFilesAndClearStorage();

        // Clear session and redirect to login page
        setSession(null);
        window.location.href = "/login";
      },
    };
  }, []);

  const navigate = useNavigate();

  return (
    <AppProvider
      session={session}
      authentication={authentication}
      navigation={NAVIGATION}
      theme={demoTheme}
    >
      <DashboardLayout
        branding={{
          title: "Oil Spill Detection",
          homeUrl: "/analytics",
          logo: <WaterDropIcon />,
        }}
        user={session?.user} // Pass the user object for avatar and session
        onSegmentClick={(segment) => {
          const navItem = NAVIGATION.find((item) => item.segment === segment);
          if (navItem && navItem.path) {
            navigate(navItem.path); // Navigate to the selected segment path
          }
        }}
        headerContent={
          <Button
            variant="outlined"
            color="secondary"
            onClick={authentication.signOut}
          >
            Logout
          </Button>
        }
      >
        <Routes>
          <Route path="/upload" element={<MyFileUpload />} />
          <Route path="/predict" element={<PredictButton />} />
          <Route path="/generate-pdf" element={<GeneratePDF />} />
          <Route path="/analytics" element={<AnalyticsDashboard />} />
          <Route path="/upload-geo" element={<GeoLocationUpload />} />
          <Route
            path="*"
            element={
              <Box
                sx={{
                  py: 4,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <Typography>Page not found</Typography>
              </Box>
            }
          />
        </Routes>
      </DashboardLayout>
    </AppProvider>
  );
}
