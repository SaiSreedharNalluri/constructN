export const RESET_FORM_CONFIG = [

  {
    id: "password",
    type: "password",
    defaultValue: "",
    // formLabel: "What shall we call this issue?",
    placeholder: "Enter new password",
    isError: false,
    isReq: true,
    isReadOnly: false,
    imageIcon: "passwordIcon",
    errorMsg: "",
    showErrorMsg: false,
    isValidField: false,
    checkPasswordStrength:true
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
    isValidField: false,
  },
];
