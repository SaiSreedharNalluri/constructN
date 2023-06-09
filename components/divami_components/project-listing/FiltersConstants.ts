export const projectConfig = [
  {
    id: "dates",
    type: "doubleField",
    isReadOnly: false,
    fields: [
      {
        id: "startDate",
        type: "datePicker",
        defaultValue: "",
        label: "MM/DD/YYYY",
        formLabel: "From",
        isError: false,
        isReq: false,
        fromFilters: true,
      },
      {
        id: "dueDate",
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
        defaultValue: "greaterThan",
        placeHolder: "Enter number of members",
        label: "Number of Members",
        isLarge: false,
        isError: false,
        isReq: true,
        isflex: false,
        isReadOnly: false,
        width: "199px !important",
        formLabel: "Number of Members",

        options: [
          {
            label: "Greater Than",
            value: "greaterThan",
            selected: true,
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
        placeholder: "Enter number of member",
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
