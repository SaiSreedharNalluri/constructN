export const SIGN_UP_FORM_CONFIG = [
  {
    id: "firstName",
    type: "textfield",
    defaultValue: "",
    // formLabel: "What shall we call this issue?",
    placeholder: "First name",
    isError: false,
    isReq: true,
    isValidField: false,
    isReadOnly: false,
    imageIcon: "nameIcon",
    errorMsg: "",
    showErrorMsg: false,
    singleMsg:"true"
  },
  {
    id: "lastName",
    type: "textfield",
    defaultValue: "",
    // formLabel: "What shall we call this issue?",
    placeholder: "Last name",
    isError: false,
    isReq: true,
    isValidField: false,
    isReadOnly: false,
    imageIcon: "nameIcon",
    errorMsg: "",
    showErrorMsg: false,
    singleMsg:"true"

  },
  {
    id: "email",
    type: "textfield",
    defaultValue: "",
    // formLabel: "What shall we call this issue?",
    placeholder: "Email ID",
    isError: false,
    isReq: true,
    isValidField: true,
    isReadOnly: false,
    imageIcon: "emailIcon",
    errorMsg: "",
    showErrorMsg: false,
    singleMsg:"true"

  },
  {
    id: "password",
    type: "password",
    defaultValue: "",
    // formLabel: "What shall we call this issue?",
    placeholder: "Enter password",
    isError: false,
    isReq: true,
    isReadOnly: false,
    imageIcon: "passwordIcon",
    errorMsg: "",
    showErrorMsg: false,
    isValidField: true,
    checkPasswordStrength: true,
    singleMsg:"true"
    
  },

  {
    id: "confirm_password",
    type: "password",
    defaultValue: "",
    // formLabel: "What shall we call this issue?",
    placeholder: "Confirm password",
    isError: false,
    isReq: true,
    isReadOnly: false,
    imageIcon: "passwordIcon",
    errorMsg: "",
    showErrorMsg: false,
    isValidField: true,
    singleMsg:"true"

  },
];
