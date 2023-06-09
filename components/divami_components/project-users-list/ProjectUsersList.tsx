import { createTheme, InputAdornment, ThemeProvider } from "@mui/material";

import moment from "moment";
import { useRouter } from "next/router";
import { forwardRef, useEffect, useState } from "react";
import { IProjects } from "../../../models/IProjects";
import { getProjectUsers, removeProjectUser } from "../../../services/project";
import RemoveIcon from "../../../public/divami_icons/RemoveIcon.svg";
import ChatIcon from "../../../public/divami_icons/ChatIcon.svg";
import Image from "next/image";
import {
  Header,
  HeaderActions,
  HeaderImage,
  ImageButtons,
  ProjectUsersListContainer,
  RemoveIconImage,
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
import SidePanelMenu from "../side-panel/SidePanel";
import SearchBoxIcon from "../../../public/divami_icons/search.svg";
import CrossIcon from "../../../public/divami_icons/crossIcon.svg";
import UsersFilter from "../usersList/UsersFilter";
import CustomDrawer from "../custom-drawer/custom-drawer";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

export const ProjectUsersList = ({ setShowEmptyState }: any) => {
  const [tableData, setTableData] = useState<any>([]);
  const router = useRouter();
  const defaultMaterialTheme = createTheme();
  const [roles, setRoles] = useState<string[] | []>([]);
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
    },
    {
      title: "Assigned On",
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
      render: (rowData: any) => {
        return hoveringOver ? (
          <ImageButtons hoveringOver={hoveringOver}>
            <RemoveIconImage src={ChatIcon} alt="" />
            <Image
              src={RemoveIcon}
              alt=""
              onClick={() => {
                deleteUser(rowData);
              }}
            />
          </ImageButtons>
        ) : (
          <></>
        );
      },
    },

    // { title: "Phone Number", field: "phone", sorting: false },
    // {
    //   title: "Age",
    //   field: "age",
    //   emptyValue: () => <em>null</em>,
    // },
    // {
    //   title: "Gender",
    //   field: "gender",
    //   lookup: { M: "Male", F: "Female" },
    // },
    // {
    //   title: "City",
    //   field: "city",
    //   sorting: false,
    // },
    // {
    //   title: "School Fee",
    //   field: "fee",
    //   type: "currency",
    //   currencySetting: { currencyCode: "INR", minimumFractionDigits: 0 },
    // },
  ];

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
    }
  }, [router.isReady, router.query.projectId]);
  const [hoveringOver, setHoveringOver] = useState("");
  // This is the only downside.. very hacky
  const [, setForceUpdate] = useState(0);
  const forceUpdate = () => setForceUpdate((old) => old + 1);

  // const handleRowHover = (event, propsData) =>
  //   setHoveringOver(`${propsData.data.tableData.id}`);
  // const handleRowHoverLeave = (event, propsData) => setHoveringOver("");

  const formHandler = (event: any) => {
    setShowEmptyState(true);
  };
  const handleEditClick = (event: any, rowData: any) => {
    rowData.tableData.editing = "delete";
    forceUpdate();
  };
  const rowActions = () => {
    return [
      {
        icon: ChatIcon as any,
        tooltip: "",
        hidden: false,
        onClick: (event: any, row: any) => {},
      },
      {
        icon: RemoveIcon as any,
        tooltip: "",
        hidden: false,

        onClick: handleEditClick,
      },
    ];
  };

  const [isSearching, setIsSearching] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);

  const [searchTableData, setSearchTableData] = useState([]);
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
                  setSearchTableData(
                    tableData.filter((each: any) =>
                      each.fullName.includes(e.target?.value)
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
              Container: (props) => <Paper {...props} elevation={0} />,
              // Row: (props) => {
              //   return (
              //     <MTableBodyRow
              //       {...props}
              //       onMouseEnter={(e: any) => handleRowHover(e, props)}
              //       onMouseLeave={(e: any) => handleRowHoverLeave(e, props)}
              //     />
              //   );
              // },

              // EditRow: (props) => {
              //   return (
              //     <MTableEditRow
              //       {...props}
              //       // onEditingApproved={(mode, newData, oldData) => {
              //       //   if (oldData.tableData.editing === "delete") {
              //       //     // deleteUser(
              //       //     //   tableData.find(
              //       //     //     (each) => each.tableData.id == oldData.tableData.id
              //       //     //   )
              //       //     // );
              //       //     // const dataCopy = [...data];
              //       //     // dataCopy.splice(oldData.tableData.id, 1);
              //       //     // setData(dataCopy);
              //       //   }
              //       // }}
              //     />
              //   );
              // },
            }}
            columns={columns}
            data={searchTableData ? searchTableData : []}
            // actions={[
            //   {
            //     icon: RemoveIcon,
            //     tooltip: "Delete User",
            //     onClick: (event, rowData) => alert("You want to delete "),
            //   },
            // ]}
            // actions={[
            //   (rowData: any) => {
            //     return hoveringOver && rowData.tableData.id === hoveringOver
            //       ? { icon: RemoveIcon, hidden: false, onClick: handleEditClick }
            //       : { icon: RemoveIcon, hidden: true, onClick: handleEditClick };
            //   },
            // ]}
            title={""}
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
          />
        </CustomDrawer>
      )}
    </ProjectUsersListContainer>
  );
};
ProjectUsersList.displayName = "ProjectUsersList";
