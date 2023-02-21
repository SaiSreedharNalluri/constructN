import CustomCalender from "../custom-datepicker/CustomCalender";
import CustomFileInput from "../custom-file-input/CustomFileInput";
import CustomLabel from "../custom-label/CustomLabel";
import CustomSearch from "../custom-search/CustomSearch";
import CustomSelect, { ErrorField } from "../custom-select/CustomSelect";
import CustomTagSuggestion from "../custom-tag-suggestion/CustomTagSuggestion";
import { CustomTextField } from "../custom-textfield/CustomTextField";
import { CustomTextArea } from "../custom-textarea/CustomTextArea";

import { styled } from "@mui/system";
import { Box } from "@mui/material";
import { useEffect } from "react";

const FormElementContainer = styled(Box)({
  marginTop: "30px",
});
const ElementContainer = styled("div")({
  marginTop: "8px",
});
const DoubleFieldContainer = styled("div")({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
});

const FormWrapper = (props: any) => {
  const { config, formState, setFormConfig, validate, setIsValidate } = props;
  console.log("vak", config);

  useEffect(() => {
    if (validate) {
      console.log("coming");
      setFormConfig((prev: any) => {
        const newconfig = prev.map((item: any) => {
          if (item.isReq && !item.defaultValue) {
            return {
              ...item,
              isError: true,
            };
          } else {
            return { ...item, isError: false };
          }
        });
        console.log(newconfig, "newconfig");
        return newconfig;
      });
      setIsValidate(false);
    }
  }, [validate]);

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
    console.log(e, value, "sdfsdfsearch");
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
    console.log(chipsString, "chipsString");
    setFormConfig((prev: any) =>
      prev.map((item: any) => {
        if (id === item.id) {
          return {
            ...item,
            chipString: chipsString,
          };
        }
        return item;
      })
    );
  };

  const renderHTML = (
    data: any,
    isDisabled: boolean,
    index: number,
    configObject: any = config
  ) => {
    switch (data.type) {
      case "select":
        return (
          <ElementContainer>
            <CustomSelect
              config={data}
              defaultValue={data.defaultValue}
              id={data.id}
              sx={{ minWidth: 120 }}
              setFormConfig={setFormConfig}
              isError={data.isError}
              label=""
              data={data}
              isReadOnly={data.isReadOnly}
            />
          </ElementContainer>
        );
      case "textarea":
        return (
          <ElementContainer>
            <CustomTextArea
              id={data.id}
              variant="outlined"
              placeholder={data?.placeholder}
              onChange={(e: any) => {
                handleTextChange(e, data.id, data);
              }}
              onBlur={(e: any) => {
                handleTextChange(e, data.id, data);
              }}
              defaultValue={data.defaultValue}
              isError={data.isError}
              dataTestId="inputTextField"
              isRequired={data.isReq}
              type={data.type}
              minVal={data?.minVal}
              maxVal={data?.maxVal}
              showRangeError={data.showRangeError}
              isDisabled={data.isDisabled}
              className={undefined}
              isReadOnly={data.isReadOnly}
            />
          </ElementContainer>
        );
      case "textfield":
        return (
          <ElementContainer>
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
              defaultValue={data.defaultValue}
              isError={data.isError}
              dataTestId="inputTextField"
              isRequired={data.isReq}
              type={data.type}
              minVal={data?.minVal}
              maxVal={data?.maxVal}
              showRangeError={data.showRangeError}
              isDisabled={data.isDisabled}
              className={undefined}
              isReadOnly={data.isReadOnly}
            />
          </ElementContainer>
        );
      case "datePicker":
        return (
          <ElementContainer>
            {" "}
            <CustomCalender
              data={data}
              config={configObject}
              onChange={(e: any) => {
                handleDateChange(e, data.id);
              }}
              isReadOnly={data.isReadOnly}
            />
          </ElementContainer>
        );
      case "search":
        return (
          <ElementContainer>
            <CustomSearch
              data={data}
              handleSearchResult={(e: any, value: string) => {
                handleSearchResult(e, value, data.id);
              }}
              selectedName={data.selectedName}
              isReadOnly={data.isReadOnly}
            />
          </ElementContainer>
        );
      case "file":
        return (
          <ElementContainer>
            <CustomFileInput
              handleFileUpload={(e: any) => handleFileUpload(e, data.id)}
              data
            />
          </ElementContainer>
        );
      case "chip":
        return (
          <ElementContainer>
            {" "}
            <CustomTagSuggestion
              handleChipMaking={(chipsString: any) =>
                handleChipMaking(chipsString, data.id)
              }
              data={data}
            />
          </ElementContainer>
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
                  {renderHTML(eachConfig, false, index, data.fields)}
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

export default FormWrapper;
