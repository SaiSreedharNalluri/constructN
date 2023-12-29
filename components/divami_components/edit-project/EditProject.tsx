import React, { useState } from "react";
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
  projectData,
  handleEditClose,
  handleUpdateProject,
}: any) => {
  const [formData, setFormData] = useState<any>(null);
  const [validate, setValidate] = useState(false);
  const [showPopUp, setshowPopUp] = useState(false);
  const [canBeDisabled, setCanBeDisabled] = useState(false);
  const formHandler = (event: any) => {
    if (event === "Cancel") {
      setshowPopUp(true);
    } else {
      setValidate(true);
      let isError = 0;
      for(let i = 0; i < formData.length; i++){
        console.log(i,formData.length,formData[i]);
        
        if(formData[i].isReq === true && formData[i].isError === true){
          isError++;
        }
      }
      if(isError == 0){
        setValidate(true);
        handleUpdateProject(formData);
        }
    }

  };
  const handleFormData = (data: any) => {
    setFormData(data);
  };
  return (
    <StyledDiv>
      <Header closeEditProject={handleEditClose} />
      <Body
        handleFormData={handleFormData}
        editData={projectData}
        validate={validate}
        setIsValidate={setValidate}
        setCanBeDisabled={setCanBeDisabled}
      />
      <Footer formHandler={formHandler} canBeDisabled={canBeDisabled} />
      {showPopUp && (
        <PopupComponent
          open={showPopUp}
          setShowPopUp={setshowPopUp}
          modalTitle={"Cancel"}
          modalmessage={`Are you sure you want to cancel 'Edit Project'?`}
          primaryButtonLabel={"Yes"}
          SecondaryButtonlabel={"No"}
          callBackvalue={handleEditClose}
        />
      )}
    </StyledDiv>
  );
};

export default EditProject;
