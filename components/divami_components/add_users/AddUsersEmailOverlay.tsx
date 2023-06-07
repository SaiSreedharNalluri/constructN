import { createTheme, ThemeProvider } from "@mui/material";

import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import removeIcon from "../../../public/divami_icons/RemoveIcon.svg";
import {
  addUserRoles,
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

export const AddUsersEmailOverlay = ({
  form,
  setOpenDrawer,
  responseData,
  options,
  roles,
}: any) => {
  const router = useRouter();
  const defaultMaterialTheme = createTheme();
  const [addedUsers, setAddedUsers] = useState<any>([]);

  useEffect(() => {
    setAddedUsers([...addedUsers, form]);
  }, form);

  const columns = [
    {
      title: "",
      field: "email",
      //   headerStyle: {
      //     borderBottom: "1px solid #FF843F",
      //     fontFamily: "Open Sans",
      //     fontStyle: "normal",
      //     fontWeight: "500",
      //     fontSize: "14px",
      //     lineHeight: "20px",
      //     color: "#101F4C",
      //   },
      sorting: false,
      cellStyle: { width: "60%" },
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
      //   headerStyle: {
      //     borderBottom: "1px solid #FF843F",
      //     fontFamily: "Open Sans",
      //     fontStyle: "normal",
      //     fontWeight: "500",
      //     fontSize: "14px",
      //     lineHeight: "20px",
      //     color: "#101F4C",
      //   },
      render: (rowData: any) => {
        return (
          <CustomSelect
            config={{
              options: roles?.length ? roles : [],
              defaultValue: rowData?.role
                ? rowData.role
                : roles.length
                ? roles[0].value
                : "",
            }}
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
      cellStyle: { width: "30%" },
    },
    {
      title: "",
      field: "role",
      sorting: false,
      //   headerStyle: {
      //     borderBottom: "1px solid #FF843F",
      //     fontFamily: "Open Sans",
      //     fontStyle: "normal",
      //     fontWeight: "500",
      //     fontSize: "14px",
      //     lineHeight: "20px",
      //     color: "#101F4C",
      //   },
      render: (rowData: any) => {
        return (
          <Image
            src={removeIcon}
            alt={"remove"}
            onClick={() => {
              setAddedUsers(
                addedUsers.filter((each: any) => each._id !== rowData._id)
              );
            }}
          />
        );
      },
      cellStyle: { width: "10%" },
    },
  ];

  useEffect(() => {
    if (router.isReady && router.query.projectId) {
      //   getProjectUsers(router.query.projectId as string).then(
      //     (response: any) => {
      //       if (response.success === true) {
      //         let rolesArr: string[] = [];
      //         setResponseData(
      //           response.result.map((each: any) => {
      //             return {
      //               ...each,
      //               ...each.user,
      //             };
      //           })
      //         );
      //         const userData = response.result.map((each: any) => {
      //           return {
      //             ...each,
      //             label: each.user.email,
      //             id: each.user._id,
      //           };
      //         });
      //         setOptions({
      //           listOfEntries: userData,
      //         });
      //       }
      //     }
      //   );
      //   getUserRoles().then((res: any) => {
      //     const rolesData = res.result.map((each: any) => {
      //       return {
      //         label: each,
      //         value: each,
      //       };
      //     });
      //     setRoles(rolesData);
      //   });
    }
  }, [router.isReady, router.query.projectId]);

  const onAddUser = () => {
    const projectInfo = {
      users: addedUsers.map((each: any) => {
        return { role: each.role, email: each.email };
      }),
    };
    addUserRoles(projectInfo, router?.query?.projectId)
      .then((res: any) => {
        toast.success("User Added successfully");
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  const onClickBack = () => {
    setOpenDrawer(false);
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
            <CustomSearch
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
            />
          </AddUserEmailContainer>

          {/* </SearchAreaContainer> */}
        </HeaderActions>
      </TableHeader>

      <ThemeProvider theme={defaultMaterialTheme}>
        <TableWrapper hideHeader>
          <StyledTable
            components={{
              Container: (props) => <Paper {...props} elevation={0} />,
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
              rowStyle: {
                fontFamily: "Open Sans",
                fontStyle: "normal",
                fontWeight: "400",
                fontSize: "14px",
                color: "#101F4C",
              },
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
