import React, { useEffect, useState } from "react";
import Body from "./body/Body";
import Footer from "./footer/Footer";
import Header from "./header/Header";
import { styled } from "@mui/system";
import { createTask } from "../../../services/task";
import { getTagsList } from "../../../services/tags";
import { useRouter } from "next/router";
import PopupComponent from "../../popupComponent/PopupComponent";
import CustomLoader from "../custom_loader/CustomLoader";

const StyledDiv = styled("span")({
  fontFamily: '"Open Sans"',
  display: "block",
  height: "calc(100vh - 60px)",
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
  setLoading,
  isLoading
}: any) => {
  const router = useRouter();
  const [formData, setFormData] = useState<any>(null);
  const [validate, setValidate] = useState(false);
  const [tagList, setTagList] = useState<[string]>([""]);
  const [showPopUp, setshowPopUp] = useState(false);
  const [canBeDisabled, setCanBeDisabled] = useState(false);
  const formHandler = (event: any) => {
  
    if (event === "Cancel") {
      setshowPopUp(true);
    } 
    else {
      setValidate(true);
      let isError = 0;
      const dateIndex = formData?.findIndex((ele: any) => ele.id === "dates");
      if (dateIndex !== -1) {
        if (formData[dateIndex].fields[0].isError && formData[dateIndex].fields[0].isError){
            isError++
        }
      }
      for(let i = 0; i < formData.length; i++){
        if(formData[i].isReq === true && formData[i].isError === true){
          isError++;
        }
      }

      if(isError == 0){
        setValidate(true);
        handleCreateTask(formData);
        if(isLoading===false){
          setLoading(true)}
        }
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
    const setFormDataInfo=(data:any)=>{
      setFormData(data)
    }
  return (
    <StyledDiv >
      {isLoading&&<CustomLoader></CustomLoader>}
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
        setFormDataInfo={setFormDataInfo}
        setFormData={setFormData}
        formData={formData}
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
              ? `Are you sure you want to cancel 'Edit Issue'?`
              : `Are you sure you want to cancel 'Create Issue'?`
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
