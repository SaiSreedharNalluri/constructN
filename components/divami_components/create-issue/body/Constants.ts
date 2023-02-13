export const TASK_FORM_CONFIG = [
  {
    id: "title",
    type: "textfield",
    defaultValue: "",
    formLabel: "Title",
    placeholder: "Title",
  },
  {
    id: "issueType",
    type: "select",
    defaultValue: "",
    placeHolder: "Select",
    label: "Material (Optional)",
    isLarge: false,
    isError: false,
    isReq: false,
    isflex: false,
    formLabel: "Select the Type of Issue",
    options: [
      {
        label: "Plastic",
        value: "plastic",
        selected: false,
      },
      {
        label: "Metalic",
        value: "metalic",
        selected: false,
      },
    ],
  },
  {
    id: "description",
    type: "textarea",
    defaultValue: "",
    formLabel: "Tell more about the Issue",
    placeholder: "Tell more about the issue",
  },
  {
    id: "issuePriority",
    type: "select",
    defaultValue: "",
    placeHolder: "Select",
    label: "Material (Optional)",
    isLarge: false,
    isError: false,
    isReq: false,
    isflex: false,
    formLabel: "Select Issue Priority",
    options: [
      {
        label: "Plastic",
        value: "plastic",
        selected: false,
      },
      {
        label: "Metalic",
        value: "metalic",
        selected: false,
      },
    ],
  },
  {
    id: "assignedTo",
    type: "search",
    formLabel: "Assigned To",
    listOfEntries: [
      { label: "The Shawshank Redemption", year: 1994 },
      { label: "The Godfather", year: 1972 },
      { label: "The Godfather: Part II", year: 1974 },
      { label: "The Dark Knight", year: 2008 },
      { label: "12 Angry Men", year: 1957 },
      { label: "Schindler's List", year: 1993 },
    ],
    selectedName: null,
    label: "Select Name or Team",
  },
  {
    id: "dates",
    type: "doubleField",
    fields: [
      {
        id: "start-date",
        type: "datePicker",
        defaultValue: "",
        label: "MM/DD/YYYY",
        formLabel: "Start Date",
        isError: false,
        isReq: true,
      },
      {
        id: "due-date",
        type: "datePicker",
        defaultValue: "",
        label: "MM/DD/YYYY",
        formLabel: "Due Date",
        isError: false,
        isReq: true,
      },
    ],
  },
  {
    id: "tag-suggestions",
    type: "chip",
    chipString: [],
    formLabel: "Enter Some Suggested Tags",
  },
  {
    id: "file-upload",
    type: "file",
    selectedFiles: null,
  },
];
export const TYPES_OF_ISSUES = [
  {
    id: "issues",
    type: "select",
    defaultValue: "",
    placeHolder: "Select",
    label: "Material (Optional)",
    isLarge: false,
    isError: false,
    isReq: false,
    isflex: false,
    options: [
      {
        label: "Plastic",
        value: "plastic",
        selected: false,
      },
      {
        label: "Metalic",
        value: "metalic",
        selected: false,
      },
    ],
  },
];

export const MORE_ABOUT_ISSUE = [
  {
    id: "issueDescription",
    type: "textarea",
    defaultValue: "",
    placeholder: "Tell more about the issue",
  },
];

export const DATE_PICKER_DATA = [
  {
    id: "start-date",
    type: "datePicker",
    defaultValue: "",
    label: "MM/DD/YYYY",
    isError: false,
    isReq: true,
  },
];

export const SEARCH_CONFIG = [
  {
    id: "search-name",
    type: "search",
    listOfEntries: [
      { label: "The Shawshank Redemption", year: 1994 },
      { label: "The Godfather", year: 1972 },
      { label: "The Godfather: Part II", year: 1974 },
      { label: "The Dark Knight", year: 2008 },
      { label: "12 Angry Men", year: 1957 },
      { label: "Schindler's List", year: 1993 },
    ],
    selectedName: null,
    label: "Select Name or Team",
  },
];

export const FILE_UPLOAD_CONFIG = [
  {
    id: "file-upload",
    type: "file",
    selectedFiles: null,
  },
];

export const TAG_CONFIG = [
  {
    id: "tag-suggestions",
    type: "chip",
    chipString: [],
  },
];
