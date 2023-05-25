import {
  createTheme,
  InputAdornment,
  Paper,
  ThemeProvider,
} from "@mui/material";
import moment from "moment";
import router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
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

import Image from "next/image";
import {
  CaptureCount,
  CaptureImageIcon,
  CapturesField,
  CapturesFieldContainer,
} from "./ProjectListingStyles";
import capture360Image from "../../../public/divami_icons/capture360Image.svg";
import captureLidarIcon from "../../../public/divami_icons/captureLidarIcon.svg";
import phoneImage from "../../../public/divami_icons/phoneImage.svg";
import videoWalk from "../../../public/divami_icons/videoWalk.svg";

export const ProjectListFlatView = ({ projects }: any) => {
  const router = useRouter();
  const defaultMaterialTheme = createTheme();

  const [taskFilterState, setTaskFilterState] = useState({
    isFilterApplied: false,
    filterData: {},
    numberOfFilters: 0,
  });
  const columns = [
    {
      title: "Project Name",
      field: "projectName",
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
                width={12}
                height={12}
              />
              <CaptureCount>{rowData.capture360Count}</CaptureCount>
            </CapturesField>
            <CapturesField>
              <CaptureImageIcon
                src={videoWalk}
                alt={""}
                width={12}
                height={12}
              />

              <CaptureCount>{rowData.captureVideoWalkCount}</CaptureCount>
            </CapturesField>
            <CapturesField>
              <CaptureImageIcon
                src={phoneImage}
                alt={""}
                width={12}
                height={12}
              />
              <CaptureCount>{rowData.capturePhoneCount}</CaptureCount>
            </CapturesField>
            <CapturesField>
              <CaptureImageIcon
                src={captureLidarIcon}
                alt={""}
                width={12}
                height={12}
              />
              <CaptureCount>{rowData.captureLidarCount}</CaptureCount>
            </CapturesField>
            <CapturesField>
              <CaptureImageIcon
                src={capture360Image}
                alt={""}
                width={12}
                height={12}
              ></CaptureImageIcon>
              <CaptureCount>{rowData.captureDroneCount}</CaptureCount>
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
      render: (rowData: any) => {
        return <>+ {rowData.numberOfUsers}</>;
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
      render: (rowData: any) => {
        return <>{moment(rowData.updatedAt).format("DD MMM YYYY")}</>;
      },
    },
  ];
  const [isSearching, setIsSearching] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);

  const [searchTableData, setSearchTableData] = useState(
    projects.length ? projects : []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchWindow = () => {
    setSearchTableData(projects);
    if (searchTerm === "") {
      setIsSearching(!isSearching);
    } else {
      setSearchTerm("");
    }
  };

  useEffect(() => {
    if (projects.length) {
      setSearchTableData(projects);
    }
  }, [projects]);

  const formHandler = (event: any) => {};

  return (
    <ProjectUsersListContainer>
      <ThemeProvider theme={defaultMaterialTheme}>
        <StyledTable
          // components={{
          //   Toolbar: (props) => (
          //     <MTableToolbar {...props} style={{ width: "100%" }} sx={{}} />
          //   ),
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
      </ThemeProvider>
      {openFilter && (
        <CustomDrawer open>
          <UsersFilter
            setTaskFilterState={setTaskFilterState}
            taskFilterState={taskFilterState}
            tableData={projects}
            setSearchTableData={setSearchTableData}
            onClose={() => {
              setOpenFilter(false);
            }}
          />
        </CustomDrawer>
      )}
    </ProjectUsersListContainer>
  );
};
