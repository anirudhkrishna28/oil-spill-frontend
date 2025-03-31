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
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import { useDemoRouter } from '@toolpad/core/internal';

// Import Components
import GeneratePDF from "./GeneratePDF";
import MyFileUpload from "./MyFileUpload";
import PredictButton from "./PredictButton";
import AnalyticsDashboard from "./AnalyticsDashboard";



const NAVIGATION = [
  { kind: "header", title: "Main Menu" },
  { segment: "analytics", title: "analytics", icon: <AutoGraphIcon />, path: "/analytics" },
  { kind: "divider" },
  { kind: "header", title: "Oil Spill Detection" },
  { segment: "upload", title: "Upload Image", icon: <UploadFileIcon />, path: "/upload" },
  { segment: "predict", title: "Run Prediction", icon: <PlayArrowIcon />, path: "/predict" },
  { segment: "generate-pdf", title: "Generate Report", icon: <PictureAsPdfIcon />, path: "/generate-pdf" },
  { kind: "divider" },
];

const demoTheme = extendTheme({
  colorSchemes: { light: true, dark: true },
  colorSchemeSelector: "class",
  breakpoints: {
    values: { xs: 0, sm: 600, md: 600, lg: 1200, xl: 1536 },
  },
});

export default function Dashboard() {


    const [session, setSession] = React.useState({
      user: {
        name: 'Anirudh Krishna',
        email: 'bharatkashyap@outlook.com',
        image: 'https://avatars.githubusercontent.com/u/19550456',
      },
    });

    const authentication = React.useMemo(() => {
      return {
        signIn: () => {
          setSession({
            user: {
              name: 'Bharat Kashyap',
              email: 'bharatkashyap@outlook.com',
              image: 'https://avatars.githubusercontent.com/u/19550456',
            },
          });
        },
        signOut: () => {
          setSession(null);
        },
      };
    }, []);

    const router = useDemoRouter('/analytics');


  return (
    <AppProvider navigation={NAVIGATION} theme={demoTheme} authentication={authentication}   router={router} session={session}>
      <DashboardLayout branding={{ title: "Oil Spill Detection" , homeUrl:"/analytics", logo: <WaterDropIcon/>,}}>
        <PageContainer>
          <Routes>
            <Route path="/upload" element={<MyFileUpload />} />
            <Route path="/predict" element={<PredictButton />} />
            <Route path="/generate-pdf" element={<GeneratePDF />} />
            <Route path="/analytics" element={<AnalyticsDashboard/>} />
          </Routes>
        </PageContainer>
      </DashboardLayout>
    </AppProvider>
  );
}
