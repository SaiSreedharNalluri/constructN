import {
  createTheme,
  Drawer,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ThemeProvider,
  Tooltip,
} from "@mui/material";
import { styled } from "@mui/system";

import { tooltipClasses, TooltipProps } from "@mui/material";

import moment from "moment";
import { useRouter } from "next/router";
import { forwardRef, useEffect, useState } from "react";
import {
  addUserRoles,
  getProjectUsers,
  getUserRoles,
  removeProjectUser,
  updateProjectUserRole,
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
  // ChatIconImage,
  EditIconImage,
} from "./ProjectUsersListStyles";
import searchIcon from "../../../public/divami_icons/search.svg";
import UserFilterIcon from "../../../public/divami_icons/UserFilterIcon.svg";
import CustomButton from "../custom-button/CustomButton";
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
import LocalSearch from "../local_component/LocalSearch";
import CustomLoader from "../custom_loader/CustomLoader";
import { TooltipText } from "../side-panel/SidePanelStyles";
import { CustomToast } from "../custom-toaster/CustomToast";
import { setTheFormatedDate } from "../../../utils/ViewerDataUtils";
import CustomLoggerClass from "../../divami_components/custom_logger/CustomLoggerClass";
import { getCookie } from "cookies-next";
import { Mixpanel } from "../../analytics/mixpanel";
export const ProjectUsersList = ( {projectId,onBoardScreen,usersCount}: any) => {
  const customLogger = new CustomLoggerClass();
  const [tableData, setTableData] = useState<any>([]);
  const router = useRouter();
  const defaultMaterialTheme = createTheme();
  const [sortObj, setSortObj] = useState(true);
  const [showAddUser, setShowAddUser] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [form, setForm] = useState({});
  const [searchTableData, setSearchTableData] = useState([]);
  const [rolesArr, setRolesArr] = useState<string[] | []>([]);
  const [isFilterApplied, setIsFilterApplied] = useState<boolean>(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState({});
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);

  const [showPopUp, setshowPopUp] = useState(false);
  const [emailId, setEmailId] = useState<any>();
  const [isApplying, setIsApplying] = useState(false);
  const [taskFilterState, setTaskFilterState] = useState({
    isFilterApplied: false,
    filterData: {},
    numberOfFilters: 0,
  });
  const SecondAssigneeList = styled("div")({
    background: "white",

    padding: "15px",
    color: "#101F4C",
    fontSize: "14px",
    border: "1px solid #D9D9D9",
    fontStyle: "Open Sans",

    boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.16)",
    borderRadius: "4px",
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
                {rowData.firstName?.charAt(0)?.toUpperCase()}
                {rowData.lastName?.charAt(0)?.toUpperCase()}
              </UserDefaultIcon>
            )}

            <TooltipText title={rowData.fullName}>
              <UserNameText>
                {rowData?.fullName?.length > 40
                  ? `${rowData?.fullName
                      .substring(0, 7)
                      .charAt(0)
                      .toUpperCase()}${rowData?.fullName?.substring(1, 7)}...`
                  : rowData?.fullName?.charAt(0)?.toUpperCase() +
                    rowData?.fullName?.slice(1)}
              </UserNameText>
            </TooltipText>
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
      customSort: () => sortBy(),

      render: (rowData: any) => {
        if(rowData?.assignedOn)
        {
          return <>{setTheFormatedDate(rowData.assignedOn)}</>;
        }
        else 
        {
          return '-'
        }
       
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
          <ImageButtons id={"rowActions"}>
            {/* <TooltipText title="chat" > 
             <div className="flex" >
             <ChatIconImage src={ChatIcon} alt="" />
             </div>
            </TooltipText> */}
            <TooltipText title="Deassign">
              <div className="flex ">
                <RemoveIconImage
                  src={RemoveIcon}
                  alt=""
                  onClick={() => {
                    setshowPopUp(true);
                    setEmailId(rowData);
                  }}
                />
              </div>
            </TooltipText>
            <TooltipText title="Edit">
              <div className="flex ">
                <EditIconImage
                  src={Edit}
                  alt=""
                  onClick={() => {
                    setShowEdit(true);
                    setSelectedRowData(rowData);
                  customLogger.logInfo("Edit User Role")  
                  }}
                  className="cursor-pointer"
                />
              </div>
            </TooltipText>
          </ImageButtons>
        );
      },
    },
  ];

  const sortBy = () => {
    if (searchTableData.length === 0) {
      return; 
    }
    setTableData((tableData:any) => {
      const sortedData = [...tableData].sort((a, b) => {
        if (!a.assignedOn && !b.assignedOn) {
          return 0;
        } else if (!a.assignedOn) {
          return 1; 
        } else if (!b.assignedOn) {
          return -1;
        } else {
          return sortObj
            ? new Date(b.assignedOn).valueOf() - new Date(a.assignedOn).valueOf()
            :new Date(a.assignedOn).valueOf() - new Date(b.assignedOn).valueOf() ;
        }
      });
      return sortedData;
    });
    setSortObj(!sortObj);
    // return a.numberOfUsers - b.numberOfUsers;
  };

  const deleteUser = (rowData: any) => {
    const email = rowData?.email?.toLocaleLowerCase();
    removeProjectUser(email, router.query.projectId as string || projectId)
      .then((response) => {
        if (response?.success === true) {
          CustomToast("Deassign User","success");
          setTableData(
            response.result.map((each: any) => {
              return {
                ...each,
                ...each.user,
                updatedAt: new Date(each.user?.updatedAt),
              };
            })
          );
          setDataLoaded(true);
        }
      })
      .catch((error) => {
        if (error.success === false) {
          CustomToast("You don't have permission. Contact Admin.","error");

          setDataLoaded(true);
        }
      });
  };

  const getUsersList = () => {
    getProjectUsers(router.query.projectId as string || projectId)
      .then((response: any) => {              
        if (response.success) {
          if(onBoardScreen==="onBoarding"){
          usersCount.value=response.result.length
          }          
          setTableData(
            response.result.map((each: any) => {
              return {
                ...each,
                ...each.user,
                updatedAt: new Date(each.user?.updatedAt),
              };
            })
          );
          setDataLoaded(true);
        }
      })
      .catch((err: any) => setDataLoaded(true));
  };

  const appendToTable = (bool: boolean) => {
    if (bool) {
      setDataLoaded(false);
      getUsersList();
    }
  };
  useEffect(() => {
    if (router.isReady && router.query.projectId || projectId) {
      Mixpanel.track( {name: "manage_users_page_loaded",project_id:router.query.projectId?router.query.projectId:"unknown" ,company_id:"unknown",screen_name:"manage_users_page",event_category:"manage_users",event_action:"manage_users_page_loaded",user_id:user?._id})
      getUsersList();
      getUserRoles().then((res: any) => {
        const rolesData = res.result.map((each: any) => {
          return {
            label: each,
            value: each,
          };
        });
        setRolesArr(rolesData);
        // setDataLoaded(true);
      });
    }
  }, [router.isReady, router.query.projectId]);
  const userObj: any = getCookie('user');
  let user :any= null;
  if (userObj) user = JSON.parse(userObj);

  const formHandler = (event: any) => {
    setOpenDrawer(true);
    customLogger.logInfo(`Add New User Menu`)
  };
  const updateRole = (selectedRole: string, rowData: any) => {
    const projectInfo = {
      role: selectedRole,
      email: rowData.email,
    };
    if(!isApplying){
      setIsApplying(true)
      updateProjectUserRole(projectInfo, router.query.projectId as string || projectId)
      .then((res: any) => {
        setIsApplying(false);
        CustomToast("User Role updated", "success");
        setShowEdit(false);
        getUsersList();
      })
      .catch((err) => {
        setIsApplying(false);
        CustomToast("You don't have permission. Contact Admin.","error");
      });
    }

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
  const localizationOptions = {
    body: {
      emptyDataSourceMessage: <LocalSearch />,
    },
  };
  const[isHover,setIsHover]=useState(null)
  const handleMouseEnter= (id:any) => {
    setIsHover(id);
  }; 
  const handleMouseLeave = () => {
    setIsHover(null);
  };  


  return (
    <ProjectUsersListContainer>
      <TableHeader>
        <Header>{`${onBoardScreen !==undefined && onBoardScreen==="onBoarding"?"":"Manage Users"}`}</Header>  
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
                autoFocus={true}
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
      Mixpanel.track( {name: "search_closed",project_id:router.query.projectId?router.query.projectId:"" ,company_id:"unknown",screen_name:"manage_users_page",event_category:"search_flow",event_action:"search_closed",user_id:user?._id})          
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
      Mixpanel.track( {name: "search_clicked",project_id:router.query.projectId?router.query.projectId:"" ,company_id:"unknown",screen_name:"manage_users_page",event_category:"search_flow",event_action:"search_clicked",user_id:user?._id})          
                setIsSearching(true);
              }}
            />
          )}
           {onBoardScreen!==undefined && onBoardScreen==="onBoarding"?"" :<HeaderImage
            src={UserFilterIcon}
            alt=""
            width={24}
            height={24}
            onClick={() => {
      Mixpanel.track( {name: "filter_clicked",project_id:router.query.projectId?router.query.projectId:"" ,company_id:"unknown",screen_name:"manage_users_page",event_category:"filters",event_action:"filter_clicked",user_id:user?._id})          
              setOpenFilter(true);
            }}
          />}       
          {taskFilterState.numberOfFilters ? <FilterIndicator /> : <></>}

          <CustomButton
            type={"contained"}
            label={"Add User"}
            formHandler={formHandler}
            projectId={router.query.projectId}
            userId={user?._id}
          />
        </HeaderActions>
      </TableHeader>   
      {dataLoaded ?<TableContainer className={`${onBoardScreen !==undefined && onBoardScreen==="onBoarding"?`calc-h326 `:`calc-h130` } overflow-y-auto`} >
  <Table>
    <TableHead className="sticky top-0  z-10 bg-white">
      <TableRow>
        <TableCell>User Name</TableCell>
        <TableCell>User Email</TableCell>
        <TableCell>Role</TableCell>
        <TableCell >
          <div  className="flex items-center">
            <p> Assigned On </p>
            <div className="ml-[4px]">
            {sortObj ? 
             <div onClick={sortBy} className=" cursor-pointer">
               <SortIconStyled />
             </div>
       
        
      : 
      <div onClick={sortBy} className=" cursor-pointer">
         <SortDescIcon />
      </div>
       
      }
            </div>
          </div>
            <span>
         
            </span>  </TableCell>
        <TableCell></TableCell>

      </TableRow>
    </TableHead>
 <TableBody className=" ">
      {searchTableData.length>0 ? 
      searchTableData.map((rowData:any, index) => (
        <TableRow className={`h-[56.8px]  ${isHover===rowData._id?`hover:bg-[#fbece2]`:""} `} key={index} onMouseMove={()=>handleMouseEnter(rowData._id)}  onMouseLeave={()=>handleMouseLeave()}>
          <TableCell width="20%">
          <UserName>
            {rowData.avatar ? (
              <UserImage src={rowData.avatar} alt={""} width={24} height={24} />
            ) : (
              <UserDefaultIcon>
                {rowData.firstName?.charAt(0)?.toUpperCase()}
                {rowData.lastName?.charAt(0)?.toUpperCase()}
              </UserDefaultIcon>
            )}

            <TooltipText title={rowData.fullName}>
              <UserNameText>
                {rowData?.fullName?.length > 40
                  ? `${rowData?.fullName
                      .substring(0, 7)
                      .charAt(0)
                      .toUpperCase()}${rowData?.fullName?.substring(1, 7)}...`
                  : rowData?.fullName?.charAt(0)?.toUpperCase() +
                    rowData?.fullName?.slice(1)}
              </UserNameText>
            </TooltipText>
          </UserName>
          </TableCell>
          <TableCell  width="25%">
            {rowData.email}
          </TableCell>
          <TableCell  width="15%">
            {rowData.role}
          </TableCell>
          <TableCell  width="30%">
        {rowData.updatedAt ? moment(rowData.assignedOn).format('MMM DD YYYY') : '-'}
      </TableCell>
     
      <TableCell  width="10%">
     {isHover===rowData._id? 
     rowData._id===user?._id?"":<div className="flex items-center">
     {/* <TooltipText title="chat" > 
      <div className="flex" >
      <ChatIconImage src={ChatIcon} alt="" />
      </div>
     </TooltipText> */}
     <TooltipText title="Deassign">
       <div className="flex ">
         <RemoveIconImage
           src={RemoveIcon}
           alt=""
           onClick={() => {
             setshowPopUp(true);
             setEmailId(rowData);
           }}
         />
       </div>
     </TooltipText>
     <TooltipText title="Edit">
       <div className="flex ">
         <EditIconImage
           src={Edit}
           alt=""
           onClick={() => {
             setShowEdit(true);
             setSelectedRowData(rowData);
           customLogger.logInfo("Edit User Role")  
           }}
           className="cursor-pointer"
         />
       </div>
     </TooltipText>
   </div>
     
:""}
      </TableCell>
    
        </TableRow>
      )): <TableRow><TableCell  className="flex justify-center p-2"> <p> No User found</p></TableCell></TableRow>}
    </TableBody>
  </Table>
</TableContainer>:<CustomLoader />}
      {openFilter && (
        <CustomDrawer open>
{Mixpanel.track( {name: "filters_window_panel_opened",project_id:router.query.projectId?router.query.projectId:"" ,company_id:"unknown",screen_name:"manage_users_page",event_category:"filters",event_action:"filters_window_panel_opened",user_id:user?._id})}
          <UsersFilter
            setTaskFilterState={setTaskFilterState}
            taskFilterState={taskFilterState}
            tableData={tableData}
            setSearchTableData={setSearchTableData}
            roles={rolesArr}
            onClose={() => {
              setOpenFilter(false);
            }}
            setSearchTerm={setSearchTerm}
            selectedProjectId={router.query.projectId}
            userId={user?._id}
          />
        </CustomDrawer>
      )}
      {/* {showAddUser || showPopUp ? (
        <PopupComponent
          open={showAddUser ? showAddUser : showPopUp}
          hideButtons
          setShowPopUp={showAddUser ? setShowAddUser : setshowPopUp}
          modalTitle={
            showAddUser ? "Add User(s) to the Project" : "Deassign User"
          }
          modalContent={
            showAddUser ? (
              <AddUsersEmailPopup showEmailOverlay={showEmailOverlay} />
            ) : (
              ""
            )
          }
          modalmessage={
            showAddUser ? "" : "Are you sure you want to Deassign user? "
          }
          primaryButtonLabel={showAddUser ? "" : "Yes"}
          SecondaryButtonlabel={showAddUser ? "" : "No"}
          callBackvalue={
            showAddUser
              ? () => {}
              : () => {
                  setDataLoaded(false);
                  deleteUser(emailId), setshowPopUp(false);
                }
          }
          width={"458px"}
          backdropWidth={true}
          showButton={showAddUser ? false : true}
        />
      ) : (
        <></>
      )} */}
      {
 showPopUp?   <PopupComponent
        open={showPopUp}
        hideButtons
        setShowPopUp={setshowPopUp}
        modalTitle={
         "Deassign User"
        }

        modalmessage={ "Are you sure you want to Deassign user? "
        }
        primaryButtonLabel={ "Yes"}
        SecondaryButtonlabel={ "No"}
        callBackvalue={
        
             () => {
                setDataLoaded(false);
                deleteUser(emailId), setshowPopUp(false);
              }
        }
        width={"458px"}
        backdropWidth={true}
        showButton={true}
      />:""
      }
       {openDrawer ?
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
          selectedProjectId={router.query.projectId || projectId}
          appendToTable={appendToTable}
          tableData={tableData}
          userId={user?._id}
        />
      </Drawer>:<></>}

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
          roles={rolesArr}
          updateRole={updateRole}
        />
      </Drawer>
    </ProjectUsersListContainer>
  );
};
ProjectUsersList.displayName = "ProjectUsersList";
