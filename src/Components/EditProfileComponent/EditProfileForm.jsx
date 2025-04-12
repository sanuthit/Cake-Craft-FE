import {
  Button,
  Checkbox,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Stack,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  editUserDetailsAction,
  getUserProfileAction,
} from "../../Redux/User/Action";
import ChangeProfilePhotoModal from "./ChangeProfilePhotoModal";
import { uploadToCloudinary } from "../../Config/UploadToCloudinary";

const EditProfileForm = () => {
  const { user } = useSelector((store) => store);
  const toast = useToast();
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [imageFile, setImageFile] = useState(null);

  const [initialValues, setInitialValues] = useState({
    name: "",
    username: "",
    email: "",
    bio: "",
    mobile: "",
    gender: "",
    website: "",
    private: false,
  });

  useEffect(() => {
    dispatch(getUserProfileAction(token));
  }, [token]);

  useEffect(() => {
    const newValue = {};
    for (let item in initialValues) {
      if (user.reqUser && user.reqUser[item]) {
        newValue[item] = user.reqUser[item];
      }
    }
    formik.setValues(newValue);
  }, [user.reqUser]);

  const formik = useFormik({
    initialValues: { ...initialValues },
    onSubmit: (values) => {
      const data = {
        jwt: token,
        data: { ...values, id: user.reqUser?.id },
      };
      dispatch(editUserDetailsAction(data));
      toast({
        title: "Account updated...",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    },
  });

  async function handleProfileImageChange(event) {
    const selectedFile = event.target.files[0];
    const image = await uploadToCloudinary(selectedFile);
    setImageFile(image);
    const data = {
      jwt: token,
      data: { image, id: user.reqUser?.id },
    };
    dispatch(editUserDetailsAction(data));
    onClose();
  }

  return (
    <div
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        padding: "40px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
        backgroundColor: "#ffffff",
        maxWidth: "800px",
        margin: "40px auto",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          paddingBottom: "28px",
          borderBottom: "1px solid #e2e8f0",
          marginBottom: "24px",
        }}
      >
        <div style={{ width: "15%", textAlign: "center" }}>
          <img
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "9999px",
              objectFit: "cover",
            }}
            src={
              imageFile ||
              user.reqUser?.image ||
              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
            }
            alt="profile"
          />
        </div>
        <div>
          <p style={{ fontWeight: "bold", fontSize: "16px", marginBottom: "4px" }}>
            {user.reqUser?.username}
          </p>
          <p
            onClick={onOpen}
            style={{
              fontWeight: "600",
              color: "#3182ce",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Change Profile Photo
          </p>
        </div>
      </div>

      <form onSubmit={formik.handleSubmit}>
        <Stack spacing="6">
          {[
            { id: "name", label: "Name", type: "text" },
            { id: "username", label: "Username", type: "text" },
            { id: "website", label: "Website", type: "text" },
            { id: "bio", label: "Bio", type: "textarea" },
            { id: "email", label: "Email address", type: "email" },
            { id: "mobile", label: "Phone number", type: "tel" },
            { id: "gender", label: "Gender", type: "text" },
          ].map(({ id, label, type }) => (
            <FormControl key={id} display="flex" alignItems="center" id={id}>
              <FormLabel style={{ width: "15%", fontSize: "14px" }}>{label}</FormLabel>
              <div style={{ width: "100%" }}>
                {type === "textarea" ? (
                  <Textarea
                    placeholder={label}
                    {...formik.getFieldProps(id)}
                    size="md"
                    borderRadius="md"
                    _focus={{ borderColor: "#3182ce", boxShadow: "sm" }}
                  />
                ) : (
                  <Input
                    placeholder={label}
                    {...formik.getFieldProps(id)}
                    type={type}
                    size="md"
                    borderRadius="md"
                    _focus={{ borderColor: "#3182ce", boxShadow: "sm" }}
                  />
                )}
              </div>
            </FormControl>
          ))}

          

          <div>
            <Button
              colorScheme="blue"
              type="submit"
              style={{
                padding: "10px 24px",
                borderRadius: "8px",
                fontWeight: "600",
                fontSize: "14px",
              }}
              _hover={{ bg: "blue.600" }}
            >
              Submit
            </Button>
          </div>
        </Stack>
      </form>

      <ChangeProfilePhotoModal
        handleProfileImageChange={handleProfileImageChange}
        isOpen={isOpen}
        onClose={onClose}
        onOpen={onOpen}
      />
    </div>
  );
};

export default EditProfileForm;
