import * as React from "react";
import { Routes, Route } from "react-router-dom";
import { extendTheme } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import BarChartIcon from "@mui/icons-material/BarChart";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import LayersIcon from "@mui/icons-material/Layers";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";

// Import Components
import GeneratePDF from "./GeneratePDF";
import MyFileUpload from "./MyFileUpload";
import PredictButton from "./PredictButton";

const NAVIGATION = [
  { kind: "header", title: "Main Menu" },
  { segment: "dashboard", title: "Dashboard", icon: <DashboardIcon />, path: "/" },
  { kind: "divider" },
  { kind: "header", title: "Oil Spill Detection" },
  { segment: "upload", title: "Upload Image", icon: <UploadFileIcon />, path: "/upload" },
  { segment: "predict", title: "Run Prediction", icon: <PlayArrowIcon />, path: "/predict" },
  { segment: "generate-pdf", title: "Generate Report", icon: <PictureAsPdfIcon />, path: "/generate-pdf" },
  { kind: "divider" },
  { kind: "header", title: "Analytics" },
  { segment: "reports", title: "Reports", icon: <BarChartIcon />, path: "/reports" },
  { segment: "integrations", title: "Integrations", icon: <LayersIcon />, path: "/integrations" },
];

const demoTheme = extendTheme({
  colorSchemes: { light: true, dark: true },
  colorSchemeSelector: "class",
  breakpoints: {
    values: { xs: 0, sm: 600, md: 600, lg: 1200, xl: 1536 },
  },
});

export default function Dashboard() {
  return (
    <AppProvider navigation={NAVIGATION} theme={demoTheme}>
      <DashboardLayout>
        <PageContainer>
          <Routes>
            <Route path="/" element={<h2>Welcome to the Dashboard</h2>} />
            <Route path="/upload" element={<MyFileUpload />} />
            <Route path="/predict" element={<PredictButton />} />
            <Route path="/generate-pdf" element={<GeneratePDF />} />
            <Route path="*" element={<h2>404 - Page Not Found</h2>} />
          </Routes>
        </PageContainer>
      </DashboardLayout>
    </AppProvider>
  );
}
