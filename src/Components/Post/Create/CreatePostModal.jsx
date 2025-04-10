import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal";

import React, { useState } from "react";
import { FaPhotoVideo } from "react-icons/fa";
import { GoLocation } from "react-icons/go";
import { GrEmoji } from "react-icons/gr";
import { Button } from "@chakra-ui/button";
import { useDispatch, useSelector } from "react-redux";
import { createPost } from "../../../Redux/Post/Action";
import { uploadToCloudinary } from "../../../Config/UploadToCloudinary";
import SpinnerCard from "../../Spinner/Spinner";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

const CreatePostModal = ({ onOpen, isOpen, onClose }) => {
  const [files, setFiles] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const { user } = useSelector(store => store);

  const [postData, setPostData] = useState({
    mediaUrls: [],
    caption: '',
    location: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPostData(prev => ({ ...prev, [name]: value }));
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    handleFiles(droppedFiles);
    setIsDragOver(false);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleOnChange = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    handleFiles(selectedFiles);
  };

  const handleFiles = async (files) => {
    const validFiles = files.filter(file =>
      file.type.startsWith("image/") || file.type.startsWith("video/")
    );

    if (validFiles.length === 0) {
      alert("Please select image or video files.");
      return;
    }

    setUploadStatus("uploading");
    try {
      const uploadPromises = validFiles.map(file => uploadToCloudinary(file));
      const urls = await Promise.all(uploadPromises);

      setPostData(prev => ({
        ...prev,
        mediaUrls: [...prev.mediaUrls, ...urls.filter(url => url)]
      }));
      setUploadStatus("uploaded");
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadStatus("error");
      alert("Failed to upload files. Please try again.");
    }
  };

  const handleNextMedia = () => {
    setCurrentMediaIndex(prev =>
      prev === postData.mediaUrls.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrevMedia = () => {
    setCurrentMediaIndex(prev =>
      prev === 0 ? postData.mediaUrls.length - 1 : prev - 1
    );
  };

  const handleSubmit = async () => {
    if (!token || postData.mediaUrls.length === 0) return;

    const data = {
      jwt: token,
      data: postData,
    };

    dispatch(createPost(data));
    handleClose();
  };

  const handleClose = () => {
    onClose();
    setFiles([]);
    setIsDragOver(false);
    setPostData({ mediaUrls: [], caption: '', location: "" });
    setUploadStatus("");
    setCurrentMediaIndex(0);
  };

  const isVideo = (url) => {
    return url.match(/\.(mp4|webm|ogg)$/i);
  };

  return (
    <div>
      <Modal size={"4xl"} isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent
          fontSize={"sm"}
          style={{
            borderRadius: "16px",
            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
            backdropFilter: "blur(4px)",
            overflow: "hidden"
          }}
        >
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px 30px",
            alignItems: "center"
          }}>
            <p style={{ fontWeight: "bold" }}>Create New Post</p>
            <Button
              onClick={handleSubmit}
              colorScheme="blue"
              size={"sm"}
              variant="ghost"
              isDisabled={postData.mediaUrls.length === 0}
            >
              Share
            </Button>
          </div>

          <hr style={{ borderTop: "1px solid #e2e8f0" }} />

          <ModalBody>
            <div style={{
              display: "flex",
              height: "70vh",
              justifyContent: "space-between",
              gap: "10px"
            }}>
              {/* Left Side */}
              <div style={{
                width: "50%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                borderRadius: "10px",
                border: "1px solid #e2e8f0",
                padding: "10px"
              }}>
                {uploadStatus === "" && (
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    style={{
                      width: "100%",
                      height: "100%",
                      border: `2px dashed ${isDragOver ? "#3182ce" : "#cbd5e0"}`,
                      borderRadius: "12px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      textAlign: "center",
                      backgroundColor: isDragOver ? "#ebf8ff" : "#f9fafb"
                    }}
                  >
                    <FaPhotoVideo style={{ fontSize: "24px", marginBottom: "8px", color: isDragOver ? "#2b6cb0" : "#4a5568" }} />
                    <p>Drag photos or videos here</p>
                    <label
                      htmlFor="file-upload"
                      style={{
                        marginTop: "10px",
                        cursor: "pointer",
                        color: "#3182ce",
                        fontWeight: "bold"
                      }}
                    >
                      Select from computer
                    </label>
                    <input
                      type="file"
                      id="file-upload"
                      accept="image/*, video/*"
                      multiple
                      onChange={handleOnChange}
                      style={{ display: "none" }}
                    />
                  </div>
                )}

                {uploadStatus === "uploading" && <SpinnerCard />}

                {uploadStatus === "uploaded" && (
                  <div style={{ width: "100%", height: "100%", position: "relative" }}>
                    {postData.mediaUrls.map((url, index) => (
                      <div
                        key={index}
                        style={{
                          position: "absolute",
                          inset: 0,
                          display: index === currentMediaIndex ? "flex" : "none",
                          justifyContent: "center",
                          alignItems: "center"
                        }}
                      >
                        {isVideo(url) ? (
                          <video
                            src={url}
                            controls
                            style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
                          />
                        ) : (
                          <img
                            src={url}
                            alt={`Media ${index + 1}`}
                            style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
                          />
                        )}
                      </div>
                    ))}

                    {postData.mediaUrls.length > 1 && (
                      <div style={{
                        position: "absolute",
                        bottom: "10px",
                        left: 0,
                        right: 0,
                        display: "flex",
                        justifyContent: "center",
                        gap: "6px"
                      }}>
                        {postData.mediaUrls.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentMediaIndex(index)}
                            style={{
                              width: "8px",
                              height: "8px",
                              borderRadius: "50%",
                              backgroundColor: index === currentMediaIndex ? "#3182ce" : "#cbd5e0",
                              border: "none"
                            }}
                            aria-label={`Go to media ${index + 1}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Divider */}
              <div style={{
                width: "1px",
                backgroundColor: "#e2e8f0"
              }}></div>

              {/* Right Side */}
              <div style={{ width: "50%", padding: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                  <img
                    style={{ width: "32px", height: "32px", borderRadius: "50%" }}
                    src={user?.reqUser?.image || "https://cdn.pixabay.com/photo/2023/02/28/03/42/ibex-7819817_640.jpg"}
                    alt=""
                  />
                  <p style={{ fontWeight: "600" }}>{user?.reqUser?.username}</p>
                </div>

                <textarea
                  style={{
                    width: "100%",
                    border: "none",
                    resize: "none",
                    outline: "none",
                    fontSize: "14px",
                    padding: "8px",
                    borderRadius: "8px",
                    backgroundColor: "#f7fafc",
                    marginBottom: "4px"
                  }}
                  placeholder="Write a description..."
                  name="caption"
                  rows="6"
                  value={postData.caption}
                  onChange={handleInputChange}
                />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 4px 8px" }}>
                  <GrEmoji />
                  <p style={{ opacity: "0.6" }}>{postData.caption?.length}/2,200</p>
                </div>
                <hr />

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0" }}>
                  <input
                    style={{
                      border: "none",
                      outline: "none",
                      fontSize: "14px",
                      backgroundColor: "transparent"
                    }}
                    type="text"
                    placeholder="Add Location"
                    name="location"
                    value={postData.location}
                    onChange={handleInputChange}
                  />
                  <GoLocation />
                </div>
                <hr />
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CreatePostModal;
