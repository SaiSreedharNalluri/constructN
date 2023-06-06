import { styled } from "@mui/system";
import { Box } from "@mui/material";
import { useState } from "react";
import {
  EDIT_PROJECT_FORM_CONFIG
} from "./Constants";
import FormWrapper from "../../form-wrapper/FormWrapper";
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
const Body = ({
  setCanBeDisabled
}: any) => {
  const [formState, setFormState] = useState({ selectedValue: "" });
  const [formConfig, setFormConfig] = useState(EDIT_PROJECT_FORM_CONFIG);
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
