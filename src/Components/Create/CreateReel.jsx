import {
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/modal";
import React, { useRef, useState } from "react";
import { FaPhotoVideo } from "react-icons/fa";
import { GoLocation } from "react-icons/go";
import { GrEmoji } from "react-icons/gr";
import { Button } from "@chakra-ui/button";
import { useDispatch, useSelector } from "react-redux";
import { uploadMediaToCloudinary } from "../../Config/UploadVideoToCloudnary";
import SpinnerCard from "../Spinner/Spinner";
import { createReel } from "../../Redux/Reel/Action";

const CreateReelModal = ({ onOpen, isOpen, onClose }) => {
  const finalRef = useRef(null);
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const { user } = useSelector((store) => store);

  const [file, setFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isImageUploaded, setIsImageUploaded] = useState("");
  const [videoUrl, setVideoUrl] = useState();
  const [postData, setPostData] = useState({
    video: "",
    caption: "",
    location: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPostData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOnChange = async (e) => {
    const file = e.target.files[0];
    if (file && (file.type.startsWith("image/") || file.type.startsWith("video/"))) {
      setFile(file);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => setVideoUrl(reader.result);

      setIsImageUploaded("uploading");
      const url = await uploadMediaToCloudinary(file);
      setPostData((prev) => ({ ...prev, video: url }));
      setIsImageUploaded("uploaded");
    } else {
      setFile(null);
      alert("Please select an image or video file.");
    }
  };

  const handleSubmit = async () => {
    if (token && postData.video) {
      const data = {
        jwt: token,
        reelData: postData,
      };
      dispatch(createReel(data));
      handleClose();
    }
  };

  const handleClose = () => {
    onClose();
    setFile(null);
    setIsDragOver(false);
    setPostData({ video: "", caption: "", location: "" });
    setIsImageUploaded("");
  };

  return (
    <Modal size="4xl" finalFocusRef={finalRef} isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent className="rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <p className="text-lg font-semibold">Create New Reel</p>
          <Button
            onClick={handleSubmit}
            colorScheme="blue"
            size="sm"
            variant="solid"
            className="rounded-full"
          >
            Share
          </Button>
        </div>

        {/* Modal Body */}
        <ModalBody className="p-0">
          <div className="flex h-[70vh]">
            {/* Left: Media Upload */}
            <div className="w-1/2 flex items-center justify-center bg-gray-50">
              {isImageUploaded === "" && (
                <div
                  onDragLeave={() => setIsDragOver(false)}
                  className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-gray-300 rounded-lg p-6 hover:bg-gray-100 transition"
                >
                  <FaPhotoVideo className={`text-4xl mb-3 ${isDragOver ? "text-blue-600" : "text-gray-400"}`} />
                  <p className="text-gray-600">Drag photos or videos here</p>
                  <label
                    htmlFor="file-upload"
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-full cursor-pointer hover:bg-blue-600 transition"
                  >
                    Select from computer
                  </label>
                  <input
                    type="file"
                    id="file-upload"
                    accept="image/*, video/*"
                    multiple
                    className="hidden"
                    onChange={handleOnChange}
                  />
                </div>
              )}

              {isImageUploaded === "uploading" && <SpinnerCard />}

              {postData.video && (
                <video
                  controls
                  className="w-full max-w-[90%] max-h-[80%] rounded-lg shadow-md"
                >
                  <source src={videoUrl} type="video/mp4" />
                </video>
              )}
            </div>

            {/* Divider */}
            <div className="w-[1px] bg-gray-300"></div>

            {/* Right: Form Inputs */}
            <div className="w-1/2 p-4 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={user?.reqUser?.image || "https://cdn.pixabay.com/photo/2023/02/28/03/42/ibex-7819817_640.jpg"}
                  alt="User"
                  className="w-9 h-9 rounded-full object-cover"
                />
                <span className="font-medium">{user?.reqUser?.username}</span>
              </div>

              <textarea
                name="caption"
                placeholder="Write a caption..."
                rows="6"
                maxLength="2200"
                className="w-full p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                onChange={handleInputChange}
              ></textarea>

              <div className="flex justify-between items-center text-gray-500 text-sm">
                <GrEmoji />
                <span>{postData.caption.length}/2,200</span>
              </div>

              <div className="flex items-center gap-2 border-t pt-3">
                <input
                  type="text"
                  name="location"
                  placeholder="Add Location"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                  onChange={handleInputChange}
                />
                <GoLocation className="text-gray-500 text-lg" />
              </div>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CreateReelModal;

//add new css files

