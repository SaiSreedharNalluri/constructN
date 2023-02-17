import React, { useEffect, useState } from "react";
import Body from "./body/Body";
import Footer from "./footer/Footer";
import Header from "./header/Header";
import { styled } from "@mui/system";
import { createTask } from "../../../services/task";
import { CustomToaster } from "../custom-toaster/CustomToaster";

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

  const formHandler = (event: any) => {
    if (event === "Cancel") {
      setOpenCreateTask(false);
    } else {
      setValidate(true);
      handleCreateTask(formData);
      // setOpenCreateTask(false);
    }
  };

  const handleFormData = (data: any) => {
    setFormData(data);
  };

  return (
    <StyledDiv>
      <Header closeTaskCreate={closeTaskCreate} />
      <Body
        handleFormData={handleFormData}
        editData={editData}
        validate={validate}
        setIsValidate={setValidate}
      />
      <Footer formHandler={formHandler} />
    </StyledDiv>
  );
};

export default CreateTask;
