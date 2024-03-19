export const projectConfig = [
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
        formLabel: "From",
        isError: false,
        isReq: false,
        fromFilters: true,
      },
      {
        id: "due-date",
        type: "datePicker",
        defaultValue: "",
        label: "MM/DD/YYYY",
        formLabel: "To",
        isError: false,
        isReq: false,
        fromFilters: true,
      },
    ],
  },
  {
    id: "numberOfMembersField",
    type: "doubleField",
    label: "Number of Members",
    isReadOnly: false,
    fields: [
      {
        id: "numberOfMembersSelect",
        type: "select",
        defaultValue: "",
        placeHolder: "Select condition",
        label: "Number of Members",
        isLarge: false,
        isError: false,
        isReq: false,
        isflex: false,
        isReadOnly: false,
        width: "199px !important",
        formLabel: "Number of Users",

        options: [
          {
            label: "Greater Than",
            value: "greaterThan",
            selected: false,
          },
          {
            label: "Less Than",
            value: "lessThan",
            selected: false,
          },
          {
            label: "Equal To",
            value: "equalTo",
            selected: false,
          },
        ],
        styles: {
          borderTopRightRadius: "0",
          borderBottomRightRadius: "0",
          borderRight: "1px solid white",
        },
      },
      {
        id: "numberOfMembersValue",
        type: "textfield",
        defaultValue: "",
        width: "199px !important",
        formLabel: "",
        placeholder: "Enter number of users",
        isError: false,
        isReq: false,
        isReadOnly: false,
        styles: {
          borderTopLeftRadius: "0",
          borderBottomLeftRadius: "0",
        },
      },
    ],
  },
];
