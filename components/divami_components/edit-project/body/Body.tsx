import { styled } from "@mui/system";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { EDIT_PROJECT_FORM_CONFIG } from "./Constants";
import FormWrapper from "../../form-wrapper/FormWrapper";
import { useRouter } from "next/router";
import { getProjectTypes } from "../../../../services/project";
const BodyContainer = styled(Box)({
  paddingLeft: "20px",
  paddingRight: "20px",
  color: "#888888",
  overflowY: "auto",
  height: "calc(100% - 132px)",
  fontFamily: "Open Sans",
  fontStyle: "normal",
  fontWeight: "400",
  fontSize: "14px",
});
const FormElementContainer = styled(Box)({
  marginTop: "20px",
});
const Body = ({ setCanBeDisabled, editData, handleFormData }: any) => {
  const [formState, setFormState] = useState({ selectedValue: "" });
  const [formConfig, setFormConfig] = useState(EDIT_PROJECT_FORM_CONFIG);
  const [projectTypes, setProjectTypes] = useState([]);
  const router = useRouter();
  useEffect(() => {
    if (router.isReady) {
      getProjectTypes()
        .then((response) => {
          if (response.success === true) {
            setProjectTypes(response.result);
          }
        })
        .catch();
    }
  }, [router.isReady]);
  useEffect(() => {
    if (projectTypes?.length > 0 && editData) {
      setFormConfig((prev: any) => {
        let newFormConfig = prev.map((item: any) => {
          if (item.id === "title") {
            return {
              ...item,
              isDisabled: true,
              defaultValue: editData?.name || "",
            };
          }
          if (item.id === "description") {
            return {
              ...item,
              defaultValue: editData?.description || "",
            };
          }
          if (item.id === "utm") {
            return {
              ...item,
              defaultValue: editData?.utm || " ",
            };
          }
          if (item.id === "latitude") {
            return {
              ...item,
              isDisabled: true,
              defaultValue: editData?.location[0] || " ",
            };
          }
          if (item.id === "longitude") {
            return {
              ...item,
              isDisabled: true,
              defaultValue: editData?.location[1] || " ",
            };
          }
          if (item.id === "projectType") {
            return {
              ...item,
              options: projectTypes?.map((eachItem: any) => {
                return {
                  // ...eachItem,
                  label: eachItem,
                  value: eachItem,
                  selected: false,
                };
              }),
              defaultValue: editData.type,
            };
          }

          return item;
        });

        return newFormConfig;
      });
    }
  }, [editData, projectTypes]);
  useEffect(() => {
    let updatedFormData = [...formConfig];
    handleFormData(updatedFormData);
    let count = 0;
    formConfig.forEach((item: any) => {
      console.log(item.isError, "item.isEisError");
      if (item.isError) {
        count++;
      }
    });
  }, [formConfig]);
  return (
    <BodyContainer>
      <FormElementContainer>
        <FormWrapper
          config={formConfig}
          setFormConfig={setFormConfig}
          formState={formState}
          setFormState={setFormState}
          setCanBeDisabled={setCanBeDisabled}
        />
      </FormElementContainer>
    </BodyContainer>
  );
};
export default Body;
