import React, { useState } from "react";
import axios from "axios";
import {Button, Spinner} from "@chakra-ui/react";

export default function GeneratePDF() {
  const [loading, setLoading] = useState(false);
  const [sendMail, setSendMail] = useState(false);
  const [pdfBlob, setPdfBlob] = useState(null);
  const [error, setError] = useState(null);

  const handleGeneratePDF = async () => {
    setLoading(true);
    setError(null);
    setPdfBlob(null);

    try {
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhbmkiLCJlbWFpbF9pZCI6ImFuaWtyaXNoMjgwNEBnbWFpbC5jb20iLCJleHAiOjE3NDI4Mzc3OTh9.CPowZPHb-qXjG3JBHHJFQrF0ub5SvofLBxt5xVxMJv0";
      const uuid_global = "ec8e029e-9ca3-42f3-8c43-51ef4b232738";
      const apiUrl = `http://127.0.0.1:8000/pdf/generate_pdf/?send_mail=${sendMail}&uuid_global=${uuid_global}`;

      const response = await axios.post(apiUrl, null, {
        headers: {
          Accept: "application/pdf",
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob", // Ensure we get the PDF file as a blob
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
      {/* Normal Checkbox for Email Sending */}
      <label>
        <input
          type="checkbox"
          checked={sendMail}
          onChange={(e) => setSendMail(e.target.checked)}
        />
        Send Email
      </label>

      <br /><br />

      {/* Generate PDF Button */}
      <Button
              colorScheme="blue"
              mt={3}
              onClick={handleGeneratePDF}
              isDisabled={loading}
            >
              {loading ? <Spinner size="sm" /> : "Generate PDF"}
            </Button>

      {/* Download PDF Button */}
      {pdfBlob && (
        // <button onClick={handleDownloadPDF} style={{ padding: "8px 16px", margin: "4px", backgroundColor: "green", color: "white" }}>
        //   Download PDF
        // </button>

<Button
colorScheme="blue"
mt={3}
onClick={handleDownloadPDF}
isDisabled={loading}
>
{loading ? <Spinner size="sm" /> : "Download PDF"}
</Button>
      )}

      {/* Error Message */}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
