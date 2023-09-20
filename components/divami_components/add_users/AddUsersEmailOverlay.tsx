import { createTheme, InputAdornment, ThemeProvider } from "@mui/material";

import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import removeIcon from "../../../public/divami_icons/RemoveIcon.svg";
import {
  addUserRoles,
  checkUserRegistered,
  getProjectUsers,
  getUserRoles,
} from "../../../services/project";

import { Paper } from "@material-ui/core";
import CustomButton from "../custom-button/CustomButton";
import CustomSearch from "../custom-search/CustomSearch";
import {
  BackButton,
  ButtonWrapper,
  FooterWrapper,
  HeaderActions,
  HeaderImage,
  ProjectAddUsersListContainer,
  ProjectUsersListContainer,
  StyledTable,
  TableHeader,
  TableWrapper,
  UnregistedUsersText,
  UnregisteredContainer,
  UnregisteredIcon,
  UserEmailText,
} from "../project-users-list/ProjectUsersListStyles";
import infoicon from "../../../public/divami_icons/infoIcon.svg";
import { toast } from "react-toastify";
import { AddUserEmailContainer, EnterIcon } from "../empty-users-list/EmptyUsersListStyles";
import {
  CloseIcon,
  HeaderContainer,
  TitleContainer,
} from "../issue-listing/IssueListStyles";
import closeWithCircle from "../../../public/divami_icons/closeWithCircle.svg";
import { render } from "@testing-library/react";
import CustomSelect from "../custom-select/CustomSelect";
import { CustomTextField } from "../custom-textfield/CustomTextField";
import ProjectInfo from "../../container/projectInfo";
import { MTableBodyRow } from "material-table";
import { role } from "../../../utils/constants";
import { CustomToast } from "../../divami_components/custom-toaster/CustomToast";
import BackArrow from "../../../public/divami_icons/backArrow.svg";
export const AddUsersEmailOverlay = ({
  form,
  setOpenDrawer,
  roles,
  selectedProjectId,
  appendToTable,
  tableData
}: any) => {
  const router = useRouter();
  const defaultMaterialTheme = createTheme();
  const [addedUsers, setAddedUsers] = useState<any>([]);
  const [searchVal, setSearchVal] = useState("");
  const [hoveringOver, setHoveringOver] = useState("");
  const [enableAddUser, setEnableAddUser] = useState(false);
  const [emailExistsError, setEmailExistsError] = useState("");
  const [isDisabled, setDisabled] = useState(false);
  const columns = [
    {
      title: "",
      field: "email",
      headerStyle: {
        borderBottom: "1px solid #FF843F",
        fontFamily: "Open Sans",
        fontStyle: "normal",
        fontWeight: "500",
        fontSize: "14px",
        lineHeight: "20px",
        color: "#101F4C",
      },
      sorting: false,
      cellStyle: { width: "70%" },
      render: (rowData: any) => {
        return (
          <UserEmailText>
            {rowData?.isNewUser ? `*${rowData.email}` : rowData.email}
          </UserEmailText>
        );
      },
    },
    {
      title: "",
      field: "role",
      sorting: false,
      headerStyle: {
        borderBottom: "1px solid #FF843F",
        fontFamily: "Open Sans",
        fontStyle: "normal",
        fontWeight: "500",
        fontSize: "14px",
        lineHeight: "20px",
        color: "#101F4C",
      },
      render: (rowData: any) => {
        return (
          <CustomSelect
            config={{
              options: roles?.length ? roles : [],
              defaultValue: rowData?.role
                ? rowData.role
                : roles.length
                ? roles.some((each: any) => each.value == "viewer")
                  ? "viewer"
                  : roles[0].value
                : "",
            }}
            hideBorder
            width={"unset"}
            id={rowData.id}
            setFormConfig={() => {}}
            sx={{ minWidth: 120 }}
            onChangeHandler={(e: any) => {
              setAddedUsers((prev: any) => {
                return prev.map((each: any) => {
                  if (each?.email == rowData?.email) {
                    return {
                      ...each,
                      role: e.target.value,
                    };
                  } else {
                    return {
                      ...each,
                    };
                  }
                });
              });
            }}
            isError={false}
            label=""
            dataTestId={`inputSelectField-${rowData.id}`}
          />
        );
      },
      cellStyle: { width: "20%" },
    },
    {
      title: "",
      field: "role",
      sorting: false,
      headerStyle: {
        borderBottom: "1px solid #FF843F",
        fontFamily: "Open Sans",
        fontStyle: "normal",
        fontWeight: "500",
        fontSize: "14px",
        lineHeight: "20px",
        color: "#101F4C",
      },
      render: (rowData: any) => {
        return hoveringOver == rowData.tableData.id ? (
          <Image
            src={removeIcon}
            alt={"remove"}
            onClick={() => {
              setAddedUsers(
                addedUsers.filter((each: any) => each.email !== rowData.email)
              );
            }}
          />
        ) : (
          <></>
        );
      },
      cellStyle: { width: "10%" },
    },
  ];

  const handleRowHover = (event: any, propsData: any) =>
    setHoveringOver(`${propsData.index}`);

  const handleRowHoverLeave = (event: any, propsData: any) =>
    setHoveringOver("");

  const onAddUser = () => {
    if (!enableAddUser) {
      setEnableAddUser(false);
      if (addedUsers?.length) {
        const projectInfo = {
          users: addedUsers.map((each: any) => {
            return { role: each.role, email: each.email };
          }),
        };

        const newUsers: number = addedUsers.filter(
          (each: any) => each.isNewUser
        )?.length;

        addUserRoles(projectInfo, selectedProjectId)
          .then((res: any) => {
            if (newUsers === 0) {
              CustomToast(
                `${
                  addedUsers?.length - newUsers > 1
                    ? `${addedUsers?.length - newUsers} Users`
                    : `${addedUsers?.length - newUsers} User`
                } added to the Project successfully`,"success"
              );
            } else if (addedUsers?.length - newUsers >= 1) {
              CustomToast(
                `${
                  addedUsers?.length - newUsers > 1
                    ? `${addedUsers?.length - newUsers} Users`
                    : `${addedUsers?.length - newUsers} User`
                } added to the Project successfully and ${
                  newUsers > 1 ? ` ${newUsers} Users have` : `${newUsers} User has`
                } been sent invite to Register `,"success"
              );
            } else {
              CustomToast(
                ` ${
                  newUsers > 1 ? ` ${newUsers} Users have` : `${newUsers} User has`
                } been sent invite to Register `,"success"
              );
            }
            setOpenDrawer(false);
            appendToTable(true);
            setEnableAddUser(true);
          })
          .catch((err) => {
            CustomToast("You don't have access. Contact Admin.","error");
    
          });
      }
    }
  };

  const onClickBack = () => {
    setOpenDrawer(false);
  };


  const addUsersByEmail = async (emails: string[]) => {
    const isViewer = roles.some((each: any) => each.value === "viewer");
    let usersToAdd: any[] = []; 
    const isRegisteredUsers = await Promise.all(emails.map((e)=> checkUserRegistered({email: e.trim()})))

    isRegisteredUsers.forEach((response) => {
      if(response.success) {
        if (!response.result?.isRegistered) {
          usersToAdd.push(
            {
              email: response.result?.email,
              role: isViewer ? "viewer" : roles[0].value,
              isNewUser: true,
            }
          );
        } else {
          usersToAdd.push(
            {
              email: response.result?.email,
              role: isViewer ? "viewer" : roles[0].value,
              isNewUser: false,
            }
          );
        }
      }
    });
  
    setAddedUsers([...usersToAdd, ...addedUsers]);

  }
  
  const handleValideEmail=() => {
    let alertString = "";
    let emails = searchVal.split(',');
    let inValidEmails = emails.filter((e) => {
      return !(/^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/.test(e.trim()))
    });
    
    let existingEmails = emails.filter((e) => {
      return (tableData.some((user: any) => user.email === e.trim()))
    })

    let validEmails = emails.filter((e) => {
      return !inValidEmails.includes(e) && !existingEmails.includes(e)
    })

    if (validEmails.length > 0) addUsersByEmail(validEmails);

    if(inValidEmails.length > 0) {
      setSearchVal(inValidEmails.join(','))
      alertString = `${inValidEmails.length} invalid email(s).`
    } else {
      setSearchVal("");
    }
    
    if(existingEmails.length > 0) {
      if(existingEmails.length == 1) {
        alertString = alertString.concat(` ${existingEmails[0]} already exists in this Project`)
      } else {
        alertString = alertString.concat(` ${existingEmails.length} users already exist in this Project`)
      }
    }

    setEmailExistsError(alertString);
  }
useEffect(()=>{
if(addedUsers.length>0){
  setDisabled(true)
}
},[addedUsers])
  return (
    <ProjectAddUsersListContainer>
      <HeaderContainer>
        <TitleContainer>
          <span>Add User(s) to the Project</span>
          <div className=" rounded-full p-[6px] hover:bg-[#E7E7E7]">
          <CloseIcon
            onClick={() => {
              onClickBack();
            }}
            src={closeWithCircle}
            alt={"close icon"}
            data-testid="close-icon"
          />
          </div>
        </TitleContainer>
      </HeaderContainer>
      <TableHeader>
        <HeaderActions>
          {/* <SearchAreaContainer marginRight> */}

          <AddUserEmailContainer overlay>
            <CustomTextField
              id={"search"}
              variant="outlined"
              placeholder={"Search User By Email ID"}
              onChange={(e: any) => {
                setSearchVal(e.target?.value);
                setEmailExistsError("")
              }}
              onBlur={(e: any) => {
                setSearchVal(e.target?.value);
              }}
              defaultValue={searchVal}
              type={"email"}
              callback={handleValideEmail}
              className={undefined}
              width={"100% !important"}
              InputProps={{
                endAdornment: (
                  <InputAdornment
                    position="end"
                    onClick={handleValideEmail
                    }
                  >
                    <EnterIcon width={18} height={18} src={BackArrow} alt="" />
                  </InputAdornment>
                ),
              }}
            />
          {emailExistsError && 
  <div style={{ color: "rgba(236, 52, 52, 1)",marginLeft: "4px",
  fontFamily: "Open Sans",
  fontWeight: 400,
  fontSize: "14px",marginTop:"4px" }}>
    {emailExistsError}
  </div>
    }

          </AddUserEmailContainer>
          {/* </SearchAreaContainer> */}
        </HeaderActions>
      </TableHeader>
        <ThemeProvider theme={defaultMaterialTheme}>
          <TableWrapper hideHeader id="addUserList">
            <StyledTable
              components={{
                Container: (props: any) => <Paper {...props} elevation={0} />,
                Row: (props: any) => {
                  return (
                    <MTableBodyRow
                      {...props}
                      onMouseEnter={(e: any) => handleRowHover(e, props)}
                      onMouseLeave={(e: any) => handleRowHoverLeave(e, props)}
                    />
                  );
                },
              }}
              columns={columns}
              data={addedUsers ? addedUsers : []}
              title={""}
              options={{
                search: false,
                paging: false,
                exportButton: false,
                exportFileName: "tableData",
                selection: false,
                showTitle: true,
                toolbar: false,
                // maxBodyHeight: 700,
                thirdSortClick: false,
                rowStyle: (rowData: any) => ({
                  fontFamily: "Open Sans",
                  fontStyle: "normal",
                  fontWeight: "400",
                  fontSize: "14px",
                  color: "#101F4C",
                  backgroundColor:
                    rowData.tableData.id == hoveringOver ? "#FFF2EB" : "",
                }),
                headerStyle: {
                  padding: "6px 16px",
                  fontFamily: "Open Sans",
                },
              }}
            />
          </TableWrapper>
        </ThemeProvider>
     
      <FooterWrapper>
        <UnregisteredContainer>
          <UnregisteredIcon src={infoicon} alt=""></UnregisteredIcon>
          <UnregistedUsersText>
            *Unregistered users will receive an invitation to register.
          </UnregistedUsersText>
        </UnregisteredContainer>
        <ButtonWrapper>
          <BackButton>
            <CustomButton
              type={"outlined"}
              label={"Back"}
              formHandler={onClickBack}
            />
          </BackButton>

          <CustomButton
            type={addedUsers.length >= 1 && isDisabled ? "contained":"disabled"}
            label={"Add User"}
            formHandler={onAddUser}
          />
        </ButtonWrapper>
      </FooterWrapper>
    </ProjectAddUsersListContainer>
  );
};
