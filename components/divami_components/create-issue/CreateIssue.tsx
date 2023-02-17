import React, { useEffect, useState } from "react";
import Body from "./body/Body";
import Footer from "./footer/Footer";
import Header from "./header/Header";
import { styled } from "@mui/system";
import { createTask } from "../../../services/task";
import { getTagsList } from "../../../services/tags";
import { useRouter } from "next/router";

const StyledDiv = styled("span")({
  fontFamily: '"Open Sans"',
  display: "block",
  // color: "#888888",
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
const CreateIssue = ({
  handleCreateTask,
  setOpenCreateTask,
  currentProject,
  currentSnapshot,
  currentStructure,
  contextInfo,
  closeIssueCreate,
  editData,
}: any) => {
  console.log(editData, "editData")
  const router = useRouter();
  const [formData, setFormData] = useState<any>(null);
  const [validate, setValidate] = useState(false);
  const [tagList, setTagList] = useState<[string]>([""]);

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

  useEffect(() => {
    getTagsList(router.query.projectId as string)
      .then((response) => {
        if (response.success === true) {
          setTagList(response.result[0]?.tagList);
        }
      })
      .catch(e => console.log(e));
  }, []);

  return (
    <StyledDiv>
      <Header
        setOpenCreateTask={setOpenCreateTask}
        closeIssueCreate={closeIssueCreate}
      />
      <Body
        handleFormData={handleFormData}
        editData={editData}
        validate={validate}
        setIsValidate={setValidate}
        tagsList={tagList}
      />
      <Footer formHandler={formHandler} />
    </StyledDiv>
  );
};

export default CreateIssue;
