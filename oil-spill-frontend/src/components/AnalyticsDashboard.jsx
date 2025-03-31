import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, LineChart, PieChart } from "@mui/x-charts";
import { Card, CardContent, Typography, Select, MenuItem } from "@mui/material";
import { motion } from "framer-motion";
import "./AnalyticsDashboard.css"; // Import CSS for styling

const API_BASE_URL = "http://localhost:8000/analytics";

const AnalyticsDashboard = () => {
  const [folderData, setFolderData] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [selectedFolderData, setSelectedFolderData] = useState(null);
  const [criticality, setCriticality] = useState([]);
  const [summary, setSummary] = useState([]);
  const [timeTrends, setTimeTrends] = useState([]);
  const [timeTrendsMap, setTimeTrendsMap] = useState({});

  const token = localStorage.getItem("token");
  const email = "anikrish2804@gmail.com";
  const scaleAnimation = { scale: 1.02 };

  useEffect(() => {
    if (!token) return;

    const headers = { Authorization: `Bearer ${token}` };

    axios
      .get(`${API_BASE_URL}/group-by-uuid`, { params: { email_id: email }, headers })
      .then((res) => {
        const formattedData = res.data.map((item, index) => ({
          folderName: `${new Date(item.timestamp).toLocaleDateString()}-${index + 1}`,
          ...item,
        }));
        setFolderData(formattedData);
        if (formattedData.length > 0) {
          setSelectedFolder(formattedData[0].folderName);
          setSelectedFolderData(formattedData[0]);
        }
      })
      .catch((err) => console.error("Error fetching grouped data:", err));

    axios
      .get(`${API_BASE_URL}/summary`, { params: { email_id: email }, headers })
      .then((res) => setSummary(res.data))
      .catch((err) => console.error("Error fetching summary:", err));

    axios
      .get(`${API_BASE_URL}/time-trends`, { params: { email_id: email }, headers })
      .then((res) => setTimeTrends(res.data))
      .catch((err) => console.error("Error fetching time trends:", err));

      const trendsMap = timeTrends.reduce((acc, item) => {
        acc[item._id] = item.avg_spill;
        return acc;
      }, {});
      setTimeTrendsMap(trendsMap);

    axios
      .get(`${API_BASE_URL}/criticality`, { params: { email_id: email }, headers })
      .then((res) => setCriticality(res.data))
      .catch((err) => console.error("Error fetching criticality:", err));
  }, [token]);

  const handleFolderChange = (e) => {
    const selected = folderData.find((item) => item.folderName === e.target.value);
    setSelectedFolder(e.target.value);
    setSelectedFolderData(selected);
  };

  return (
    <div className="dashboard-container">
      {/* Top Row: Summary & Criticality Breakdown */}
      <div className="top-row">
        <Card component={motion.div} whileHover={scaleAnimation} className="summary-card">
          <CardContent>
            <Typography variant="h6">Summary</Typography>
            <Typography>Total Images: {summary.total_images || 0}</Typography>
            <Typography>Spill Cases: {summary.total_spill_cases || 0}</Typography>
            <Typography>Avg Spill %: {summary.avg_spill_percentage?.toFixed(2) || 0}%</Typography>
          </CardContent>
        </Card>

        <Card component={motion.div} whileHover={scaleAnimation} className="criticality-card">
          <CardContent>
            <Typography variant="h6">Criticality Breakdown</Typography>
            <PieChart
              width={350}
              height={250}
              series={[{ data: criticality.map((d) => ({ id: d._id, value: d.count, label: d._id })) }]}
            />
          </CardContent>
        </Card>
      </div>

      {/* Time Trends */}
      <Card component={motion.div} whileHover={scaleAnimation} className="time-trends">
        <CardContent>
          <Typography variant="h6">Time Trends</Typography>
          <LineChart
            width={500}
            height={250}
            series={[{ data: timeTrends.map((d) => d.avg_spill), label: "Avg Spill %", color: "blue" }]}
            xAxis={[{ data: timeTrends.map((d) => d._id), scaleType: "band" }]}
          />
        </CardContent>
      </Card>

      {/* Folder Selection */}
      <Card component={motion.div} whileHover={scaleAnimation} className="folder-selection">
        <CardContent>
          <Typography variant="h6">Select Folder</Typography>
          <Select value={selectedFolder} onChange={handleFolderChange} fullWidth>
            {folderData.map((item) => (
              <MenuItem key={item.folderName} value={item.folderName}>
                {item.folderName}
              </MenuItem>
            ))}
          </Select>

          {selectedFolderData && (
            <>
              <Typography>Spilled Count: {selectedFolderData.spilled_count || 0}</Typography>
              <Typography>Non-Spilled Count: {selectedFolderData.non_spilled_count || 0}</Typography>
              <Typography>Avg Spill %: {selectedFolderData.avg_spill_percentage?.toFixed(2) || 0}%</Typography>
            </>
          )}
        </CardContent>
      </Card>

      {/* Analytics Section */}
      {selectedFolderData && (
        <div className="analytics-section">
          {/* Criticality Summary & Spilled vs Non-Spilled */}
          <Card component={motion.div} whileHover={scaleAnimation} className="small-chart">
            <CardContent>
              <Typography variant="body1">Criticality Summary</Typography>
              <BarChart
                width={350}
                height={250}
                xAxis={[{ scaleType: "band", data: ["Low", "Medium", "High"] }]}
                series={[
                  {
                    data: [
                      selectedFolderData.criticality_summary?.Low || 0,
                      selectedFolderData.criticality_summary?.Medium || 0,
                      selectedFolderData.criticality_summary?.High || 0,
                    ],
                  },
                ]}
              />
            </CardContent>
          </Card>

          <Card component={motion.div} whileHover={scaleAnimation} className="small-chart">
            <CardContent>
              <Typography variant="body1">Spilled vs Non-Spilled Count</Typography>
              <BarChart
                width={350}
                height={250}
                xAxis={[{ scaleType: "band", data: ["Spilled", "Non-Spilled"] }]}
                series={[
                  {
                    data: [
                      selectedFolderData.spilled_count || 0,
                      selectedFolderData.non_spilled_count || 0,
                    ],
                  },
                ]}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Combined Spill Data */}
      {selectedFolderData && (
        <Card component={motion.div} whileHover={scaleAnimation} className="combined-data">
          <CardContent>
            <Typography variant="body1">Combined Spill Data</Typography>
            <BarChart
              width={600}
              height={250}
              xAxis={[{ scaleType: "band", data: ["Total Spill (UUID)", "Avg Spill (UUID)", "User Total Avg", "Daily Avg"] }]}
              series={[
                {
                  data: [
                    selectedFolderData.total_spill_percentage || 0,
                    selectedFolderData.avg_spill_percentage || 0,
                    summary.avg_spill_percentage || 0,
                    timeTrends.length > 0 ? timeTrends[0].avg_spill_percentage || 0 : 0,
                  ],
                },
              ]}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
