import { createTheme, ThemeProvider } from "@mui/material";

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
import infoicon from "../../../public/divami_icons/infoicon.svg";
import { toast } from "react-toastify";
import { AddUserEmailContainer } from "../empty-users-list/EmptyUsersListStyles";
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

export const AddUsersEmailOverlay = ({
  form,
  setOpenDrawer,
  roles,
  selectedProjectId,
}: any) => {
  console.log("rolespeg", roles);
  const router = useRouter();
  const defaultMaterialTheme = createTheme();
  const [addedUsers, setAddedUsers] = useState<any>([]);
  const [searchVal, setSearchVal] = useState("");
  const [hoveringOver, setHoveringOver] = useState("");
  useEffect(() => {
    console.log("roles", roles);
    if (/\S+@\S+\.\S+/.test(form.email)) checkRegisterUser(form.email);

    // setAddedUsers([...addedUsers, form]);
  }, form);
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
        console.log("rowdating", rowData);
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
    const projectInfo = {
      users: addedUsers.map((each: any) => {
        return { role: each.role, email: each.email };
      }),
    };
    addUserRoles(projectInfo, selectedProjectId)
      .then((res: any) => {
        toast.success("User Added successfully");
        setOpenDrawer(false);
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  const onClickBack = () => {
    setOpenDrawer(false);
  };

  const checkRegisterUser = (val: string) => {
    const isViewer = roles.some((each: any) => each.value === "viewer");
    checkUserRegistered({ email: val })
      .then((res: any) => {
        if (!res.result?.isRegistered) {
          setAddedUsers([
            {
              email: val,
              role: isViewer ? "viewer" : roles[0].value,
              isNewUser: true,
            },
            ...addedUsers,
          ]);
        } else {
          setAddedUsers([
            {
              email: val,
              role: isViewer ? "viewer" : roles[0].value,
              isNewUser: false,
            },
            ...addedUsers,
          ]);
        }
        setSearchVal("");
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  return (
    <ProjectAddUsersListContainer>
      <HeaderContainer>
        <TitleContainer>
          <span>Add Users To The Platform</span>

          <CloseIcon
            onClick={() => {
              onClickBack();
            }}
            src={closeWithCircle}
            alt={"close icon"}
            data-testid="close-icon"
          />
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
              }}
              onBlur={(e: any) => {
                setSearchVal(e.target?.value);
              }}
              defaultValue={searchVal}
              type={"email"}
              callback={() => {
                if (
                  /\S+@\S+\.\S+/.test(searchVal) &&
                  !addedUsers.some((iter: any) => iter.email == searchVal)
                ) {
                  checkRegisterUser(searchVal);
                }
              }}
              className={undefined}
              width={"100% !important"}
            />
            {/* <CustomSearch
              data={options}
              handleSearchResult={(e: any, value: any, id: any) => {
                if (value?.id) {
                  const selectedObj = responseData.find(
                    (each: any) =>
                      each._id === value?.id &&
                      !addedUsers.some((iter: any) => iter._id == value?.id)
                  );

                  if (selectedObj) {
                    setAddedUsers([{ ...selectedObj }, ...addedUsers]);
                  }
                }
              }}
              placeholder="Search User By Email ID"
              handleEnterResult={(val: any) => {
                if (/\S+@\S+\.\S+/.test(val)) {
                  const selectedObj = responseData.find(
                    (each: any) =>
                      each.email === val &&
                      !addedUsers.some((iter: any) => iter.email == val)
                  );
                  if (selectedObj) {
                    setAddedUsers([{ ...selectedObj }, ...addedUsers]);
                  } else if (
                    !addedUsers.some((iter: any) => iter.email == val)
                  ) {
                    setAddedUsers([
                      {
                        email: `${val}`,
                        role: roles[0].value,
                        isNewUser: true,
                      },
                      ...addedUsers,
                    ]);
                  }
                }
              }}
            /> */}
          </AddUserEmailContainer>

          {/* </SearchAreaContainer> */}
        </HeaderActions>
      </TableHeader>

      <ThemeProvider theme={defaultMaterialTheme}>
        <TableWrapper hideHeader>
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
              maxBodyHeight: 700,
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
            type={"contained"}
            label={"Add User"}
            formHandler={onAddUser}
          />
        </ButtonWrapper>
      </FooterWrapper>
    </ProjectAddUsersListContainer>
  );
};
