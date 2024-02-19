import { styled } from "@mui/system";
import { Button } from "@mui/material";
import React from "react";
import { Mixpanel } from "../../analytics/mixpanel";

interface ContainerProps {
  loginField: boolean;
  createIssueForm: boolean;
}
const StyledButtonDisable = styled(Button)((props: any) => ({
  width: "180px !important",
  height: "40px",
  textTransform: "none",
  backgroundColor: "#888888 !important",
  color: "#ffffff !important",
  fontFamily: "Open Sans",
  fontStyle: "normal",
  fontWeight: "400",
  fontSize: "16px",
  lineHeight: "16px",
})) as any;

const StyledButton = styled(Button)((props: any) => ({
  // border: "2px solid red",

  width: props.loginField ? "340px" : "180px !important",
  height: "40px",
  textTransform: "none",
  backgroundColor: props.loginField ? "#888888 !important" : "",
  color: props.loginField ? "#ffffff !important" : "",
  fontFamily: "Open Sans",
  fontStyle: "normal",
  fontWeight: "400",
  fontSize: "16px",
  lineHeight: "16px",
})) as any;

const ContainedButton = styled(StyledButton)({
  backgroundColor: "#f1742e !important",
  color: "#ffffff",
  fontFamily: "Open Sans",
  fontStyle: "normal",
  fontWeight: "400",
  fontSize: "16px",
  lineHeight: "16px",
  "&:hover": {
    backgroundColor: "#f1742e",
    color: "#ffffff",
  },
});

const OulinedButton = styled(StyledButton)({
  backgroundColor: "#ffffff",
  color: "#f1742e",
  borderColor: "#f1742e",
  fontFamily: "Open Sans",
  fontStyle: "normal",
  fontWeight: "400",
  fontSize: "16px",
  lineHeight: "16px",
  "&:hover": {
    backgroundColor: "#ffffff",
    borderColor: "#f1742e",
  },
});

const CustomButton = (props: any) => {
  const {
    type,
    label,
    formHandler,
    setButtonClicked,
    loginField,
    disabledButton,
    projectId,
    ref,
    userId="",isButton
  } = props;
const createMixpanelEventData = (label:string, isButton:string, projectId:string, userId:string) => {
  let name, screen_name, event_category, event_action;

  switch (label) {
    case "Sign In":
      name = "loginin_button_clicked";
      screen_name = "login_page";
      event_category = "login";
      event_action = "login_button_clicked";
      break;
    case "Create Account":
      name = "sign_up_button_clicked";
      screen_name = "signup_page";
      event_category = "signup";
      event_action = "sign_up_button_clicked";
      break;
    case "Add User":
      name = isButton === "addUser" ? "add_users_clicked" : "add_new_user_clicked";
      screen_name = "manage_users_page";
      event_category = "manage_users";
      event_action = isButton === "addUser" ? "add_users_clicked" : "add_new_user_clicked";
      break;
    case "Apply":
      name = isButton === "ManageUsers" ? "apply_clicked" : "apply_clicked";
      screen_name = isButton === "ManageUsers" ? "manage_users_page" : "project_list_page";
      event_category = isButton === "ManageUsers" ? "filters" : "filtes";
      event_action = "apply_clicked";
      break;
    case "Back":
      name = isButton === "addUser" ? "back_clicked" : "back_clicked";
      screen_name = isButton === "addUser" ? "manage_users_page" : "";
      event_category = isButton === "addUser" ? "manage_users" : "";
      event_action = isButton === "addUser" ? "back_clicked" : "";
      break;
    case "Cancel":
      name = isButton === "ManageUsers" ? "close_clicked" : "close_clicked";
      screen_name = isButton === "ManageUsers" ? "manage_users_page" : "projects_list_page";
      event_category = isButton === "ManageUsers" ? "filters" : "filers";
      event_action = isButton === "ManageUsers" ? "close_clicked" : "close_clicked";
      break;
    default:
      name = "";
      screen_name = "";
      event_category = "";
      event_action = "";
  }

  return {
    name,
    screen_name,
    event_category,
    event_action,
    project_id: projectId !== undefined && projectId !== null ? projectId : "unknown",
    company_id: "unknown",
    user_id: userId !== undefined && userId !== null ? userId : "unknown",
  };
};

  if (type === "contained") {
    return (
      <div>
        <ContainedButton
          data-testid="testing_button"
          variant="contained"
          onClick={() => {
            formHandler(label);
            setButtonClicked ? setButtonClicked(true) : null;
            const mixpanelEventData = createMixpanelEventData(label, isButton, projectId, userId);
            Mixpanel.track(mixpanelEventData);
          }}
          onKeyDown={(e: any) => {
            if (e.key === "Enter") {
              formHandler(label);
              setButtonClicked ? setButtonClicked(true) : null;
            } else if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
              e.stopPropagation();
            }
          }}
          loginField={loginField}
          ref={ref}
          disabled={disabledButton}
        >
          {label}
        </ContainedButton>
      </div>
    );
  } else if (type === "formik") {
    return (
      <div>
        <ContainedButton
          data-testid="testing_button"
          type="submit"
          variant="contained"
        >
          {label}
        </ContainedButton>
      </div>
    );
  } else if (type === "outlined") {
    return (
      <div>
        <OulinedButton
          data-testid="testing_button"
          variant="outlined"
          onClick={() =>{ 
            const mixpanelEventData = createMixpanelEventData(label, isButton, projectId, userId);
            Mixpanel.track(mixpanelEventData);         
            formHandler(label)
          }}
        >
          {label}
        </OulinedButton>
      </div>
    );
  } else if (type === "disabled") {
    return (
      <div>
        {loginField ? (
          <StyledButton
            data-testid="testing_button"
            variant="outlined"
            disabled
            loginField={loginField}
          >
            {label}
          </StyledButton>
        ) : (
          <StyledButtonDisable
            data-testid="testing_button"
            variant="outlined"
            disabled
          >
            {label}
          </StyledButtonDisable>
        )}
      </div>
    );
  } else {
    return <></>;
  }
};

export default CustomButton;
