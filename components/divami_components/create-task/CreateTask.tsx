import React, { useEffect, useState } from "react";
import Body from "./body/Body";
import Footer from "./footer/Footer";
import Header from "./header/Header";
import { styled } from "@mui/system";
import { createTask } from "../../../services/task";

const StyledDiv = styled("span")({
  fontFamily: '"Open Sans"',
  display: "block",
  color: "#888888",
  // fontStyle: "italic",
  // fontWeight: "400",
  // fontSize: "14px",
  // lineHeight: "19px",
  // background: '#FFFFFF',
  height: "calc(100vh - 134px)",
  //   paddingLeft: '20px',
  //   paddingRight: '20px',
  // overflow: 'scroll'
});
const CreateTask = ({ handleCreateTask, setOpenCreateTask, editData }: any) => {
  const [formData, setFormData] = useState(null);

  const formHandler = (event: any) => {
    if (event === "Cancel") {
      setOpenCreateTask(false);
    } else {
      handleCreateTask(formData);
      setOpenCreateTask(false);
    }
  };

  const handleFormData = (data: any) => {
    setFormData(data);
  };

  return (
    <StyledDiv>
      <Header setOpenCreateTask={setOpenCreateTask} />
      <Body handleFormData={handleFormData} editData={editData} />
      <Footer formHandler={formHandler} />
    </StyledDiv>
  );
};

export default CreateTask;
