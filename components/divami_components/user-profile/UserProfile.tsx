import React, { useEffect, useState } from "react";
import Body from "./body/Body";
import Header from "./header/Header";
import { styled } from "@mui/system";
import PopupComponent from "../../popupComponent/PopupComponent";
import router from "next/router";
import { CustomToast } from "../../divami_components/custom-toaster/CustomToast";
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
const UserProfile = ({ handleProfileClose, projectUsers }: any) => {
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
          CustomToast("unable to load the data","error");
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
          CustomToast("user profile updated successfully","success");
        }
      })
      .catch((error) => {
        if (error.success === false) {
        CustomToast(error?.message,"error");
        }
      });
  };
  const handleImageUPload = (e: any) => {
    const formData = new FormData();
    formData.append("file", e.file);
    updateProfileAvatar(formData).then((response) => {
      if (response.success === true) {
        CustomToast("user profile pic updated successfully","success");
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
      <div className="px-4">
      <Header closeEditProject={handleProfileClose} />
      </div>
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
