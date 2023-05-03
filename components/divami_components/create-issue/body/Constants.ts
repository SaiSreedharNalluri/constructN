import Moment from "moment";

export const ISSUE_FORM_CONFIG = [
  {
    id: "title",
    type: "textfield",
    defaultValue: "",
    formLabel: "What shall we call this issue?",
    placeholder: "Enter Issue...",
    isError: false,
    isReq: true,
    isReadOnly: false,
  },
  {
    id: "issueType",
    type: "select",
    defaultValue: "",
    placeHolder: "Select",
    label: "Material (Optional)",
    isLarge: false,
    isError: false,
    isReq: true,
    isflex: false,
    isReadOnly: false,
    formLabel: "Select the type of issue",
    options: [],
  },
  {
    id: "description",
    type: "textarea",
    defaultValue: "",
    formLabel: "Tell us more about this issue",
    placeholder: "Tell us more about this issue",
    isError: false,
    isReq: false,
    isReadOnly: false,
  },
  {
    id: "issuePriority",
    type: "select",
    defaultValue: "",
    placeHolder: "Select issue priority",
    label: "Material (Optional)",
    isLarge: false,
    isError: false,
    isReq: true,
    isflex: false,
    isReadOnly: false,

    formLabel: "Select issue priority",
    options: [],
  },
  {
    id: "assignedTo",
    type: "search",
    formLabel: "Assigned To",
    isReadOnly: false,
    listOfEntries: [
      { label: "The Shawshank Redemption", year: 1994 },
      { label: "The Godfather", year: 1972 },
      { label: "The Godfather: Part II", year: 1974 },
      { label: "The Dark Knight", year: 2008 },
      { label: "12 Angry Men", year: 1957 },
      { label: "Schindler's List", year: 1993 },
    ],
    selectedName: null,
    isMultiSelect: true,

    label: "Select Name or Team",
    isError: false,
    isReq: false,
  },
  {
    id: "dates",
    type: "doubleField",
    isReadOnly: false,
    fields: [
      {
        id: "start-date",
        type: "datePicker",
        defaultValue: "",
        label: "MM/DD/YYYY",
        formLabel: "Start date",
        isError: false,
        isReq: false,
      },
      {
        id: "due-date",
        type: "datePicker",
        defaultValue: "",
        label: "MM/DD/YYYY",
        formLabel: "Due date",
        isError: false,
        isReq: false,
      },
    ],
  },
  {
    id: "tag-suggestions",
    type: "chip",
    chipString: [],
    isReadOnly: false,
    formLabel: "Enter some suggested tags",
    isError: false,
    isReq: false,
  },
  {
    id: "file-upload",
    type: "file",
    isReadOnly: false,
    selectedFiles: null,
    isError: false,
    isReq: false,
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
    options: [],
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
