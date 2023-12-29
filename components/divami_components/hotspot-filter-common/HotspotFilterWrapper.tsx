import CustomCalender from "../custom-datepicker/CustomCalender";
import CustomFileInput from "../custom-file-input/CustomFileInput";
import CustomLabel from "../custom-label/CustomLabel";
import CustomSearch from "../custom-search/CustomSearch";
import CustomSelect from "../custom-select/CustomSelect";
import CustomTagSuggestion from "../custom-tag-suggestion/CustomTagSuggestion";
import { CustomTextField } from "../custom-textfield/CustomTextField";
import { styled } from "@mui/system";
import { Box } from "@mui/material";
import {
  DoubleFieldContainer,
  FormElementContainerWrapper,
} from "./HotspotFilterStyled";

const HotspotFilterFormWrapper = (props: any) => {
  const { config, formState, setFormConfig } = props;

  const handleTextChange = (e: any, id: string, data?: any) => {
    setFormConfig((prev: any) =>
      prev.map((item: any) => {
        if (id === item.id) {
          return {
            ...item,
            defaultValue: e.target.value,
          };
        }
        return item;
      })
    );
  };

  const handleDateChange = (e: any, id: string) => {
    setFormConfig((prev: any) =>
      prev.map((item: any) => {
        if (item.id === "dates") {
          return {
            ...item,
            fields: item.fields.map((eachField: any) => {
              return {
                ...eachField,
                defaultValue:
                  eachField.id == id
                    ? JSON.parse(JSON.stringify(e))
                    : eachField.defaultValue,
              };
            }),
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

  const handleFileUpload = (e: any, id: any) => {
    setFormConfig((prev: any) =>
      prev.map((item: any) => {
        if (id === item.id) {
          let files: any = [];
          Object.keys(e.target.files).forEach((eachkey) => {
            files.push(e.target.files[eachkey]);
          });
          return {
            ...item,
            selectedFile: files,
          };
        }
        return item;
      })
    );
  };

  const handleChipMaking = (chipsString: any, id: any) => {
    setFormConfig((prev: any) =>
      prev.map((item: any) => {
        if (id === item.id) {
          return {
            ...item,
            chipString: [...chipsString],
          };
        }
        return item;
      })
    );
  };

  const renderHTML = (data: any, isDisabled: boolean, index: number) => {
    switch (data.type) {
      case "select":
        return (
          <CustomSelect
            config={data}
            // defaultValue={formState[data.id]}
            id={data.id}
            sx={{ minWidth: 120 }}
            setFormConfig={setFormConfig}
            isError={data.isError}
            label=""
          />
        );
      case "textfield":
        return (
          <CustomTextField
            id={data.id}
            variant="outlined"
            placeholder={data?.placeholder}
            onChange={(e: any) => {
              handleTextChange(e, data.id, data);
            }}
            onBlur={(e: any) => {
              handleTextChange(e, data.id, data);
            }}
            defaultValue={data.placeHolder}
            isError={data.isError}
            dataTestId="inputTextField"
            isRequired={data.isReq}
            type={data.type}
            minVal={data?.minVal}
            maxVal={data?.maxVal}
            showRangeError={data.showRangeError}
            isDisabled={data.isDisabled}
            className={undefined}
            isValidField={false}
            errorMsg={""}
            showErrorMsg={false}
          />
        );
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
      case "file":
        return (
          <CustomFileInput
            handleFileUpload={(e: any) => handleFileUpload(e, data.id)}
          />
        );
      case "chip":
        return (
          <CustomTagSuggestion
            handleChipMaking={(chipsString: any) =>
              handleChipMaking(chipsString, data.id)
            }
          />
        );
      case "doubleField":
        return (
          <DoubleFieldContainer>
            {data.fields?.map((eachConfig: any, index: number) => {
              return (
                <Box key={eachConfig.id}>
                  {eachConfig.formLabel ?? (
                    <CustomLabel label={eachConfig.formLabel} />
                  )}
                  {renderHTML(eachConfig, false, index)}
                </Box>
              );
            })}
          </DoubleFieldContainer>
        );
      default:
        return "";
    }
  };

  return (
    <div>
      {config.map((eachConfig: any, index: any) => {
        return (
          <FormElementContainerWrapper key={eachConfig.id}>
            {eachConfig.formLabel ?? (
              <CustomLabel label={eachConfig.formLabel} />
            )}
            {renderHTML(eachConfig, false, index)}
          </FormElementContainerWrapper>
        );
      })}
    </div>
  );
};

export default HotspotFilterFormWrapper;
