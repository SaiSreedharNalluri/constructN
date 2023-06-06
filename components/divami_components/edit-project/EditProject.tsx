import React, {useState } from "react";
import Body from "./body/Body";
import Footer from "./footer/Footer";
import Header from "./header/Header";
import { styled } from "@mui/system";
import PopupComponent from "../../popupComponent/PopupComponent";
const StyledDiv = styled("span")({
  fontFamily: '"Open Sans"',
  display: "block",
  height: "calc(100vh - 60px)",
});
const EditProject = ({
  handleEditClose
}: any) => {
  const [formData, setFormData] = useState<any>(null);
  const [validate, setValidate] = useState(false);
  const [showPopUp, setshowPopUp] = useState(false);
  const [canBeDisabled, setCanBeDisabled] = useState(false);
  const formHandler = (event: any) => {
    if (event === "Cancel") {
      setshowPopUp(true);
    } 
  };
  const handleFormData = (data: any) => {
    setFormData(data);
  };
  return (
    <StyledDiv>
      <Header
        closeEditProject={() => {
          setshowPopUp(true);
        }}
      />
      <Body
        handleFormData={handleFormData}
        validate={validate}
        setIsValidate={setValidate}
        setCanBeDisabled={setCanBeDisabled}
      />
      <Footer
        formHandler={formHandler}
        canBeDisabled={canBeDisabled}
      />
      {showPopUp && (
        <PopupComponent
          open={showPopUp}
          setShowPopUp={setshowPopUp}
          modalTitle={"Cancel"}
          modalmessage={
             `Are you sure you want to cancel edit project? `}
          primaryButtonLabel={"Yes"}
          SecondaryButtonlabel={"No"}
          callBackvalue={handleEditClose}
        />
      )}
    </StyledDiv>
  );
};

export default EditProject;
