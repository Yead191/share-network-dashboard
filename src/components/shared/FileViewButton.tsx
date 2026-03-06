import { useState } from "react";
import { Button, Modal } from "antd";
import { EyeOutlined, FilePdfOutlined, FileImageOutlined, FileOutlined } from "@ant-design/icons";
import { imageUrl } from "../../redux/api/baseApi";

interface FileViewerButtonProps {
  fileUrl: string;
  fileName?: string;
}

type FileType = "pdf" | "image" | "other";

function getFileType(url: string): FileType {
  const lower = url.toLowerCase();
  if (lower.endsWith(".pdf")) return "pdf";
  if (/\.(png|jpe?g|gif|webp|svg|bmp)/.test(lower)) return "image";
  return "other";
}

function getFileIcon(type: FileType) {
  if (type === "pdf") return <FilePdfOutlined style={{ marginRight: 6 }} />;
  if (type === "image") return <FileImageOutlined style={{ marginRight: 6 }} />;
  return <FileOutlined style={{ marginRight: 6 }} />;
}

export default function FileViewerButton({ fileUrl, fileName = "File Preview" }: FileViewerButtonProps) {
  fileUrl=fileUrl?.replace("/uploads","")
  const [open, setOpen] = useState(false);
  const fileType = getFileType(fileUrl);

  const renderContent = () => {
    if (fileType === "pdf") {
      return (
        <iframe
          src={imageUrl+fileUrl}
          title={fileName}
          style={{ width: "100%", height: "70vh", border: "none", borderRadius: 8 }}
        />
      );
    }
    if (fileType === "image") {
      return (
        <div style={{ textAlign: "center" }}>
          <img
            src={imageUrl+fileUrl}
            alt={fileName}
            style={{ maxWidth: "100%", maxHeight: "70vh", borderRadius: 8, objectFit: "contain" }}
          />
        </div>
      );
    }
    return (
      <div style={{ textAlign: "center", padding: "40px 0" }}>
        <FileOutlined style={{ fontSize: 48, color: "#999", marginBottom: 16, display: "block" }} />
        <p style={{ color: "#666" }}>Preview not available for this file type.</p>
        <Button type="primary"  href={imageUrl+fileUrl} target="_blank" rel="noopener noreferrer">
          Download File
        </Button>
      </div>
    );
  };

  return (
    <>
      <Button
        type="primary"
        icon={<EyeOutlined />}
        onClick={() => setOpen(true)}
        style={{
          background: "linear-gradient(135deg, #1677ff 0%, #0958d9 100%)",
          border: "none",
          borderRadius: 8,
          fontWeight: 600,
          letterSpacing: "0.5px",
          boxShadow: "0 4px 12px rgba(22, 119, 255, 0.35)",
          height: 40,
          paddingInline: 20,
        }}
      >
       View
      </Button>

      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        title={
          <span style={{ display: "flex", alignItems: "center" }}>
            {getFileIcon(fileType)}
            {fileName}
          </span>
        }
        width="80vw"
        centered
        styles={{
          body: { padding: "16px 0 0" },
        }}
        destroyOnClose
      >
        {renderContent()}
      </Modal>
    </>
  );
}

// --- Usage Example ---
// import FileViewerButton from "./FileViewerButton";
//
// <FileViewerButton
//   fileUrl="https://example.com/sample.pdf"
//   fileName="Sample Document"
// />