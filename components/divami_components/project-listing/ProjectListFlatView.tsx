import { createTheme, Paper, ThemeProvider, Tooltip } from "@mui/material";
import moment from "moment";
import router, { useRouter } from "next/router";
import { forwardRef, useEffect, useState } from "react";
import {
  ProjectUsersListContainer,
  HeaderActions,
  HeaderImage,
  StyledTable,
  SortIconStyled,
  ImageButtons,
  RemoveIconImage,
  CustomColumnTitle,
  TableWrapper,
  RowActionWrapper,
} from "../project-users-list/ProjectUsersListStyles";
import MoreActions from "../../../public/divami_icons/MoreActions.svg";
import Image from "next/image";
import {
  CaptureCount,
  CaptureImageIcon,
  CapturesField,
  CapturesFieldContainer,
  OtherUsersCount,
  UserMonogram,
  UsersInfo,
} from "./ProjectListingStyles";
import LaserIcon from "../../../public/icons/LaserIcon.svg";
import capture360Image from "../../../public/divami_icons/capture360Image.svg";
import captureLidarIcon from "../../../public/divami_icons/captureLidarIcon.svg";
import phoneImage from "../../../public/divami_icons/phoneImage.svg";
import videoWalk from "../../../public/divami_icons/videoWalk.svg";
import { CustomMenu } from "../custom-menu/CustomMenu";
import { LightTooltip } from "../task_list/TaskList";
import { UsersListTooltip } from "./UsersListTooltip";
import { UserInfoTooltip } from "./UserInfoToolTip";
import { MTableBodyRow } from "material-table";
import { SortDescIcon } from "./SortDescIcon";
import LocalSearch from "../local_component/LocalSearch";
import DroneImage from "../../../public/divami_icons/DroneImage.svg";
import { TooltipText } from "../side-panel/SidePanelStyles";
import Delete from "../../../public/divami_icons/delete.svg";
import { CustomToast } from "../custom-toaster/CustomToast";
import PopupComponent from "../../popupComponent/PopupComponent";
import { deleteProject } from "../../../services/project";
export const ProjectListFlatView = ({
  projects,
  projectActions,
  truncateString,
  onDelete
}: any) => {
  const router = useRouter();
  const defaultMaterialTheme = createTheme();
  const [sortObj, setSortObj] = useState(true);
  const [hoveringOver, setHoveringOver] = useState("");

  const [showMoreActions, setShowMoreActions] = useState<boolean>(false);

  const [projectsState, setProjectsState] = useState(projects);
  const[isAdmin,setisAdmin]=useState(false);
  const[isPending,setisPending]=useState(false);
  const[projectId,setProjectId]=useState("");
  const[isDelete,setDelete]=useState(false);
  const[role,setRole]=useState("");
  useEffect(() => {
    // setProjectsState([...projects]);
    setProjectsState([...projects]);
  }, [projects]);

  const sortBy = (field: string) => {
    if (sortObj) {
      setProjectsState(
        [].concat(projectsState).sort((a, b) => b[field] - a[field])
      );
    } else {
      setProjectsState(
        [].concat(projectsState).sort((a, b) => a[field] - b[field])
      );
    }
    setSortObj(!sortObj);
    // return a.numberOfUsers - b.numberOfUsers;
  };

  const sortByLastUpdated = () => {
    setProjectsState((prevState:any) => {
      const sortedProjects = [...prevState].sort((a, b) => {
        const dateA = Date.parse(a.lastUpdated);
        const dateB = Date.parse(b.lastUpdated);
  
        if (isNaN(dateA) && isNaN(dateB)) {
          return 0; 
        } else if (isNaN(dateA)) {
          return 1; 
        } else if (isNaN(dateB)) {
          return -1; 
        } else {
          return sortObj ?dateB-dateA:dateA - dateB 
        }
      });
      return sortedProjects;
    });
    setSortObj(!sortObj);
    // return a.numberOfUsers - b.numberOfUsers;
  };

  const getFullName = (fName: string, lName: string) => {
    if (fName && lName)
      return `${fName.charAt(0).toUpperCase()}${lName.charAt(0).toUpperCase()}`;
    else if (fName)
      return `${fName.charAt(0).toUpperCase()}${fName.charAt(1).toUpperCase()}`;
    else if (lName)
      return `${lName.charAt(0).toUpperCase()}${lName.charAt(1).toUpperCase()}`;

    return `--`;
  };
  const handleProjectClick = (rowData:any) => {    
    if (rowData.status !== "Draft" && rowData.status !== "PendingApproval") {
      router.push(`/projects/${rowData._id}/sections`);
    } else if (rowData.status === "Draft" && rowData.role === "admin") {
      router.push(`project-onboarding?id=${rowData._id}`);
    } else if (rowData.status === "Draft" && rowData.role !== "admin") {
      setisAdmin(true);
    } else if (rowData.status === "PendingApproval") {
      setisPending(true);
    }
  };
  
  const localizationOptions = {
    body: {
      emptyDataSourceMessage: <LocalSearch />,
    },
  };
  const columns: any = [
    {
      title: "Project Name",
      field: "projectName",
      sorting: false,
      headerStyle: {
        fontFamily: "Open Sans",
        fontStyle: "normal",
        fontWeight: "500",
        fontSize: "14px",
        lineHeight: "20px",
        color: "#101F4C",
      },
      cellStyle: { width: "36%" },
      render: (rowData: any) => {
        return  <div className="flex items-center justify-between">
        <div className="hover:cursor-pointer" onClick={() => handleProjectClick(rowData)}>
               <Tooltip
              title={rowData.projectName?.length > 50 ? rowData.projectName : ""}
            >
              {truncateString(rowData.projectName, 50)}
            </Tooltip>
        </div>
        <div>
        {(rowData.status === "Draft" || rowData.status === "PendingApproval") && (
            <div>
          {rowData.status === 'PendingApproval' ? (
                <div className="text-sm text-white py-[0.5px] bg-[#006CD0] cursor-default px-[4px] rounded-[3px]">
                  {rowData.status.replace('Pending', 'Pending ')}
            </div>
              ) : (
                <div className="text-sm text-white py-[0.5px] bg-[#C24200] cursor-default px-[4px] rounded-[3px]">
                {rowData.status}
</div>
      )}
    </div>
  )}
        </div>
      </div>
      },
    },
    {
      title: "Captures",
      field: "email",
      sorting: false,
      headerStyle: {
        fontFamily: "Open Sans",
        fontStyle: "normal",
        fontWeight: "500",
        fontSize: "14px",
        lineHeight: "20px",
        color: "#101F4C",
      },
      render: (rowData: any) => {
        return (
          rowData.status === "Draft" ||   rowData.status === "PendingApproval" ?"-":
          <>
          <CapturesFieldContainer>
            <CapturesField>
              <TooltipText title="360 Image">
                <div>
                  <CaptureImageIcon src={capture360Image} alt={""} />
                </div>
              </TooltipText>
              <CaptureCount>
                {" "}
                {rowData.captures && rowData.captures["360 Image"]
                  ? rowData.captures["360 Image"]
                  : " -"}
              </CaptureCount>
            </CapturesField>

            <CapturesField>
              <TooltipText title="360° Video Walk">
                <div>
                  <CaptureImageIcon src={videoWalk} alt={""} />
                </div>
              </TooltipText>
              <CaptureCount>
                {rowData.captures && rowData.captures["360 Video"]
                  ? rowData.captures["360 Video"]
                  : " -"}
              </CaptureCount>
            </CapturesField>

            <CapturesField>
              <TooltipText title="Phone Image">
                <div className="">
                  <CaptureImageIcon src={phoneImage} alt={""} />
                </div>
              </TooltipText>

              <CaptureCount>
                {rowData.captures && rowData.captures["Phone Image"]
                  ? rowData.captures["Phone Image"]
                  : " -"}
              </CaptureCount>
            </CapturesField>

            {/* <CapturesField>
              <TooltipText title="Phone Video Walk">
                <div>
                  <CaptureImageIcon src={captureLidarIcon} alt={""} />
                </div>
              </TooltipText>
              <CaptureCount>
                {rowData.captures && rowData.captures["LiDAR Scan"]
                  ? rowData.captures["LiDAR Scan"]
                  : " -"}
              </CaptureCount>
            </CapturesField> */}

            <CapturesField>
              <TooltipText title="Drone Image">
                <div>
                  <CaptureImageIcon
                    src={DroneImage}
                    alt={""}
                  ></CaptureImageIcon>
                </div>
              </TooltipText>
              <CaptureCount>
                {rowData.captures && rowData.captures["Drone Image"]
                  ? rowData.captures["Drone Image"]
                  : " -"}
              </CaptureCount>
            </CapturesField>
            <CapturesField>
              <TooltipText title="Laser">
                <div>
                  <CaptureImageIcon
                    src={LaserIcon}
                    alt={""}
                  ></CaptureImageIcon>
                </div>
              </TooltipText>
              <CaptureCount>
                {rowData.captures["Laser"] || 0}
              </CaptureCount>
            </CapturesField>
          </CapturesFieldContainer>
          </>
        );
      },
      cellStyle: { width: "20%" },
    },
    {
      title: <CustomColumnTitle>Users</CustomColumnTitle>,
      field: "numberOfUsers",
      headerStyle: {
        fontFamily: "Open Sans",
        fontStyle: "normal",
        fontWeight: "500",
        fontSize: "14px",
        lineHeight: "20px",
        color: "#101F4C",
      },
      cellStyle: { width: "10%" },

      customSort: () => sortBy("numberOfUsers"),
      render: (rowData: any) => {
        return (
          <UsersInfo>
            <UsersInfo>
              {rowData.users.slice(0, 2)?.map((each: any, index: number) => {
                return (
                  <LightTooltip
                    arrow
                    key={index}
                    title={
                      <UserInfoTooltip
                        userData={each}
                        getFullName={getFullName}
                      />
                    }
                  >
                    <UserMonogram>
                      {getFullName(each.user.firstName, each.user.lastName)}
                    </UserMonogram>
                  </LightTooltip>
                );
                // return each.user?.avatar ? (
                //   <LightTooltip
                //     arrow
                //     title={<UserInfoTooltip userData={each} />}
                //   >
                //     <UserPic
                //       src={each.user.avatar}
                //       alt={""}
                //       width={24}
                //       height={24}
                //     />
                //   </LightTooltip>
                // ) : (
                //   <LightTooltip
                //     arrow
                //     title={<UserInfoTooltip userData={each} />}
                //   >
                //     <UserMonogram>
                //       {getFullName(each.user.firstName, each.user.lastName)}
                //     </UserMonogram>
                //   </LightTooltip>
                // );
              })}
            </UsersInfo>

            {Number(rowData.numberOfUsers) > 2 ? (
              <LightTooltip
                arrow
                title={
                  <UsersListTooltip
                    list={rowData.users.slice(2, 5)}
                    showMoreText={Number(rowData.numberOfUsers) > 5}
                    rowData={rowData}
                  />
                }
              >
                <OtherUsersCount>
                  +
                  {rowData.numberOfUsers - 2 > 9
                    ? rowData.numberOfUsers-2
                    : `0${rowData.numberOfUsers - 2}`}
                </OtherUsersCount>
              </LightTooltip>
            ) : (
              <></>
            )}
          </UsersInfo>
        );
      },
    },
    {
      title: <CustomColumnTitle>Last Captured</CustomColumnTitle>,
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
      cellStyle: { width: "14%" },

      customSort: () => sortByLastUpdated(),
      render: (rowData: any) => {
        return <> 
        {isNaN(Date.parse(rowData.lastUpdated))
          ? "N/A"
          : moment(rowData.lastUpdated).format('DD MMM YYYY')}
        </>;
      },
    },
    // {
    //   title: "",
    //   field: "",

    //   cellStyle: { width: "16%" },
    //   render: (rowData: any) => {
    //     return   <div>
    //     {rowData._id==="PRJ697680"?
    //      <div className="font-bold text-base text-[#101F4C] text-center" onClick={()=>router.push("project-onboarding")}>
    //      Click to Resume
    //     </div>:rowData._id==="PRJ69768" ?
    //     <div className="font-bold text-base text-[#101F4C] text-center" >
    //       Pending Approval
    //     </div>
    //    :""}  
    //    </div>
    //   },
    // },
    {


      cellStyle: { width: "16%" },
      sorting: false,
      render: (rowData: any) => {
        return (
          <div>
          {rowData.status === "Draft" ? (
            <div className="font-bold  text-[#101F4C] text-center cursor-pointer" onClick={() => handleProjectClick(rowData)}>
              Click to Resume
            </div>
          ) : rowData.status === "PendingApproval" ? (
            <div className="font-bold  text-[#101F4C] text-center cursor-pointer" onClick={() => setisPending(true)}>
              Pending Approval
            </div>
          ) : (
            ""
          )}
        </div>
            
          
        );
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
      cellStyle: { width: "15%" },
      sorting: false,
      render: (rowData: any) => {
        return (
         
          rowData.status === "Draft"|| rowData.status === "PendingApproval"?  <TooltipText title="Delete Project" placement="bottom"> 
          <div>
          <Image src={Delete} onClick={(e)=>{ 
            e.stopPropagation(); 
            setDelete(true)
            setProjectId(rowData._id)
            setRole(rowData.role)  ;}} 
alt="delete" className=" cursor-pointer"></Image>
          </div>
          </TooltipText>
          : <TooltipText  title="Project Menu">
             <div>
             <CustomMenu
             hoveringOver={hoveringOver}
             imageSrc={MoreActions}
             menuOptions={projectActions}
             data={rowData}
             id="rowMenu"
           />
           </div>
           </TooltipText>
            
          
        );
      },
    },
  ];

  return (
    <ProjectUsersListContainer noTopPadding>
      <ThemeProvider theme={defaultMaterialTheme}>
        <TableWrapper>
          <StyledTable
            components={{
              // Action: (props) => (
              //   <CustomMenu
              //     imageSrc={MoreActions}
              //     menuOptions={projectActions}
              //     // data={...props}
              //   />
              // ),
              Container: (props: any) => <Paper {...props} elevation={0} />,
              // Row: (props: any) => {
              //   return (
              //     <MTableBodyRow
              //       {...props}
              //       onMouseEnter={(e: any) => handleRowHover(e, props)}
              //       onMouseLeave={(e: any) => handleRowHoverLeave(e, props)}
              //     />
              //   );
              // },
            }}
            localization={localizationOptions}
            columns={columns}
            data={projectsState ? projectsState : []}
            // actions={[
            //   {
            //     icon: ArrowDropUpIcon,
            //     tooltip: "More",
            //     onClick: (event, rowData) => setShowMoreActions(true),
            //   },
            // ]}
            title={""}
            icons={{
              SortArrow: forwardRef((props, ref: any) => {
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
              }) as any,
            }}
            options={{
              search: false,
              paging: false,
              exportButton: false,
              exportFileName: "tableData",
              selection: false,
              showTitle: true,
              thirdSortClick: false,
              toolbar: false,
              // maxBodyHeight: "50px",
              overflowY: "auto",
              rowStyle: (rowData: any) => ({
                fontFamily: "Open Sans",
                fontStyle: "normal",
                fontWeight: "400",
                fontSize: "14px",
                color: "#101F4C",
                backgroundColor: rowData.status==="Draft" ?"#d9d9d9" :rowData.status === 'PendingApproval'?"#FFECE2":""
                // backgroundColor:
                //   rowData.tableData.id == hoveringOver ? "#FFF2EB" : "",
              }),
              headerStyle: {
                padding: "6px 16px",
                fontFamily: "Open Sans",
                borderBottom: "1px solid #FF843F",
              },
              actionsColumnIndex: -1,
            }}
            // localization={{
            //   header: {
            //     actions: " ",
            //   },
            // }}
          />
        </TableWrapper>
      </ThemeProvider>
        {
        isAdmin || isPending?<PopupComponent open={isAdmin?isAdmin:isPending}
        setShowPopUp={isAdmin?setisAdmin:setisPending}
        modalTitle={isAdmin? "Access Denied !!":"Review in progress !!"}
        modalmessage={
        isAdmin?
        <div className="flex flex-col">
          <div>
          1. The project you are trying to access is in draft stage.
          </div>
        <div>
        2. Please reach out to the admin of this project to finish the project setup.
        </div>
<div>
3. You will receive an email once the project is ready to use.
  </div>         
          </div>:<div className="flex flex-col">
          <div>
          1. The project you are trying to access has not been approved.
          </div>
        <div>
        2. You can access the project only after the project has been approved. 
        </div>
<div>
3. You will receive an email once the project is ready to use.
  </div>         
          </div>}
        primaryButtonLabel={"Ok"}
        SecondaryButtonlabel={""}
        callBackvalue={
          isAdmin?
          () => {
          setisAdmin(false)
        }:() => {
          setisPending(false)
        }}></PopupComponent>:""
      }
            {
        isDelete? <PopupComponent
        open={isDelete}
        setShowPopUp={setDelete}
        modalTitle={"'Attention'"}
        modalmessage={
         `Are you sure you want to 'Delete Project'?`
        }
        primaryButtonLabel={"Yes"}
        SecondaryButtonlabel={"No"}
        callBackvalue={()=>{onDelete(projectId,role);setDelete(false)}}
      />:""
      }
    </ProjectUsersListContainer>
  );
};
