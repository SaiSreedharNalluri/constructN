import React, { useEffect, useState } from "react";
import Body from "./body/Body";
import Footer from "./footer/Footer";
import Header from "./header/Header";
import { styled } from "@mui/system";
import { createTask } from "../../../services/task";
import { CustomToaster } from "../custom-toaster/CustomToaster";
import PopupComponent from "../../popupComponent/PopupComponent";

const StyledDiv = styled("span")({
  fontFamily: '"Open Sans"',
  display: "block",
  color: "#888888",
  // fontStyle: "italic",
  // fontWeight: "400",
  // fontSize: "14px",
  // lineHeight: "19px",
  // background: '#FFFFFF',
  height: "calc(100vh - 60px)",
  //   paddingLeft: '20px',
  //   paddingRight: '20px',
  // overflow: 'scroll'
});
const CreateTask = ({
  handleCreateTask,
  setOpenCreateTask,
  editData,
  closeTaskCreate,
}: any) => {
  const [formData, setFormData] = useState(null);
  const [validate, setValidate] = useState(false);
  const [showPopUp, setshowPopUp] = useState(false);

  const formHandler = (event: any) => {
    if (event === "Cancel") {
      setOpenCreateTask(false);
      // setshowPopUp(true);
    } else {
      setValidate(true);
      handleCreateTask(formData);
      // setOpenCreateTask(true);
    }
  };

  const onCancelEdit = () => {
    setOpenCreateTask(false);
    closeTaskCreate();
  };

  const handleFormData = (data: any) => {
    setFormData(data);
  };

  return (
    <StyledDiv>
      <Header closeTaskCreate={closeTaskCreate} editData={editData} />
      <Body
        handleFormData={handleFormData}
        editData={editData}
        validate={validate}
        setIsValidate={setValidate}
      />
      <Footer formHandler={formHandler} editData={editData} />
      {/* {showPopUp && (
        <PopupComponent
          open={showPopUp}
          setShowPopUp={setshowPopUp}
          modalTitle={"Cancel"}
          modalmessage={
            editData
              ? `Are you sure you want to cancel edit task?`
              : `Are you sure you want to cancel create task?`
          }
          primaryButtonLabel={"Yes"}
          SecondaryButtonlabel={"No"}
          callBackvalue={editData ? onCancelEdit : onCancelCreate}
        />
      )} */}
    </StyledDiv>
  );
};

export default CreateTask;
