import React, { useState } from "react";
import axios from "axios";
import { Button, Spinner } from "@chakra-ui/react"; // Ensure correct Chakra UI import

export default function GeneratePDF() {
  const [loading, setLoading] = useState(false);
  const [sendMail, setSendMail] = useState(false);
  const [pdfBlob, setPdfBlob] = useState(null);
  const [error, setError] = useState(null);

  // Retrieve token and UUID from local storage
  const token = localStorage.getItem("token");
  const uuid_global = localStorage.getItem("uploaded_file_id");

  const handleGeneratePDF = async () => {
    if (!token || !uuid_global) {
      setError("Token or UUID missing. Please log in.");
      return;
    }

    setLoading(true);
    setError(null);
    setPdfBlob(null);

    try {
      const apiUrl = `http://127.0.0.1:8000/pdf/generate_pdf/?send_mail=${sendMail}&uuid_global=${uuid_global}`;

      const response = await axios.post(apiUrl, null, {
        headers: {
          Accept: "application/pdf",
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      });

      setPdfBlob(response.data);
    } catch (err) {
      setError("Error generating PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!pdfBlob) return;
    const url = window.URL.createObjectURL(new Blob([pdfBlob], { type: "application/pdf" }));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "report.pdf");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ textAlign: "center", padding: "16px" }}>
      <label>
        <input
          type="checkbox"
          checked={sendMail}
          onChange={(e) => setSendMail(e.target.checked)}
        />
        Send Email
      </label>

      <br /><br />

      {/* Hide "Generate PDF" button after generating */}
      {!pdfBlob && (
        <Button colorScheme="blue" mt={3}
        sx={{
            backgroundColor: "black", // Black button
            color: "white", // White text
            "&:hover": {
              backgroundColor: "#333", // Darker black on hover
            },
            marginBottom: 2, // Add spacing below the button
          }}
         onClick={handleGeneratePDF} isDisabled={loading}>
          {loading ? <Spinner size="sm" /> : "Generate PDF"}
        </Button>
      )}

      {/* Show "Download PDF" button only after generation */}
      {pdfBlob && (
        <Button colorScheme="green" mt={3} onClick={handleDownloadPDF}>
          Download PDF
        </Button>
      )}

      {/* Error Message */}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
