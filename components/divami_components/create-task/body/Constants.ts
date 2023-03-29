
import Moment from "moment";


export const TASK_FORM_CONFIG = [
  {
    id: "title",
    type: "textfield",
    defaultValue: "",
    formLabel: "What shall we call this Task?",
    placeholder: "Title",
    isReadOnly: false,
    isError: false,
    isReq: true,
  },
  {
    id: "tasks",
    type: "select",
    defaultValue: "RFI",
    placeHolder: "Select",
    isReadOnly: false,
    label: "Select the type of task",
    isLarge: false,
    isError: false,
    isReq: true,
    isflex: false,
    formLabel: "Select the type of task",
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
    formLabel: "Tell us more about this task",
    placeholder: "Tell us more about this task",
    isError: false,
    isReq: true,
    isReadOnly: false,
  },
  {
    id: "taskPriority",
    type: "select",
    defaultValue: "Low",
    placeHolder: "Select",
    label: "Select task priority",
    isLarge: false,
    isError: false,
    isReq: true,
    isflex: false,
    isReadOnly: false,
    formLabel: "Select task priority",
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
    isReadOnly: false,
    formLabel: "Assigned to",
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
    defaultValue: [],
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
        defaultValue: Moment(new Date()).format("MM/DD/YYYY"),
        label: "MM/DD/YYYY",
        formLabel: "Start date",
        isError: false,
        isReq: false,
      },
      {
        id: "due-date",
        type: "datePicker",
        defaultValue: Moment(new Date()).format("MM/DD/YYYY"),
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
    isReadOnly: false,
    chipString: [],
    formLabel: "Enter some suggested tags",
    defaultValue: [],
    isError: false,
    isReq: false,
  },
  {
    id: "file-upload",
    type: "file",
    isReadOnly: false,
    selectedFiles: null,
    defaultValue: [],
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
    placeholder: "Tell us more about this task",
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
