import { Box } from "@mui/material";
import { styled } from "@mui/system";
import CustomCalender from "../custom-datepicker/CustomCalender";
import CustomLabel from "../custom-label/CustomLabel";
import CustomSearch from "../custom-search/CustomSearch";

const FormElementContainer = styled(Box)({
  marginTop: '8px'
})

const DoubleFieldContainer = styled("div")({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between'
})

const TaskFilterFormWrapper = (props: any) => {
  const { config, formState, setFormConfig } = props;

  const handleDateChange = (e: any, id: string) => {
    setFormConfig((prev: any) =>
      prev.map((item: any) => {
        if (item.id === "dates") {
          return {
            ...item,
            fields: item.fields.map((eachField: any) => {
              return {
                ...eachField,
                defaultValue: eachField.id == id ? JSON.parse(JSON.stringify(e)) : eachField.defaultValue
              }
            })
          };
        } else if (id === item.id) {
          return {
            ...item,
            defaultValue: JSON.parse(JSON.stringify(e)),
          };
        }

        return item;
      })
    );
  };

  const handleSearchResult = (e: any, value: string, id: string) => {
    setFormConfig((prev: any) =>
      prev.map((item: any) => {
        if (id === item.id) {
          return {
            ...item,
            selectedName: value,
          };
        }
        return item;
      })
    );
  };





  const renderHTML = (data: any, isDisabled: boolean, index: number) => {
    switch (data.type) {
      case "datePicker":
        return (
          <CustomCalender
            data={data}
            onChange={(e: any) => {
              handleDateChange(e, data.id);
            }}
          />
        );
      case "search":
        return (
          <CustomSearch
            data={data}
            handleSearchResult={(e: any, value: string) => {
              handleSearchResult(e, value, data.id);
            }}
          />
        );
      default:
        return "";
    }
  };


  return (
    <div>
      {config.map((eachConfig: any, index: any) => {
        return (
          <FormElementContainer key={eachConfig.id}>
            {eachConfig.formLabel ?? (
              <CustomLabel label={eachConfig.formLabel} />
            )}
            {renderHTML(eachConfig, false, index)}
          </FormElementContainer>
        );
      })}
    </div>
  );
};

export default TaskFilterFormWrapper;
