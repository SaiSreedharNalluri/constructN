import React, { useState, useEffect, useRef } from "react";
import {
  ArrowIcon,
  CloseIcon,
  CustomSearchField,
  FunnelIcon,
  Header,
  HeaderActions,
  HeaderImage,
  SearchAreaContainer,
  SearchGlassIcon,
  SearchIconStyling,
  SectionsListContainer,
  StyledTable,
  TableHeader,
  TableWrapper,
  FilterSectionIcon,
} from "./SectionsListingStyles";
import {
  InputAdornment,
  Paper,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import moment from "moment";
import AddBox from "@material-ui/icons/AddBox";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Add from "@material-ui/icons/Add";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import searchIcon from "../../../public/divami_icons/search.svg";
import CustomDrawer from "../custom-drawer/custom-drawer";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";

import phoneImage from "../../../public/divami_icons/phoneImage.svg";
import hotspotImg from "../../../public/divami_icons/hotspotImg.svg";
import videoWalk from "../../../public/divami_icons/videoWalk.svg";
import lidarScan from "../../../public/divami_icons/lidarScan.svg";
import capture360Image from "../../../public/divami_icons/capture360Image.svg";
import captureLidarIcon from "../../../public/divami_icons/captureLidarIcon.svg";
import DroneImage from "../../../public/divami_icons/DroneImage.svg";
import SearchBoxIcon from "../../../public/divami_icons/search.svg";
import CrossIcon from "../../../public/divami_icons/CrossIcon.svg";
import FilterInActive from "../../../public/divami_icons/FilterInActive.svg";
import SearchMag from "../../../public/divami_icons/search.svg";
import UserFilterIcon from "../../../public/divami_icons/UserFilterIcon.svg";
import filterActive from "../../../public/divami_icons/filterActive.svg";

import Image from "next/image";
import { useRouter } from "next/router";
import { getStructureHierarchy } from "../../../services/structure";
import { AxiosResponse } from "axios";
import { ChildrenEntity } from "../../../models/IStructure";
import { getSectionsList } from "../../../services/sections";
import {
  CaptureModeParent,
  CountElem,
  HotspotImgCount,
  LidarScanCount,
  PhoneImgCount,
  SymbolContainer,
  VideoWalkCount,
  CapturesFieldContainer,
  CapturesField,
  CaptureImageIcon,
  CaptureCount,
  FloorName,
} from "../CaptureMode/CaptureModeStyles";
import { forwardRef } from "react";
import SectionFilter from "./SectionFilter";

import MaterialTable, { MTableToolbar } from "material-table";
import CustomButton from "../custom-button/CustomButton";

const dummyData: any = [
  {
    _id: 1,
    name: "Basement",
    issues: 150,
    // tasks: 34,
    // captures: 109,
    // progress: "44%",
    // lastupdated: "Today",
    // imageUrl: <ProgressBar />,
  },
  {
    _id: 2,
    name: "Parking",
    issues: 34,
    // tasks: 12,
    // captures: 50,
    // progress: "44%",
    // lastupdated: "Today",
    // imageUrl: <ProgressBar />,
  },
  {
    _id: 3,
    name: "Electrical Room",
    issues: 12,
    // tasks: 43,
    // captures: 50,
    // progress: "44%",
    // lastupdated: "Today",
    // imageUrl: <ProgressBar />,
  },
  {
    _id: 7,
    name: "Second Floor",
    issues: 554,
    // tasks: 54,
    // captures: 50,
    // progress: "44%",
    // lastupdated: "Today",
    // imageUrl: <ProgressBar />,
  },
];
const tableIcons: any = {
  Add: forwardRef<SVGSVGElement>((props, ref) => (
    <AddBox {...props} ref={ref} />
  )),
  Check: forwardRef<SVGSVGElement>((props, ref) => (
    <Check {...props} ref={ref} />
  )),
  Clear: forwardRef<SVGSVGElement>((props, ref) => (
    <Clear {...props} ref={ref} />
  )),
  Delete: forwardRef<SVGSVGElement>((props, ref) => (
    <DeleteOutline {...props} ref={ref} />
  )),
  DetailPanel: forwardRef<SVGSVGElement>((props, ref) => (
    // console.log("addingtodo", props), (<TestIcon props={props} />)
    <Add {...props} ref={ref} />

    //<TestIcon />
  )),
  Edit: forwardRef<SVGSVGElement>((props, ref) => (
    <Edit {...props} ref={ref} />
  )),
  Export: forwardRef<SVGSVGElement>((props, ref) => (
    <SaveAlt {...props} ref={ref} />
  )),
  Filter: forwardRef<SVGSVGElement>((props, ref) => (
    <FilterList {...props} ref={ref} />
  )),
  FirstPage: forwardRef<SVGSVGElement>((props, ref) => (
    <FirstPage {...props} ref={ref} />
  )),
  LastPage: forwardRef<SVGSVGElement>((props, ref) => (
    <LastPage {...props} ref={ref} />
  )),
  NextPage: forwardRef<SVGSVGElement>((props, ref) => (
    <Add {...props} ref={ref} />
  )),
  PreviousPage: forwardRef<SVGSVGElement>((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef<SVGSVGElement>((props, ref) => (
    <Clear {...props} ref={ref} />
  )),
  Search: forwardRef<SVGSVGElement>((props, ref) => (
    <Search {...props} ref={ref} />
  )),
  SortArrow: forwardRef<SVGSVGElement>((props, ref) => (
    <ArrowDownward {...props} ref={ref} />
  )),
  ThirdStateCheck: forwardRef<SVGSVGElement>((props, ref) => (
    <Remove {...props} ref={ref} />
  )),
  ViewColumn: forwardRef<SVGSVGElement>((props, ref) => (
    <Add {...props} ref={ref} />
  )),
};

const MyNewTitle = (props: any) => {
  return (
    <div
      style={{
        fontFamily: "Open Sans",
        fontStyle: "normal",
        fontWeight: "400",
        fontSize: "18px",
        color: "#101F4C",
      }}
    >
      {props.sections}
    </div>
  );
};
const customToolbarStyle = {
  padding: "10px", // change the padding value as per your requirement
};

const SectionsListing = () => {
  const router = useRouter();
  const myTableRef = useRef<any>(null);
  const defaultMaterialTheme = createTheme();
  const [selectedRow, setSelectedRow] = useState(null);
  const [isSearch, setIsSearch] = useState(false);
  const [searchVal, setIsSearchVal] = useState("");
  const [searchingOn, setSearchingOn] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roles, setRoles] = useState<string[] | []>([]);

  // let [state, setState] = useState<ChildrenEntity[] | any[]>([]);
  const [tableData, setTableData] = useState<any>(
    // { name: 'Zerya Betül', surname: 'Baran', birthYear: 2017, birthCity: 34 },
    []
  );

  const [filterTableData, setFilterTableData] = useState<any>([]);

  let [gridData, setGridData] = useState<any>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [searchTableData, setSearchTableData] = useState([]);
  const formHandler = (event: any) => {
    // setShowEmptyState(true);
  };

  const [taskFilterState, setTaskFilterState] = useState({
    isFilterApplied: false,
    filterData: {
      roleType: [
        { optionTitle: "In Progress", optionStatus: "F" },
        { optionTitle: "Not Started", optionStatus: "F" },
        { optionTitle: "Completed", optionStatus: "F" },
        { optionTitle: "On Hold", optionStatus: "F" },
      ],
    },
    numberOfFilters: 0,
  });

  useEffect(() => {
    if (taskFilterState.numberOfFilters > 0) {
      applySectionFilter(taskFilterState);
    } else {
      setFilterTableData([...tableData]);
      collapseAllRows();
    }
  }, [taskFilterState]);

  useEffect(() => {
    if (router.isReady) {
      getSectionsList(router?.query?.projectId as string)
        .then((response: AxiosResponse<any>) => {
          setGridData([response?.data?.result]);
          let removeGrandParent = response?.data?.result?.children?.map(
            (item: any, index: number) => {
              return {
                ...item,
                parent: null,
              };
            }
          );
          massageTree(removeGrandParent, response?.data?.result?.id);
          //  setTableData([...dummyData]);
        })
        .catch((error) => {});
    }
  }, [router.query.projectId]);

  function massageTree(responseArr: any, grandParent: string) {
    let resultArr: any = [];
    responseArr.map((item: any, index: number) => {
      if (item.parent == null) {
        // parent
        resultArr.push(item);
        if (item.children !== null && item.children.length > 0) {
          // child exists
          item.children.map((child: any, inde: number) => {
            resultArr.push({ ...child, parentId: child.parent });
            if (child.children !== null && child.children.length > 0) {
              helperFunction(child.children, resultArr);
            }
          });
          // function
        }
      } else {
        //
        return item;
      }
    });

    setFilterTableData([...resultArr]);
    setTableData([...resultArr]);
  }

  function helperFunction(childArr: any, resultArr: any) {
    childArr.map((each: any, index: number) => {
      if (each.children !== null && each.children.length > 0) {
        resultArr.push({ ...each, parentId: each.parent });
        helperFunction(each.children, resultArr);
      } else {
        resultArr.push({ ...each, parentId: each.parent });
      }
    });
  }

  // useEffect(() => {
  //   setFilterTableData([...tableData]);
  // }, [tableData]);

  const handleSearchWindow = () => {
    //   setFilterTableData(tableData);
    if (searchTerm === "") {
      setIsSearching(!isSearching);
      setSearchingOn(!searchingOn);
    } else {
      setSearchTerm("");
    }
  };

  useEffect(() => {
    handleSearch();
  }, [searchTerm]);

  const handleSearch = () => {
    if (searchTerm.length) {
      const newTableData = tableData.filter((item: any) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      const tableWithParentData: any[] = [];
      newTableData.forEach((item: any) => {
        if (item.parent !== null && item.parent.length > 0) {
          let parentItem = tableData.find(
            (ele: any) => ele._id === item.parent
          );

          tableWithParentData.push(parentItem);
        }
      });
      setFilterTableData([
        ...newTableData,
        ...tableWithParentData.filter(
          (item, index) => tableWithParentData.indexOf(item) === index
        ),
      ]);

      //   myTableRef.onTreeExpandChanged();
      expandAllRows();
    } else {
      setFilterTableData([...tableData]);
      collapseAllRows();
    }
  };

  const applySectionFilter = (filters: any) => {
    let status = filters?.filterData?.roleType
      .filter((ele: any, index: number) => ele.optionStatus === "T")
      .map((item: any) => item.optionTitle);
    let tempData = [...tableData];
    if (status.length > 0) {
      const newArr = [
        ...tempData.filter((item: any) => status.includes(item.status)),
      ];
      tempData = [...newArr];
    }
    if (
      filters?.filterData &&
      filters?.filterData?.fromDate &&
      filters?.filterData?.fromDate.length > 0
    ) {
      const newArr = [
        ...tempData.filter((item: any) => {
          // if (isValidDate(item.lastUpdated)) {
          //   return false;
          // }

          let fromDateOnly = new Date(filters?.filterData?.fromDate).getTime();
          let lastUpdateDateOnly = new Date(item.lastUpdated).getTime();
          if (lastUpdateDateOnly >= fromDateOnly) {
            return true;
          } else {
            return false;
          }
        }),
      ];
      tempData = [...newArr];
    }

    if (
      filters?.filterData &&
      filters?.filterData.toDate &&
      filters?.filterData?.toDate.length > 0
    ) {
      const newArr = [
        ...tempData.filter((item: any) => {
          if (isValidDate(item.lastUpdated)) {
            return false;
          }
          let toDateOnly = new Date(filters?.filterData?.toDate).getTime();
          let lastUpdateDateOnly = new Date(item.lastUpdated).getTime();
          if (lastUpdateDateOnly <= toDateOnly) {
            return true;
          } else {
            return false;
          }
        }),
      ];
      tempData = [...newArr];
    }
    const tableWithParentData: any[] = [];
    tempData.forEach((item: any) => {
      if (item.parent !== null && item.parent.length > 0) {
        let parentItem = tableData.find((ele: any) => ele._id === item.parent);

        tableWithParentData.push(parentItem);
      }
    });
    setFilterTableData([
      ...tempData,
      ...tableWithParentData.filter(
        (item, index) => tableWithParentData.indexOf(item) === index
      ),
    ]);
  };

  function isValidDate(dateString: string): boolean {
    const date = new Date(dateString);

    return !isNaN(date as any);
  }

  const expandAllRows = () => {
    if (myTableRef.current) {
      const tableData = myTableRef.current.dataManager.data;

      tableData.forEach((row: any) => {
        row.tableData.isTreeExpanded = true;
      });

      myTableRef.current.setState((prevState: any) => ({
        ...prevState,
        data: tableData,
      }));
    }
  };

  const collapseAllRows = () => {
    if (myTableRef.current) {
      const tableData = myTableRef.current.dataManager.data;

      tableData.forEach((row: any) => {
        row.tableData.isTreeExpanded = false;
      });

      myTableRef.current.setState((prevState: any) => ({
        ...prevState,
        data: tableData,
      }));
    }
  };

  const columns = [
    {
      title: "Section Name",
      field: "name",
      sorting: false,
      filtering: false,
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
      render: (rowData: any) => {
        // router.push(`/projects/${id}/sections`);
        return (
          <FloorName
            onClick={() => {
              router.push({
                pathname: `/projects/${rowData.project as string}/structure`,
                query: { structId: rowData._id },
              });
            }}
          >
            {rowData?.name}
          </FloorName>
        );
      },
    },
    {
      title: "Issues",
      field: "issueCount",
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
      cellStyle: { width: "10%" },
    },
    {
      title: "Tasks",
      field: "taskCount",
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
      cellStyle: { width: "10%" },
    },
    {
      title: "Captures",
      field: "captures",
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
      render: (rowData: any) => {
        return (
          <CapturesFieldContainer>
            <CapturesField>
              <CaptureImageIcon
                // src={capture360Image}
                src={phoneImage}
                alt={""}
                // width={13}
                // height={13}
              />
              <CaptureCount>
                {" "}
                {/* {rowData.capture360Count?.length > 1
                  ? rowData.capture360Count
                  : `0${rowData.capture360Count}`} */}
                {rowData.capture && rowData.capture["Phone Image"]
                  ? rowData.capture["Phone Image"]
                  : 0}
              </CaptureCount>
            </CapturesField>
            <CapturesField>
              <CaptureImageIcon
                // src={videoWalk}
                src={capture360Image}
                alt={""}
                // width={16}
                // height={16}
              />
              {/* 360 Video */}
              <CaptureCount>
                {rowData.capture && rowData.capture["360 Image"]
                  ? rowData.capture["360 Image"]
                  : 0}
              </CaptureCount>
            </CapturesField>
            <CapturesField>
              <CaptureImageIcon
                src={videoWalk}
                alt={""}
                // width={15}
                // height={15}
              />
              <CaptureCount>
                {/* {rowData.capturePhoneCount?.length > 1
                  ? rowData.capturePhoneCount
                  : `0${rowData.capturePhoneCount}`}
                   */}

                {rowData.capture && rowData.capture["360 Video"]
                  ? rowData.capture["360 Video"]
                  : 0}
              </CaptureCount>
            </CapturesField>
            <CapturesField>
              <CaptureImageIcon
                src={captureLidarIcon}
                alt={""}
                // width={14}
                // height={14}
              />
              <CaptureCount>0</CaptureCount>
            </CapturesField>
            <CapturesField>
              <CaptureImageIcon
                src={DroneImage}
                alt={""}
                // width={13}
                // height={13}
              ></CaptureImageIcon>
              <CaptureCount>
                {rowData.capture && rowData.capture["Drone Image"]
                  ? rowData.capture["Drone Image"]
                  : 0}
              </CaptureCount>
            </CapturesField>
          </CapturesFieldContainer>
        );
      },
      sorting: false,
    },
    // {
    //   title: "Status & Progress",
    //   field: "progress",
    //   sorting: true,

    //   render: (rowData: any) => <ProgressBar />,
    //   headerStyle: {
    //     borderBottom: "1px solid #FF843F",
    //     fontFamily: "Open Sans",
    //     fontStyle: "normal",
    //     fontWeight: "500",
    //     fontSize: "14px",
    //     lineHeight: "20px",
    //     color: "#101F4C",
    //   },
    //   cellStyle: { width: "18%" },
    //   // sorting: true,
    // },
    {
      title: "Last Updated",
      field: "lastupdated",
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
        return <>{moment(rowData.lastUpdated).format("DD MMM YYYY")}</>;
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

  return (
    <div style={{ overflow: "scroll" }} className="sections_table">
      <TableHeader>
        <Header>Sections</Header>
        <HeaderActions>
          {searchingOn ? (
            <SearchAreaContainer>
              <CustomSearchField
                placeholder="Search"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
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
            <>
              <SearchGlassIcon
                src={SearchMag}
                data-testid="search-icon"
                alt={"close icon"}
                onClick={() => setSearchingOn((prev) => !prev)}
              />
            </>
          )}

          <FilterSectionIcon
            src={
              taskFilterState.numberOfFilters <= 0
                ? UserFilterIcon
                : filterActive
            }
            // src={FilterInActive}
            data-testid="filter-icon"
            alt={"close icon"}
            onClick={() => setOpenFilter(!openFilter)}
          />
        </HeaderActions>
      </TableHeader>

      <SectionsListContainer>
        {/* <h1>React Table</h1> */}
        <ThemeProvider theme={defaultMaterialTheme}>
          <TableWrapper>
            <StyledTable
              tableRef={myTableRef}
              // icons={tableIcons.Search}
              // components={{
              //   Toolbar: (props) => <MTableToolbar {...props} />,
              // }}
              components={{
                Container: (props) => <Paper {...props} elevation={0} />,
              }}
              columns={columns}
              data={filterTableData ? filterTableData : []}
              // title={<MyNewTitle sections="Sections" />}
              title={""}
              //onSearchChange={setIsSearchVal}

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
              icons={tableIcons}
              // detailPanel={[
              //   { icon: tableIcons.Add, tooltip: "Show Surname" },
              // ]}
              // parentChildData={(row: any, rows: any) =>
              //   rows.find((a: any) => a.id === row.parentId)
              // }

              parentChildData={(row: any, rows) =>
                rows.find((a: any) => a._id === row.parentId)
              }
            />

            {/* <BasicTreeData/> */}
          </TableWrapper>
        </ThemeProvider>
      </SectionsListContainer>

      {openFilter && (
        <CustomDrawer open>
          <SectionFilter
            setTaskFilterState={setTaskFilterState}
            taskFilterState={taskFilterState}
            tableData={tableData}
            setSearchTableData={setSearchTableData}
            roles={["In Progress", "Not Started", "Completed", "On Hold"]}
            onClose={() => {
              setOpenFilter(false);
            }}
          />
        </CustomDrawer>
      )}
    </div>
  );
};

export default SectionsListing;
