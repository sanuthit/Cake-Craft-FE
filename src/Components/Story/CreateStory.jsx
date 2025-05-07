import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createStory } from "../../Redux/Story/Action";
import { useNavigate } from "react-router-dom";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { uploadToCloudinary } from "../../Config/UploadToCloudinary";

const CreateStory = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleFilePick = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewImage(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      if (!selectedFile) {
        alert("Please select an image");
        setLoading(false);
        return;
      }

      const imageUrl = await uploadToCloudinary(selectedFile);

      if (!imageUrl) {
        alert("Failed to upload image");
        setLoading(false);
        return;
      }

      const storyData = {
        image: imageUrl,
        captions: caption,
      };

      await dispatch(createStory({ story: storyData, jwt: token }));
      setLoading(false);
      navigate("/");
    } catch (error) {
      console.error("Error creating story:", error);
      setLoading(false);
      alert("Failed to create story");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(to right, #f0f9ff, #e0f2fe)",
        padding: "40px",
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "40px 30px",
          borderRadius: "20px",
          boxShadow: "0px 8px 25px rgba(0, 0, 0, 0.1)",
          maxWidth: "420px",
          width: "100%",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}
      >
        <h2
          style={{
            fontSize: "28px",
            fontWeight: "700",
            marginBottom: "25px",
            textAlign: "center",
            color: "#1e40af",
          }}
        >
          Share a New Story
        </h2>

        <form onSubmit={handleSubmit}> 
          {/* Upload Section */}
          <div
            style={{
              border: "2px dashed #cbd5e1",
              borderRadius: "12px",
              padding: "30px",
              textAlign: "center",
              marginBottom: "20px",
              backgroundColor: "#f9fafb",
              cursor: "pointer",
              transition: "all 0.3s ease-in-out",
            }}
            onClick={() => document.getElementById("fileInput").click()}
          >
            {previewImage ? (
              <img
                src={previewImage}
                alt="Preview"
                style={{
                  maxHeight: "200px",
                  borderRadius: "10px",
                  objectFit: "cover",
                }}
              />
            ) : (
              <>
                <AiOutlineCloudUpload
                  style={{ fontSize: "40px", color: "#94a3b8", marginBottom: "10px" }}
                />
                <p style={{ color: "#64748b", fontSize: "14px" }}>Click to upload image</p>
              </>
            )}
            <input
              type="file"
              id="fileInput"
              accept="image/*"
              onChange={handleFilePick}
              style={{ display: "none" }}
            />
          </div>

          {/* Caption Input */}
          <div style={{ marginBottom: "20px" }}>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption..."
              style={{
                width: "100%",
                padding: "12px 16px",
                fontSize: "14px",
                borderRadius: "10px",
                border: "1px solid #d1d5db",
                outline: "none",
              }}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: loading ? "#93c5fd" : "#2563eb",
              color: "white",
              fontWeight: "600",
              fontSize: "16px",
              border: "none",
              borderRadius: "10px",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background-color 0.3s ease-in-out",
            }}
          >
            {loading ? "Uploading..." : "Post Story"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateStory;
//story settings