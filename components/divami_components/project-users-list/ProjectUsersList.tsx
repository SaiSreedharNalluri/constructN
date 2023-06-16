import {
  createTheme,
  Drawer,
  InputAdornment,
  ThemeProvider,
} from "@mui/material";

import moment from "moment";
import { useRouter } from "next/router";
import { forwardRef, useEffect, useState } from "react";
import {
  addUserRoles,
  getProjectUsers,
  getUserRoles,
  removeProjectUser,
} from "../../../services/project";
import RemoveIcon from "../../../public/divami_icons/RemoveIcon.svg";
import ChatIcon from "../../../public/divami_icons/ChatIcon.svg";
import Image from "next/image";
import {
  CustomColumnTitle,
  FilterIndicator,
  Header,
  HeaderActions,
  HeaderImage,
  ImageButtons,
  ProjectUsersListContainer,
  RemoveIconImage,
  SortIconStyled,
  StyledTable,
  TableHeader,
  TableWrapper,
  UserDefaultIcon,
  UserImage,
  UserName,
  UserNameText,
} from "./ProjectUsersListStyles";
import searchIcon from "../../../public/divami_icons/search.svg";
import UserFilterIcon from "../../../public/divami_icons/UserFilterIcon.svg";
import { Paper } from "@material-ui/core";
import CustomButton from "../custom-button/CustomButton";
import { toast } from "react-toastify";
import { MTableBodyRow, MTableEditRow } from "material-table";
import {
  CloseIcon,
  CustomSearchField,
  SearchAreaContainer,
} from "../../divami_components/project-listing/SectionsStyles";
import SearchBoxIcon from "../../../public/divami_icons/search.svg";
import CrossIcon from "../../../public/divami_icons/crossIcon.svg";
import UsersFilter from "../usersList/UsersFilter";
import CustomDrawer from "../custom-drawer/custom-drawer";
import { SortDescIcon } from "../project-listing/SortDescIcon";
import PopupComponent from "../../popupComponent/PopupComponent";
import { AddUsersEmailOverlay } from "../add_users/AddUsersEmailOverlay";
import { AddUsersEmailPopup } from "../add_users/AddUsersEmailPopup";
import Edit from "../../../public/divami_icons/edit.svg";
import { EditRoleOverlay } from "./EditRoleOverlay";

export const ProjectUsersList = ({ setShowEmptyState }: any) => {
  const [tableData, setTableData] = useState<any>([]);
  const router = useRouter();
  const defaultMaterialTheme = createTheme();
  const [roles, setRoles] = useState<string[] | []>([]);
  const [sortObj, setSortObj] = useState(true);
  const [showAddUser, setShowAddUser] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [form, setForm] = useState({});
  const [searchTableData, setSearchTableData] = useState([]);
  const [rolesArr, setRolesArr] = useState<string[] | []>([]);
  const [isFilterApplied, setIsFilterApplied] = useState<boolean>(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState({});
  const [taskFilterState, setTaskFilterState] = useState({
    isFilterApplied: false,
    filterData: {},
    numberOfFilters: 0,
  });
  const columns = [
    {
      title: "User Name",
      field: "fullName",
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
      render: (rowData: any) => {
        return (
          <UserName>
            {rowData.avatar ? (
              <UserImage src={rowData.avatar} alt={""} width={24} height={24} />
            ) : (
              <UserDefaultIcon>
                {rowData.firstName.charAt(0)?.toUpperCase()}
                {rowData.lastName.charAt(0)?.toUpperCase()}
              </UserDefaultIcon>
            )}
            <UserNameText>{rowData.fullName}</UserNameText>
          </UserName>
        );
      },
      cellStyle: { width: "20%" },
    },
    {
      title: "User Email",
      field: "email",
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
      cellStyle: { width: "25%" },
    },
    {
      title: "Role",
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
      cellStyle: { width: "15%" },
    },
    {
      title: <CustomColumnTitle>Assigned On</CustomColumnTitle>,
      field: "updatedAt",
      headerStyle: {
        borderBottom: "1px solid #FF843F",
        fontFamily: "Open Sans",
        fontStyle: "normal",
        fontWeight: "500",
        fontSize: "14px",
        lineHeight: "8px",
        color: "#101F4C",
      },
      cellStyle: { width: "30%" },
      customSort: (a: any, b: any) => sortBy(a, b, "updatedAt"),

      render: (rowData: any) => {
        return <>{moment(rowData.updatedAt).format("DD MMM YYYY")}</>;
      },
    },
    {
      title: "",
      field: "",
      headerStyle: {
        borderBottom: "1px solid #FF843F",
        fontFamily: "Open Sans",
        fontStyle: "normal",
        fontWeight: "500",
        fontSize: "14px",
        lineHeight: "8px",
        color: "#101F4C",
      },
      cellStyle: { width: "10%" },
      sorting: false,
      render: (rowData: any) => {
        return (
          <ImageButtons hoveringOver={hoveringOver} id={"rowActions"}>
            <RemoveIconImage src={ChatIcon} alt="" />
            <RemoveIconImage
              src={RemoveIcon}
              alt=""
              onClick={() => {
                deleteUser(rowData);
              }}
            />

            <Image
              src={Edit}
              alt=""
              onClick={() => {
                setShowEdit(true);
                setSelectedRowData(rowData);
              }}
            />
          </ImageButtons>
        );
      },
    },
  ];

  const sortBy = (a: any, b: any, field: string) => {
    if (sortObj) {
      setSearchTableData(
        [].concat(tableData).sort((a, b) => a[field] - b[field])
      );
    } else {
      setSearchTableData(
        [].concat(tableData).sort((a, b) => b[field] - a[field])
      );
    }
    setSortObj(!sortObj);
    // return a.numberOfUsers - b.numberOfUsers;
  };

  const changeUserRole = () => {
    const projectInfo = {
      users: tableData
        .filter((each: any) => each.isRoleUpdated)
        .map((each: any) => {
          return { role: each.role, email: each.email };
        }),
    };
    addUserRoles(projectInfo, router.query.projectId as string)
      .then((res: any) => {
        toast.success("User Added successfully");
        setOpenDrawer(false);
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };
  const deleteUser = (rowData: any) => {
    const email = rowData.email.toLocaleLowerCase();
    removeProjectUser(email, router.query.projectId as string)
      .then((response) => {
        if (response?.success === true) {
          toast.success(response?.message);
          setTableData(
            response.result.map((each: any) => {
              return {
                ...each,
                ...each.user,
                updatedAt: new Date(each.user?.updatedAt),
              };
            })
          );
        }
      })
      .catch((error) => {
        if (error.success === false) {
          toast.error(error?.message);
        }
      });
  };

  useEffect(() => {
    if (router.isReady && router.query.projectId) {
      getProjectUsers(router.query.projectId as string).then(
        (response: any) => {
          if (response.success === true) {
            let rolesArr: string[] = [];
            setTableData(
              response.result.map((each: any) => {
                return {
                  ...each,
                  ...each.user,
                  updatedAt: new Date(each.user?.updatedAt),
                };
              })
            );
            response?.result.forEach((item: any) => {
              if (!rolesArr.includes(item.role)) rolesArr.push(item?.role);
            });
            setRoles(rolesArr);
          }
        }
      );
      getUserRoles().then((res: any) => {
        const rolesData = res.result.map((each: any) => {
          return {
            label: each,
            value: each,
          };
        });
        setRolesArr(rolesData);
      });
    }
  }, [router.isReady, router.query.projectId]);
  const [hoveringOver, setHoveringOver] = useState("");
  // This is the only downside.. very hacky
  const [, setForceUpdate] = useState(0);
  const forceUpdate = () => setForceUpdate((old) => old + 1);

  const formHandler = (event: any) => {
    setShowAddUser(true);
  };
  const handleEditClick = (event: any, rowData: any) => {
    rowData.tableData.editing = "delete";
    forceUpdate();
  };

  const [isSearching, setIsSearching] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchWindow = () => {
    setSearchTableData(tableData);
    if (searchTerm === "") {
      setIsSearching(!isSearching);
    } else {
      setSearchTerm("");
    }
  };

  useEffect(() => {
    setSearchTableData(tableData);
  }, [tableData]);

  const showEmailOverlay = (formState: any) => {
    setShowAddUser(false);
    setOpenDrawer(true);
    setForm(formState);
  };

  return (
    <ProjectUsersListContainer>
      <TableHeader>
        <Header>Manage Users</Header>
        <HeaderActions>
          {isSearching ? (
            <SearchAreaContainer marginRight>
              <CustomSearchField
                placeholder="Search"
                variant="outlined"
                value={searchTerm}
                onChange={(e: any) => {
                  setSearchTerm(e.target.value);
                  setTaskFilterState({
                    isFilterApplied: false,
                    filterData: {},
                    numberOfFilters: 0,
                  });
                  setSearchTableData(
                    tableData.filter(
                      (each: any) =>
                        each.fullName
                          ?.toLowerCase()
                          .includes(e.target?.value?.toLowerCase()) ||
                        each.email
                          ?.toLowerCase()
                          .includes(e.target?.value?.toLowerCase())
                    )
                  );
                }}
                InputLabelProps={{ shrink: false }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Image src={SearchBoxIcon} alt="" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="start">
                      <CloseIcon
                        onClick={() => {
                          handleSearchWindow();
                        }}
                        src={CrossIcon}
                        alt={"close icon"}
                        data-testid="search-close"
                      />
                    </InputAdornment>
                  ),
                }}
              />
            </SearchAreaContainer>
          ) : (
            <HeaderImage
              src={searchIcon}
              alt=""
              width={24}
              height={24}
              onClick={() => {
                setIsSearching(true);
              }}
            />
          )}
          <HeaderImage
            src={UserFilterIcon}
            alt=""
            width={24}
            height={24}
            onClick={() => {
              setOpenFilter(true);
            }}
          />
          {taskFilterState.numberOfFilters ? <FilterIndicator /> : <></>}

          <CustomButton
            type={"contained"}
            label={"Add User"}
            formHandler={formHandler}
          />
        </HeaderActions>
      </TableHeader>

      <ThemeProvider theme={defaultMaterialTheme}>
        <TableWrapper>
          <StyledTable
            // components={{
            //   Toolbar: (props) => (
            //     <MTableToolbar {...props} style={{ width: "100%" }} sx={{}} />
            //   ),
            // }}
            // icons={{
            //   SortArrow: forwardRef((props, ref) => (
            //     <ArrowDropUpIcon {...props} ref={ref} />
            //   )),
            // }}
            components={{
              Container: (props: any) => <Paper {...props} elevation={0} />,
            }}
            columns={columns}
            data={searchTableData ? searchTableData : []}
            title={""}
            icons={{
              SortArrow: forwardRef((props, ref) => {
                return sortObj ? (
                  <SortIconStyled {...props} ref={ref} />
                ) : (
                  <SortDescIcon
                    {...props}
                    ref={ref}
                    // onClick={() => {
                    //   setSortObj(!sortObj);
                    // }}
                  />
                );
              }),
            }}
            options={{
              search: false,
              paging: false,
              exportButton: false,
              exportFileName: "tableData",
              selection: false,
              showTitle: true,
              toolbar: false,
              maxBodyHeight: "80vh",
              thirdSortClick: false,
              rowStyle: (rowData: any) => ({
                fontFamily: "Open Sans",
                fontStyle: "normal",
                fontWeight: "400",
                fontSize: "14px",
                color: "#101F4C",
              }),
              headerStyle: {
                padding: "6px 16px",
                fontFamily: "Open Sans",
              },
            }}
          />
        </TableWrapper>
      </ThemeProvider>
      {openFilter && (
        <CustomDrawer open>
          <UsersFilter
            setTaskFilterState={setTaskFilterState}
            taskFilterState={taskFilterState}
            tableData={tableData}
            setSearchTableData={setSearchTableData}
            roles={roles}
            onClose={() => {
              setOpenFilter(false);
            }}
            setSearchTerm={setSearchTerm}
          />
        </CustomDrawer>
      )}
      {showAddUser ? (
        <PopupComponent
          open={showAddUser}
          hideButtons
          setShowPopUp={setShowAddUser}
          modalTitle={"Add users to the project"}
          modalContent={
            <AddUsersEmailPopup showEmailOverlay={showEmailOverlay} />
          }
          modalmessage={""}
          primaryButtonLabel={"Yes"}
          SecondaryButtonlabel={"No"}
          callBackvalue={() => {}}
          width={"458px"}
          showButton={false}
        />
      ) : (
        <></>
      )}
      <Drawer
        anchor={"right"}
        open={openDrawer}
        onClose={() => {
          setOpenDrawer(false);
        }}
      >
        <AddUsersEmailOverlay
          form={form}
          setOpenDrawer={setOpenDrawer}
          roles={rolesArr}
          selectedProjectId={router.query.projectId}
        />
      </Drawer>

      <Drawer
        anchor={"right"}
        open={showEdit}
        onClose={() => {
          setShowEdit(false);
        }}
      >
        <EditRoleOverlay
          onClose={() => {
            setShowEdit(false);
          }}
          userData={selectedRowData}
        />
      </Drawer>
    </ProjectUsersListContainer>
  );
};
ProjectUsersList.displayName = "ProjectUsersList";
