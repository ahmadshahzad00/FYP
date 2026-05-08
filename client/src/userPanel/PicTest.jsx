import React, { useState } from "react";
import axios from "axios";

function PicTest() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);
    setResult(null);

    if (preview) URL.revokeObjectURL(preview);

    setPreview(URL.createObjectURL(file));
  };

  const handleCheck = async () => {
    if (!image) {
      alert("Please select an image first");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("image", image);

      const res = await axios.post(
        "http://localhost:5000/api/file/check-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResult(res.data);

    } catch (err) {
      console.error("Frontend Error:", err.response?.data || err.message);
      alert("Error checking image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Image Verification</h1>

      {/* FILE INPUT */}
      <input type="file" accept="image/*" onChange={handleImageChange} />

      {/* PREVIEW */}
      {preview && (
        <div style={{ marginTop: "10px" }}>
          <img
            src={preview}
            alt="preview"
            width="200"
            style={{ borderRadius: "8px" }}
          />
        </div>
      )}

      {/* BUTTON */}
      <button
        onClick={handleCheck}
        style={{ marginTop: "10px", padding: "8px 12px" }}
      >
        {loading ? "Checking..." : "Check Image"}
      </button>

      {/* RESULT */}
      {result && (
        <div style={{ marginTop: "20px" }}>
          <h3>Result</h3>

          <p><b>File:</b> {result.fileName}</p>

          <p><b>EXIF:</b></p>
          <pre>{JSON.stringify(result.exif, null, 2)}</pre>

          <p><b>AI Detection (Hive):</b></p>
          <pre>{JSON.stringify(result.aiCheck, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default PicTest;