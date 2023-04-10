import React, { useEffect, useState } from "react";
import Body from "./body/Body";
import Footer from "./footer/Footer";
import Header from "./header/Header";
import { styled } from "@mui/system";
import { createTask } from "../../../services/task";
import { getTagsList } from "../../../services/tags";
import { useRouter } from "next/router";
import PopupComponent from "../../popupComponent/PopupComponent";

const StyledDiv = styled("span")({
  fontFamily: '"Open Sans"',
  display: "block",
  // color: "#888888",
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
const CreateIssue = ({
  handleCreateTask,
  setOpenCreateTask,
  currentProject,
  currentSnapshot,
  currentStructure,
  contextInfo,
  closeIssueCreate,
  editData,
  issueStatusList,
  onCancelCreate,
  deleteTheAttachment,
}: any) => {
  console.log(editData, "esdssditData", issueStatusList);
  const router = useRouter();
  const [formData, setFormData] = useState<any>(null);
  const [validate, setValidate] = useState(false);
  const [tagList, setTagList] = useState<[string]>([""]);
  const [showPopUp, setshowPopUp] = useState(false);
  const [canBeDisabled, setCanBeDisabled] = useState(false);

  const formHandler = (event: any) => {
    if (event === "Cancel") {
      setshowPopUp(true);
    } else {
      setValidate(true);
      handleCreateTask(formData);
    }
  };

  const onCancelEdit = () => {
    closeIssueCreate();
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
      .catch((e) => console.log(e));
  }, []);

  return (
    <StyledDiv>
      <Header
        closeIssueCreate={() => {
          setshowPopUp(true);
        }}
        editData={editData}
      />
      <Body
        handleFormData={handleFormData}
        editData={editData}
        validate={validate}
        setIsValidate={setValidate}
        tagsList={tagList}
        issueStatusList={issueStatusList}
        setCanBeDisabled={setCanBeDisabled}
        deleteTheAttachment={deleteTheAttachment}
      />
      <Footer
        formHandler={formHandler}
        editData={editData}
        canBeDisabled={canBeDisabled}
      />
      {showPopUp && (
        <PopupComponent
          open={showPopUp}
          setShowPopUp={setshowPopUp}
          modalTitle={"Cancel"}
          modalmessage={
            editData
              ? `Are you sure you want to cancel edit issue?`
              : `Are you sure you want to cancel create issue?`
          }
          primaryButtonLabel={"Yes"}
          SecondaryButtonlabel={"No"}
          callBackvalue={editData ? onCancelEdit : onCancelCreate}
        />
      )}
    </StyledDiv>
  );
};

export default CreateIssue;
