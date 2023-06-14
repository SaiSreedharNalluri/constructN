import React, { useEffect, useState } from "react";
import Body from "./body/Body";
import Header from "./header/Header";
import { styled } from "@mui/system";
import PopupComponent from "../../popupComponent/PopupComponent";
import router from "next/router";
import { toast } from "react-toastify";
import {
  getUserProfile,
  updateProfileAvatar,
  updateUserProfile,
} from "../../../services/userAuth";
import { IUser } from "../../../models/IUser";
const StyledDiv = styled("span")({
  fontFamily: '"Open Sans"',
  display: "block",
  height: "calc(100vh - 60px)",
});
const UserProfile = ({ handleProfileClose, projectUsers ,closeProfileRef,handleClickOutsideProfileDrawer}: any) => {
  const [formData, setFormData] = useState<any>(null);
  const [validate, setValidate] = useState(false);
  const [showPopUp, setshowPopUp] = useState(false);
  const [canBeDisabled, setCanBeDisabled] = useState(false);
  const [userDetails, setUserDetails] = useState<IUser>();
  const handleFormData = (data: any) => {
    setFormData(data);
  };
  const [isUserProfileDrawerOpen, setIsUserProfileDrawerOpen] = useState(false);
  useEffect(() => {
    if (router.isReady) {
      getUserProfile()
        .then((response) => {
          if (response.success === true) {
            setUserDetails(response.result);
          }
        })
        .catch((error) => {
          toast.error("unable to load the data");
        });
    }
  }, []);

  const updateProfileInfo = (updateInfo: {
    firstName: string;
    lastName: string;
    email: string;
    dob: string;
  }) => {
    updateUserProfile(updateInfo)
      .then((response) => {
        if (response?.success === true) {
          setUserDetails(response?.result);
          setIsUserProfileDrawerOpen(false);
          toast.success("user profile updated successfully");
        }
      })
      .catch((error) => {
        if (error.success === false) {
          toast.error(error?.message);
        }
      });
  };
  const handleImageUPload = (e: any) => {
    const formData = new FormData();
    formData.append("file", e.file);
    updateProfileAvatar(formData).then((response) => {
      if (response.success === true) {
        toast.success("user profile pic updated successfully");
        setUserDetails(response?.result);
        setIsUserProfileDrawerOpen(false);
        const fileInput = document.getElementById(
          "file-upload"
        ) as HTMLInputElement;
        if (fileInput) {
          fileInput.value = "";
        }
      }
    });
  };
  return (
    <StyledDiv>
      <Header closeEditProject={handleProfileClose} />
      <Body
        handleFormData={handleFormData}
        userDetails={userDetails as IUser}
        updateProfileInfo={updateProfileInfo}
        validate={validate}
        setIsValidate={setValidate}
        setCanBeDisabled={setCanBeDisabled}
        isUserProfileDrawerOpen={isUserProfileDrawerOpen}
        setIsUserProfileDrawerOpen={setIsUserProfileDrawerOpen}
        handleImageUPload={handleImageUPload}
        closeProfileRef={closeProfileRef}
        handleClickOutsideProfileDrawer={handleClickOutsideProfileDrawer}
      />
      {showPopUp && (
        <PopupComponent
          open={showPopUp}
          setShowPopUp={setshowPopUp}
          modalTitle={"Cancel"}
          modalmessage={`Are you sure you want to cancel user profile? `}
          primaryButtonLabel={"Yes"}
          SecondaryButtonlabel={"No"}
          callBackvalue={handleProfileClose}
        />
      )}
    </StyledDiv>
  );
};

export default UserProfile;
