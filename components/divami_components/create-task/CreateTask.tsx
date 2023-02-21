import { styled } from "@mui/system";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getTagsList } from "../../../services/tags";
import Body from "./body/Body";
import Footer from "./footer/Footer";
import Header from "./header/Header";

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
  const router = useRouter();
  const [formData, setFormData] = useState(null);
  const [validate, setValidate] = useState(false);
  const [tagList, setTagList] = useState<[string]>([""]);

  const formHandler = (event: any) => {
    if (event === "Cancel") {
      setOpenCreateTask(false);
    } else {
      setValidate(true);
      handleCreateTask(formData);
      // setOpenCreateTask(true);
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
      .catch((e) => console.log(e));
  }, []);

  return (
    <StyledDiv>
      <Header closeTaskCreate={closeTaskCreate} editData={editData} />
      <Body
        handleFormData={handleFormData}
        editData={editData}
        validate={validate}
        setIsValidate={setValidate}
        tagsList={tagList}
      />
      <Footer formHandler={formHandler} editData={editData} />
    </StyledDiv>
  );
};

export default CreateTask;
