import { createTheme, Paper, ThemeProvider } from "@mui/material";
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

export const ProjectListFlatView = ({ projects, projectActions }: any) => {
  const router = useRouter();
  const defaultMaterialTheme = createTheme();
  const [sortObj, setSortObj] = useState(true);
  const [hoveringOver, setHoveringOver] = useState("");

  const [showMoreActions, setShowMoreActions] = useState<boolean>(false);

  const [projectsState, setProjectsState] = useState(projects);

  useEffect(() => {
    setProjectsState(projects);
  }, [projects]);

  const sortBy = (a: any, b: any, field: string) => {
    if (sortObj) {
      setProjectsState(
        [].concat(projectsState).sort((a, b) => a[field] - b[field])
      );
    } else {
      setProjectsState(
        [].concat(projectsState).sort((a, b) => b[field] - a[field])
      );
    }
    setSortObj(!sortObj);
    // return a.numberOfUsers - b.numberOfUsers;
  };

  const handleRowHover = (event: any, propsData: any) =>
    setHoveringOver(`${propsData.index}`);

  const handleRowHoverLeave = (event: any, propsData: any) =>
    setHoveringOver("");

  const getFullName = (fName: string, lName: string) => {
    if (fName && lName)
      return `${fName.charAt(0).toUpperCase()}${lName.charAt(0).toUpperCase()}`;
    else if (fName)
      return `${fName.charAt(0).toUpperCase()}${fName.charAt(1).toUpperCase()}`;
    else if (lName)
      return `${lName.charAt(0).toUpperCase()}${lName.charAt(1).toUpperCase()}`;

    return `--`;
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
      cellStyle: { width: "20%" },
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
              <CaptureImageIcon
                src={capture360Image}
                alt={""}
                width={13}
                height={13}
              />
              <CaptureCount>
                {" "}
                {rowData.capture360Count?.length > 1
                  ? rowData.capture360Count
                  : `0${rowData.capture360Count}`}
              </CaptureCount>
            </CapturesField>
            <CapturesField>
              <CaptureImageIcon
                src={videoWalk}
                alt={""}
                width={16}
                height={16}
              />

              <CaptureCount>
                {rowData.captureVideoWalkCount?.length > 1
                  ? rowData.captureVideoWalkCount
                  : `0${rowData.captureVideoWalkCount}`}
              </CaptureCount>
            </CapturesField>
            <CapturesField>
              <CaptureImageIcon
                src={phoneImage}
                alt={""}
                width={15}
                height={15}
              />
              <CaptureCount>
                {rowData.capturePhoneCount?.length > 1
                  ? rowData.capturePhoneCount
                  : `0${rowData.capturePhoneCount}`}
              </CaptureCount>
            </CapturesField>
            <CapturesField>
              <CaptureImageIcon
                src={captureLidarIcon}
                alt={""}
                width={14}
                height={14}
              />
              <CaptureCount>
                {rowData.captureLidarCount?.length > 1
                  ? rowData.captureLidarCount
                  : `0${rowData.captureLidarCount}`}
              </CaptureCount>
            </CapturesField>
            <CapturesField>
              <CaptureImageIcon
                src={capture360Image}
                alt={""}
                width={13}
                height={13}
              ></CaptureImageIcon>
              <CaptureCount>
                {rowData.captureDroneCount?.length > 1
                  ? rowData.captureDroneCount
                  : `0${rowData.captureDroneCount}`}
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

      customSort: (a: any, b: any) => sortBy(a, b, "numberOfUsers"),
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
      title: <CustomColumnTitle>Last Updated</CustomColumnTitle>,
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
      cellStyle: { width: "40%" },

      customSort: (a: any, b: any) => sortBy(a, b, "lastUpdated"),
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
      cellStyle: { width: "15%" },
      sorting: false,
      render: (rowData: any) => {
        return hoveringOver == rowData.tableData.id ? (
          <CustomMenu
            hoveringOver={hoveringOver}
            imageSrc={MoreActions}
            menuOptions={projectActions}
            data={rowData}
          />
        ) : (
          <></>
        );
      },
    },
  ];

  return (
    <ProjectUsersListContainer noTopPadding>
      <ThemeProvider theme={defaultMaterialTheme}>
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
            maxBodyHeight: "100vh",
            overflowY: "auto",
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
      </ThemeProvider>
    </ProjectUsersListContainer>
  );
};
