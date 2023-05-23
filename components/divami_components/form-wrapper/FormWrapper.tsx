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
import { useEffect, useState } from "react";
import { FormText } from "../sign-in/SignInPageStyle";
import { Checkbox, InputAdornment, TextField } from "@mui/material";
import Checked from "../../../public/divami_icons/checked.svg";
import UnChecked from "../../../public/divami_icons/unchecked.svg";
import Mail from "../../../public/divami_icons/Mail.svg";
import lock from "../../../public/divami_icons/lock.svg";
import Image from "next/image";

interface ContainerProps {
  loginField: boolean;
}
// const FormElementContainer = styled(Box)({
//   marginTop: "40px",
// });
const FormElementContainer = styled(Box)<ContainerProps>`
  margin-top: ${(props) => (props.loginField ? "30px" : "40px")};
`;
const ElementContainer = styled("div")({
  marginTop: "8px",
});
const DoubleFieldContainer = styled("div")({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
});

const FormWrapper = (props: any) => {
  const {
    config,
    formState,
    setFormConfig,
    validate,
    setIsValidate,
    setCanBeDisabled,
    loginField,
  } = props;

  console.log("formState", formState);

  const [userPassword, setUserPassword] = useState("");
  useEffect(() => {
    console.log("userpassword", userPassword);
  }, [userPassword]);

  useEffect(() => {
    if (validate) {
      setFormConfig((prev: any) => {
        const newconfig = prev.map((item: any) => {
          if (item.isReq && !item.defaultValue && item.singleMsg) {
            setCanBeDisabled(false);
            return {
              ...item,
              isError: true,
              errorMsg: "Required *",
              showErrorMsg: item.showErrorMsg === false ? true : false,
            };
          }
          if (item.isReq && !item.defaultValue && item.singleMsg === false) {
            setCanBeDisabled(false);
            return {
              ...item,
              isError: true,
              errorMsg: "Required *",
              showErrorMsg: item.showErrorMsg === false ? true : false,
            };
          } else if (item.id === "dates") {
            const startDate = item?.fields[0].defaultValue;
            const endDate = item?.fields[1].defaultValue;
            if (startDate && endDate) {
              if (
                new Date(startDate)?.getTime() > new Date(endDate).getTime()
              ) {
                return { ...item, isError: true };
              }
            }
            return { ...item, isError: false };
          } else if (item.isValidField === false && item.id === "email") {
            setCanBeDisabled(false);
            return {
              ...item,
              isError: true,
              errorMsg: "Invalid User Email",
              showErrorMsg: true,
            };
          } else if (item.isValidField === false && item.id === "password") {
            setCanBeDisabled(false);
            return {
              ...item,
              isError: true,
              errorMsg: "Weak Password",
              showErrorMsg: true,
            };
          } else if (
            item.isValidField === false &&
            item.id === "confirm_password"
          ) {
            setCanBeDisabled(false);
            return {
              ...item,
              isError: true,
              errorMsg: "Password should Match",
              showErrorMsg: true,
            };
          } else {
            return { ...item, isError: false };
          }
        });
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
    let fieldHasValue = e !== null ? e["$D"] + e["$M"] + e["$y"] : null;
    setFormConfig((prev: any) =>
      prev.map((item: any) => {
        if (item.id === "dates") {
          return {
            ...item,
            fields: item.fields.map((eachField: any) => {
              return {
                ...eachField,
                isError:
                  (isNaN(fieldHasValue) && fieldHasValue !== null) ||
                  (JSON.stringify(e) == "null" &&
                    !isNaN(fieldHasValue) &&
                    fieldHasValue !== null),
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
          const newSelectedUser = Array.isArray(value)
            ? value.filter((selected: any, index: number, array: any[]) => {
                // Remove duplicate values based on label property
                return (
                  array.findIndex(
                    (elem: any) => elem.label === selected.label
                  ) === index
                );
              })
            : [];
          return {
            ...item,
            selectedName: newSelectedUser,
          };
        }
        return item;
      })
    );
  };

  const handleFileUpload = (e: any, id: any) => {
    let arr: any[] = [];
    setFormConfig((prev: any) =>
      prev.map((item: any) => {
        if (id === item.id) {
          let files: any = e.target.files;
          if (item.selectedFile?.length) {
            const filesnames = item.selectedFile.map((each: any) => each.name);
            Object.keys(files).forEach((eachkey) => {
              if (filesnames.indexOf(files[eachkey].name) === -1) {
                arr.push(files[eachkey]);
              }
            });
            return {
              ...item,
              selectedFile: [...item.selectedFile, ...arr],
            };
          } else {
            Object.keys(files).forEach((eachkey) => {
              arr.push(files[eachkey]);
            });
            return {
              ...item,
              selectedFile: arr,
            };
          }
        }
        return item;
      })
    );
  };

  const handleChipMaking = (chipsString: any, id: any) => {
    const specialArr = [];
    // if(chipsString[chipsString.length - 1].includes("@")) return
    const regex = /^[a-zA-Z ]+$/;
    if (!regex.test(chipsString[chipsString.length - 1])) {
      return;
    }

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

  function isValidEmail(email: any, id: any) {
    console.log("lol");
    if (/\S+@\S+\.\S+/.test(email)) {
      setFormConfig((prev: any) =>
        prev.map((item: any) => {
          if (id === item.id) {
            return {
              ...item,
              isValidField: true,
            };
          }
          return item;
        })
      );
    } else {
      setFormConfig((prev: any) =>
        prev.map((item: any) => {
          if (id === item.id) {
            return {
              ...item,
              isValidField: false,
            };
          }
          return item;
        })
      );
    }
    // return /\S+@\S+\.\S+/.test(email);
  }

  function checkPassword(str: any, id: any) {
    let rePass = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    let passwordTru = rePass.test(str);

    if (passwordTru) {
      setFormConfig((prev: any) =>
        prev.map((item: any) => {
          if (id === item.id) {
            return {
              ...item,
              isValidField: true,
            };
          }

          return item;
        })
      );
      setUserPassword(str);
    } else {
      setFormConfig((prev: any) =>
        prev.map((item: any) => {
          if (id === item.id) {
            return {
              ...item,
              isValidField: false,
            };
          }
          return item;
        })
      );
    }
  }

  function matchpassword(str: any, id: any) {
    console.log("matching", str, userPassword);
    if (str !== userPassword) {
      setFormConfig((prev: any) =>
        prev.map((item: any) => {
          if (id === item.id) {
            return {
              ...item,
              isValidField: false,
            };
          }

          return item;
        })
      );
    } else {
      setFormConfig((prev: any) =>
        prev.map((item: any) => {
          if (id === item.id) {
            return {
              ...item,
              isValidField: true,
            };
          }
          return item;
        })
      );
    }
  }

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
              dataTestId={`inputSelectField-${data.id}`}
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
              isRequired={data.isReq}
              type={data.type}
              minVal={data?.minVal}
              maxVal={data?.maxVal}
              showRangeError={data.showRangeError}
              isDisabled={data.isDisabled}
              className={undefined}
              isReadOnly={data.isReadOnly}
              dataTestId={`inputTextAreaField-${data.id}`}
            />
          </ElementContainer>
        );

      case "textfield":
      case "password":
      case "confirm_password":
        return (
          <ElementContainer>
            <CustomTextField
              id={data.id}
              variant="outlined"
              placeholder={data?.placeholder}
              onChange={(e: any) => {
                handleTextChange(e, data.id, data);
              }}
              // onChange={(e: any) => {
              //   console.log(e, "Fdsfdsfdsf");
              //   // handleTextChange(e, data.id, data);
              // }}
              onBlur={(e: any) => {
                if (data.id === "email") {
                  console.log("email aaya");
                  isValidEmail(data?.defaultValue, data.id);
                  return;
                } else if (
                  data.id === "password" &&
                  data.checkPasswordStrength
                ) {
                  console.log("password aya");

                  checkPassword(data?.defaultValue, data.id);
                  return;
                } else if (data.id === "confirm_password") {
                  matchpassword(data?.defaultValue, data.id);
                  return;
                }

                handleTextChange(e, data.id, data);
              }}
              defaultValue={data.defaultValue}
              isError={data.isError}
              dataTestId="inputTextField"
              isRequired={data.isReq}
              type={data.type}
              // minVal={data?.minVal}
              // maxVal={data?.maxVal}
              // showRangeError={data.showRangeError}
              isDisabled={data.isDisabled}
              className={undefined}
              isReadOnly={data.isReadOnly}
              loginField={loginField}
              imageIcon={data?.imageIcon}
              isValidField={data?.isValidField}
              errorMsg={data?.errorMsg}
              showErrorMsg={data?.showErrorMsg}

              // isIssue={true}
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
              dataTestId={`inputDateField-${data.id}`}
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
              dataTestId="searchField"
              setFormConfig={setFormConfig}
            />
          </ElementContainer>
        );
      case "file":
        return (
          <ElementContainer>
            <CustomFileInput
              handleFileUpload={(e: any) => handleFileUpload(e, data.id)}
              data
              dataTestId={`inputFileField-${data.id}`}
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
              dataTestId={"chip"}
              setFormConfig={setFormConfig}
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
    <div className="form-container-child">
      {config.map((eachConfig: any, index: any) => {
        return (
          <>
            <FormElementContainer
              loginField={loginField}
              key={eachConfig.id}
              className={` ${eachConfig?.isError ? "formErrorLabel" : ""}`}
            >
              {eachConfig?.formLabel ?? (
                <CustomLabel label={eachConfig.formLabel} />
              )}
              {renderHTML(eachConfig, false, index)}

              {eachConfig.id == "dates" &&
                (eachConfig.fields[0].isError ||
                  eachConfig.fields[1].isError ||
                  eachConfig.isError == true) && (
                  <div className="date-error">
                    Please enter the date in correct format
                  </div>
                )}
            </FormElementContainer>
          </>
        );
      })}
    </div>
  );
};

export default FormWrapper;
