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

export const ProjectListFlatView = ({
  projects,
  projectActions,
  truncateString,
}: any) => {
  const router = useRouter();
  const defaultMaterialTheme = createTheme();
  const [sortObj, setSortObj] = useState(true);
  const [hoveringOver, setHoveringOver] = useState("");

  const [showMoreActions, setShowMoreActions] = useState<boolean>(false);

  const [projectsState, setProjectsState] = useState(projects);

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
      cellStyle: { width: "32%" },
      render: (rowData: any) => {
        return <><div className="hover:cursor-pointer" onClick={()=>{
          router.push(`/projects/${rowData._id}/sections`);
        }}>
          {truncateString(rowData.projectName, 50)}
          </div></>;
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
          </CapturesFieldContainer>
        );
      },
      cellStyle: { width: "25%" },
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
                    ? rowData.numberOfUsers
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
      cellStyle: { width: "28%" },

      customSort: () => sortByLastUpdated(),
      render: (rowData: any) => {
        return <> 
        {isNaN(Date.parse(rowData.lastUpdated))
          ? "N/A"
          : moment(rowData.lastUpdated).format('DD MMM YYYY')}
        </>;
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
          <TooltipText  title="Project Menu">
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
    </ProjectUsersListContainer>
  );
};
