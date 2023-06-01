import {
  createTheme,
  InputAdornment,
  Menu,
  Paper,
  ThemeProvider,
  Tooltip,
} from "@mui/material";
import moment from "moment";
import router, { useRouter } from "next/router";
import { forwardRef, useEffect, useState } from "react";
import {
  CustomSearchField,
  SearchAreaContainer,
} from "../../../pages/projects/[projectId]/sections/SectionsStyles";
import CustomButton from "../custom-button/CustomButton";
import CustomDrawer from "../custom-drawer/custom-drawer";
import { CloseIcon } from "../hotspot-filter-common/HotspotFilterStyled";
import SearchBoxIcon from "../../../public/divami_icons/search.svg";
import CrossIcon from "../../../public/divami_icons/crossIcon.svg";
import {
  ProjectUsersListContainer,
  TableHeader,
  HeaderActions,
  HeaderImage,
  StyledTable,
} from "../project-users-list/ProjectUsersListStyles";
import UsersFilter from "../usersList/UsersFilter";
import searchIcon from "../../../public/divami_icons/search.svg";
import UserFilterIcon from "../../../public/divami_icons/UserFilterIcon.svg";
import MoreActions from "../../../public/divami_icons/MoreActions.svg";
import Image from "next/image";
import {
  CaptureCount,
  CaptureImageIcon,
  CapturesField,
  CapturesFieldContainer,
  OtherUsersCount,
  UserMonogram,
  UserPic,
  UsersInfo,
} from "./ProjectListingStyles";
import capture360Image from "../../../public/divami_icons/capture360Image.svg";
import captureLidarIcon from "../../../public/divami_icons/captureLidarIcon.svg";
import phoneImage from "../../../public/divami_icons/phoneImage.svg";
import videoWalk from "../../../public/divami_icons/videoWalk.svg";
import { StyledMenu } from "../issue-listing/IssueListStyles";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { CustomMenu } from "../custom-menu/CustomMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { SortDescIcon } from "./SortDescIcon";
import { SortAscIcon } from "./SortAscIcon";
import ProjectListFilter from "./ProjectListFilter";

export const ProjectListFlatView = ({ projects }: any) => {
  const router = useRouter();
  const defaultMaterialTheme = createTheme();
  const [sortObj, setSortObj] = useState(true);

  const [showMoreActions, setShowMoreActions] = useState<boolean>(false);

  const [projectsState, setProjectsState] = useState(projects);

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

  const getFullName = (name: string) => {
    if (name) {
      const nameArr = name.split(" ");
      if (nameArr.length > 1) {
        return `${nameArr[0].charAt(0).toUpperCase}${
          nameArr[1].charAt(0).toUpperCase
        }`;
      }
    }
    return `DD`;
  };

  const columns: any = [
    {
      title: "Project Name",
      field: "projectName",
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
      title: "Captures",
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
    },
    {
      title: "Users",
      field: "numberOfUsers",
      headerStyle: {
        borderBottom: "1px solid #FF843F",
        fontFamily: "Open Sans",
        fontStyle: "normal",
        fontWeight: "500",
        fontSize: "14px",
        lineHeight: "20px",
        color: "#101F4C",
      },
      customSort: (a: any, b: any) => sortBy(a, b, "numberOfUsers"),
      render: (rowData: any) => {
        return (
          <UsersInfo>
            <UsersInfo>
              {rowData.users.slice(0, 2)?.map((each: any) => {
                return each.url ? (
                  <UserPic src={each.url} alt={""}></UserPic>
                ) : (
                  <UserMonogram>{getFullName(each.fullName)}</UserMonogram>
                );
              })}
            </UsersInfo>

            {Number(rowData.numberOfUsers) > 2 ? (
              <OtherUsersCount
                onMouseEnter={(e: any) => {
                  setAnchorEl(e.target);
                  setShowMenu(true);
                }}
              >
                +
                {rowData.numberOfUsers - 2 > 9
                  ? rowData.numberOfUsers
                  : `0${rowData.numberOfUsers - 2}`}
              </OtherUsersCount>
            ) : (
              <></>
            )}
            {/* {showMenu ? (
              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={showMoreActions}
                onClose={() => {}}
                onClick={(e) => {
                  setShowMoreActions(false);
                  setAnchorEl(null);
                }}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 1.5,
                    "& .MuiAvatar-root": {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    "&:before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                {rowData?.users?.splice(2, 5).map((option: any) => (
                  <>
                    <StyledMenu
                      className="custom-styled-menu"
                      key={option.label}
                      onClick={() => option.onClick()}
                      data-testid="sort-menu-item"
                    >
                      {option.fullName}
                    </StyledMenu>
                  </>
                ))}
                <StyledMenu
                  className="custom-styled-menu"
                  key={"viewmore"}
                  onClick={() => {}}
                  data-testid="sort-menu-item"
                >
                  View More
                </StyledMenu>
              </Menu>
            ) : (
              <></>
            )} */}
          </UsersInfo>
        );
      },
    },
    {
      title: "Last Updated",
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
      customSort: (a: any, b: any) => sortBy(a, b, "updatedAt"),
      render: (rowData: any) => {
        return <>{moment(rowData.updatedAt).format("DD MMM YYYY")}</>;
      },
    },
  ];
  const [isSearching, setIsSearching] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showMenu, setShowMenu] = useState<boolean>(false);

  const handleMenuClose = () => {
    setAnchorEl(null);
    setShowMoreActions(false);
  };

  const formHandler = (event: any) => {};

  const rowMenuOptions = [
    {
      label: "View Project Summary",
      icon: null,
      onClick: () => {},
    },
    {
      label: "Project Configuration",
      icon: null,
      onClick: () => {},
    },
    {
      label: "Project Details",
      icon: null,
      onClick: () => {},
    },
    {
      label: "Add Users",
      icon: null,
      onClick: () => {},
    },
    {
      label: "Archive Project",
      icon: null,
      onClick: () => {},
    },
  ];

  return (
    <ProjectUsersListContainer>
      <ThemeProvider theme={defaultMaterialTheme}>
        <StyledTable
          components={{
            Action: (props) => (
              <CustomMenu imageSrc={MoreActions} menuOptions={rowMenuOptions} />
            ),
            Container: (props) => <Paper {...props} elevation={0} />,
          }}
          columns={columns}
          data={projectsState ? projectsState : []}
          actions={[
            {
              icon: ArrowDropUpIcon,
              tooltip: "More",
              onClick: (event, rowData) => setShowMoreActions(true),
            },
          ]}
          title={""}
          // icons={{
          //   SortArrow: forwardRef((props, ref) => {
          //     return sortObj ? (
          //       <SortAscIcon {...props} ref={ref} />
          //     ) : (
          //       <SortDescIcon
          //         {...props}
          //         ref={ref}
          //         // onClick={() => {
          //         //   setSortObj(!sortObj);
          //         // }}
          //       />
          //     );
          //   }),
          // }}
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
            actionsColumnIndex: -1,
          }}
        />
      </ThemeProvider>
    </ProjectUsersListContainer>
  );
};
