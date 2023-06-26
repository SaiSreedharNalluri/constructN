import CustomCalender from "../custom-datepicker/CustomCalender";
import CustomFileInput from "../custom-file-input/CustomFileInput";
import CustomLabel from "../custom-label/CustomLabel";
import CustomSearch from "../custom-search/CustomSearch";
import CustomSelect, { ErrorField } from "../custom-select/CustomSelect";
import CustomTagSuggestion from "../custom-tag-suggestion/CustomTagSuggestion";
import { CustomTextField } from "../custom-textfield/CustomTextField";
import { CustomTextArea } from "../custom-textarea/CustomTextArea";

import { styled } from "@mui/system";
import { Box, Menu, MenuItem } from "@mui/material";
import React, { useEffect, useState } from "react";
import { FormText } from "../sign-in/SignInPageStyle";
import { Checkbox, InputAdornment, TextField } from "@mui/material";
import Checked from "../../../public/divami_icons/checked.svg";
import UnChecked from "../../../public/divami_icons/unchecked.svg";
import Mail from "../../../public/divami_icons/Mail.svg";
import lock from "../../../public/divami_icons/lock.svg";
import Image from "next/image";
import PasswordRequired from "../password-field/PasswordRequired";

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
  alignItems: "end",
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
    signUpMsg,
    signInMsg,
    errorStylingSignup,
    onData,
    handleKeyPress,
  } = props;

  const [userPassword, setUserPassword] = useState("");
  useEffect(() => {}, [userPassword]);

  useEffect(() => {
    checkDataisEmpty();
  }, [config]);

  // Menu Code
  const [passwordChar, setPasswordChar] = useState("");
  const [isWeakPassword, setIsWeakPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");

  const [showMessage, setShowMessage] = useState(false);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Menu Code

  useEffect(() => {
    if (validate) {
      setFormConfig((prev: any) => {
        const newconfig = prev.map((item: any) => {
          if (item.isReq && !item.defaultValue && signUpMsg === true) {
            if (setCanBeDisabled) setCanBeDisabled(false);
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
          } else if (item.isValidField === false && item.id === "firstName") {
            if (!namesCharLimit(item.defaultValue, item.id)) {
              if (setCanBeDisabled) setCanBeDisabled(false);
              return {
                ...item,
                isError: true,
                // errorMsg: "First Name should be less than 30 characters",
                showErrorMsg: true,
              };
            }
          } else if (item.isValidField === false && item.id === "lastName") {
            if (!namesCharLimit(item.defaultValue, item.id)) {
              if (setCanBeDisabled) setCanBeDisabled(false);
              return {
                ...item,
                isError: true,
                // errorMsg: "First Name should be less than 30 characters",
                showErrorMsg: true,
              };
            }
          }else if (item.isValidField == false && item.id === "title" && item.maxLength){
         
            if(!textMaxLength(item.defaultValue, item.id)){
              if(setCanBeDisabled) setCanBeDisabled(false);
              return{
                ...item,
                isError: true,
                showErrorMsg: true,
              }
            }else{
              return {
                ...item, isError: false
              }
            }
          }

          // else if (item.isValidField === false && item.id === "title") {
          //   if (!namesCharLimit(item.defaultValue, item.id)) {
          //     if (setCanBeDisabled) setCanBeDisabled(false);
          //     return {
          //       ...item,
          //       isError: true,
          //       // errorMsg: "First Name should be less than 30 characters",
          //       showErrorMsg: true,
          //     };
          //   }
          // }
          else if (item.isValidField === false && item.id === "email") {
            if (!isValidEmail(item.defaultValue, item.id)) {
              if (setCanBeDisabled) setCanBeDisabled(false);
              return {
                ...item,
               isError: true,
               errorMsg: "Invalid User Email",
               showErrorMsg: true,
              };
            }
            else {
              return { ...item, isError: false };
            }
          }
          
          else if (item.isValidField === false && item.id === "password") {
            if (!checkPassword(item.defaultValue, item.id)) {
              if (setCanBeDisabled) setCanBeDisabled(false);
              return {
                ...item,
                isError: true,
                // errorMsg: <PasswordRequired showPasswordMenu={true} />,
                errorMsg: "Password is weak",
                showErrorMsg: true,
              };
            }
          } else if (
            item.isValidField === false &&
            item.id === "confirm_password"
          ) {
            if (setCanBeDisabled) setCanBeDisabled(false);
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

  const handleTextChange = (
    e: any,
    id: string,
    type?: string,
    parentId?: string,
 //   maxLength?: number
  ) => { 
    if (type === "doubleField") {
      setFormConfig((prev: any) => {
        return prev.map((each: any) => {
          if (each.id === parentId) {
            return {
              ...each,
              fields: each.fields.map((item: any) => {
                if (item.id == id) {
                  return {
                    ...item,
                    defaultValue: e.target.value,
                  };
                } else {
                  return item;
                }
              }),
            };
          } else {
            return each;
          }
        });
      });
    } else {
      setFormConfig((prev: any) =>
        prev.map((item: any) => {
          if (id === item.id) {
            return {
              ...item,
              // defaultValue: !maxLength
              //   ? e.target.value
              //   : e.target.value.slice(0, maxLength),
              defaultValue: e.target.value,
            };
          }
          return item;
        })
      );
    }
  };

  // callback function passed from the parent
  const sendDataToParent = (e: any) => {
    if (onData) {
      //   onData(inputValue);
      onData(e.target.value);
    }
  };

  const handleDateChange = (
    e: any,
    id: string,
    type?: string,
    parentId?: string
  ) => {
    let fieldHasValue = e !== null ? e["$D"] + e["$M"] + e["$y"] : null;
    if (type === "doubleField") {
      setFormConfig((prev: any) => {
        return prev.map((each: any) => {
          if (each.id === parentId) {
            return {
              ...each,
              fields: each.fields.map((item: any) => {
                if (item.id == id) {
                  return {
                    ...item,
                    defaultValue: JSON.parse(JSON.stringify(e)),
                  };
                } else {
                  return item;
                }
              }),
            };
          } else {
            return each;
          }
        });
      });
    } else {
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
    }
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
  function checkDataisEmpty() {
    // const isEmptyField = config.some(
    //   (val: any) => !val.defaultValue && val.isReq
    // );
    //  if (setCanBeDisabled) setCanBeDisabled(isEmptyField);

    const regex = /^[^\s][^\s]*$/;
    const maxLimit = 20; // Maximum character limit for firstName and lastName fields

    const isEmptyField = config.some((val: any) => {
      if (val.isReq) {
        if (val.id === "firstName" || val.id === "lastName") {
          // Check if it is firstName or lastName field
          const defaultValue = val.defaultValue.trim();

          return !(defaultValue && regex.test(defaultValue));
        } else {
          // For other fields, check if defaultValue is empty
          return !val.defaultValue;
        }
      }
      return false;
    });

    if (setCanBeDisabled) {
      setCanBeDisabled(isEmptyField);
    }
  }

  function namesCharLimit(titleName: any, id: any) {
    // return;
    let isValid = false;

    const maxLimits: { [key: string]: number } = {
      firstName: 30,
      lastName: 30,
      // title: 30,
      // description: 100,
    };

    const maxLimit = maxLimits[id];

    const regex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?0-9]/;

    if (titleName.length > maxLimit) {
      setFormConfig((prev: any) =>
        prev.map((item: any) => {
          if (id === item.id) {
            let fieldName;
            if (id === "firstName") {
              fieldName = "First name";
            } else if (id === "lastName") {
              fieldName = "Last name";
            } else if (id === "title") {
              fieldName = "Title";
            } else {
              fieldName = id;
            }
            return {
              ...item,
              isValidField: false,
              isError: true,
              // errorMsg: "Name should be less than 30 characters",
              errorMsg: `${fieldName} should be less than ${maxLimit} characters`,
            };
          }
          return item;
        })
      );
    } else if (regex.test(titleName)) {
      setFormConfig((prev: any) =>
        prev.map((item: any) => {
          if (id === item.id) {
            return {
              ...item,
              isValidField: false,
              isError: true,
              errorMsg: "Special Characters and Numbers are not allowed",
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
              isError: false,
            };
          }
          return item;
        })
      );
    }
    return isValid;
  }


  function textMaxLength(textLength:string, id:string){
    let isValid = false    
    const maxLimit = 30;
    const regex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?0-9]/;
    console.log("STEP 1", textLength, id)
    if(textLength.length > maxLimit){

      console.log("STEP 3", textLength, id)
      setFormConfig((prev: any) =>
      prev.map((item: any) => {
        if (id === item.id) {
          let fieldName;
          console.log("STEP 3a", textLength, id)
          if (id === "firstName") {
            fieldName = "First name";
          } else if (id === "lastName") {
            fieldName = "Last name";
          } else if (id === "title") {
            fieldName = "Title" || "title";
          } else {
            fieldName = id;
          }
          return {
            ...item,
            isValidField: false,
            isError: true,
            // errorMsg: "Name should be less than 30 characters",
            errorMsg: `${fieldName} should not be greater than ${maxLimit} characters`,
          };
        }
        return item;
      })
    );
    } else if (regex.test(textLength)) {
      console.log("STEP 4", textLength, id)
      setFormConfig((prev: any) =>
        prev.map((item: any) => {
          if (id === item.id) {
            return {
              ...item,
              isValidField: false,
              isError: true,
              errorMsg: "Special Characters and Numbers are not allowed",
            };
          }
          return item;  
        })
      );
    } else {
      console.log("STEP 5", textLength, id)
      setFormConfig((prev: any) =>
        prev.map((item: any) => {
          if (id === item.id) {
            return {
              ...item,
              isValidField: true,
              isError: false,
            };
          }
          return item;
        })
      );
    }
    return isValid
  }

  function isValidEmail(email: any, id: any) {
    let isValid = false;
    if (/\S+@\S+\.\S+/.test(email)) {
      isValid = true;
      setFormConfig((prev: any) =>
        prev.map((item: any) => {
          if (id === item.id) {
            return {
              ...item,
              isValidField: true,
              isError: false,
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
              isError: true,
            };
          }
          return item;
        })
      );
    }
    return isValid;
    // return /\S+@\S+\.\S+/.test(email);
  }

  function checkPassword(str: any, id: any) {
    let rePass = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,14}$/;
    let passwordTru = rePass.test(str);
    let isValid = false;
    setShowMessage(!passwordTru);

    if (passwordTru) {
      isValid = true;
      setFormConfig((prev: any) =>
        prev.map((item: any) => {
          if (id === item.id) {
            return {
              ...item,
              isValidField: true,
              isError: false,
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
              isError: true,
            };
          }
          return item;
        })
      );
    }
    return isValid;
  }

  function matchpassword(str: any, id: any) {
    if (str !== userPassword) {
      setFormConfig((prev: any) =>
        prev.map((item: any) => {
          if (id === item.id) {
            return {
              ...item,
              isValidField: false,
              isError: true,
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
              isError: false,
            };
          }
          return item;
        })
      );
    }
  }

  // const handlePasswordField = () => {
  //   return <div>Hello</div>;
  // };
  const renderHTML = (
    data: any,
    isDisabled: boolean,
    index: number,
    configObject: any = config,
    parentType?: string,
    parentId?: string
  ) => {
    switch (data?.type) {
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
              isReadOnly={data.isReadOnly}
              dataTestId={`inputSelectField-${data.id}`}
              width={data.width || ""}
              parentId={parentId}
              parentType={parentType}
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
                handleTextChange(e, data.id, parentType, parentId);
              }}
              onBlur={(e: any) => {
                handleTextChange(e, data.id, parentType, parentId);
              }}
              defaultValue={data.defaultValue}
              isError={data.isError}
              isRequired={data.isReq}
              type={data.type}
              minVal={data?.minVal}
              maxVal={data?.maxLength}
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
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              id={data.id}
              variant="outlined"
              placeholder={data?.placeholder}
              callback={
                data.callback
                  ? data.callback
                  : props.handleKeyPress
                  ? props.handleKeyPress
                  : () => {}
              }
              onChange={(e: any) => {
                handleTextChange(
                  e,
                  data.id,
                  parentType,
                  parentId,
                  // parseInt(data.maxLength)
                );

                if (data.id === "password") {
                  sendDataToParent(e);
                }
              }}
              onBlur={(e: any) => {
                if (data.id === "firstName") {
                  namesCharLimit(data?.defaultValue, data.id);
                  return;
                } else if (data.id === "lastName") {
                  namesCharLimit(data?.defaultValue, data.id);
                  return;
                }
                // else if (data.id === "title") {
                //   namesCharLimit(data?.defaultValue, data.id);
                //   return;
                // }
                else if (data.id === "email") {
                  isValidEmail(data?.defaultValue, data.id);
                  return;
                } else if (
                  data.id === "password" &&
                  data.checkPasswordStrength
                ) {
                  checkPassword(data?.defaultValue, data.id);
                } else if (data.id === "confirm_password") {
                  matchpassword(data?.defaultValue, data.id);
                  return;
                } else if (data.maxLength === 30){
                //  alert("TEST2")
                  textMaxLength(data?.defaultValue, data.id)
                  return
                }
                handleTextChange(e, data.id, parentType, parentId);
              }}
              defaultValue={data.defaultValue}
              isError={data.isError}
              dataTestId="inputTextField"
              isRequired={data.isReq}
              type={data.type}
              isDisabled={data.isDisabled}
              className={undefined}
              isReadOnly={data.isReadOnly}
              loginField={loginField}
              imageIcon={data?.imageIcon}
              isValidField={data?.isValidField}
              errorMsg={data?.errorMsg}
              showErrorMsg={data?.showErrorMsg}
              width={data.width || ""}
              config={data}
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
                handleDateChange(e, data.id, parentType, parentId);
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
            {/* {data?.label ?? <CustomLabel label={data.label} />} */}
            {data.fields?.map((eachConfig: any, index: number) => {
              return (
                <Box key={eachConfig?.id}>
                  {eachConfig?.formLabel ?? (
                    <CustomLabel label={eachConfig?.formLabel} />
                  )}
                  {renderHTML(
                    eachConfig,
                    false,
                    index,
                    data.fields,
                    data.type,
                    data.id
                  )}
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
                <CustomLabel label={eachConfig?.formLabel} />
              )}
              {renderHTML(eachConfig, false, index)}

              {eachConfig?.id == "dates" &&
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
