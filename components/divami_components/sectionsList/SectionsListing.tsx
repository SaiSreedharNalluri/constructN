import React, { useState, useEffect, useRef } from "react";
import { IconButton } from "@material-ui/core";
import { KeyboardArrowDown, KeyboardArrowUp } from "@material-ui/icons";
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
import crossIcon from "../../../public/divami_icons/crossIcon.svg";
import FilterInActive from "../../../public/divami_icons/FilterInActive.svg";
import SearchMag from "../../../public/divami_icons/search.svg";
import UserFilterIcon from "../../../public/divami_icons/UserFilterIcon.svg";
import filterActive from "../../../public/divami_icons/filterActive.svg";
import info from "../../../public/divami_icons/infoIcon.svg"

import projectHierIcon from "../../../public/divami_icons/projectHierIcon.svg";

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

import MaterialTable, { MTableToolbar, MTableBodyRow } from "material-table";
import CustomButton from "../custom-button/CustomButton";
import { SvgIconProps } from "@material-ui/core";
import CustomLoader from "../custom_loader/CustomLoader";
import LocalSearch from "../local_component/LocalSearch";
import { TooltipText } from "../side-panel/SidePanelStyles";
import PopupComponent from "../../popupComponent/PopupComponent";
import { setTheFormatedDate } from "../../../utils/ViewerDataUtils";
import Chips from "./Chip";
// import { ISections } from "../../../models/ISections";

interface RowData {
  tableData: { id: number };
}

interface ExpandedRows {
  [id: number]: boolean;
}

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
  // const [showLoader, setShowLoader]: any = useState(true);

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
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  const formHandler = (event: any) => {
    // setShowEmptyState(true);
  };
const[isCaptureAvailable,setCaptureAvailable]=useState(false);
const[isProcessing,setProcessing]=useState(false);
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

  const tableIcons = {
    Add: forwardRef<SVGSVGElement, SvgIconProps>((props, ref) => (
      <AddBox {...props} ref={ref} />
    )),
    Check: forwardRef<SVGSVGElement, SvgIconProps>((props, ref) => (
      <Check {...props} ref={ref} />
    )),
    Clear: forwardRef<SVGSVGElement>((props, ref) => (
      <Clear {...props} ref={ref} />
    )),
    Delete: forwardRef<SVGSVGElement>((props, ref) => (
      <DeleteOutline {...props} ref={ref} />
    )),
    DetailPanel: forwardRef<SVGSVGElement, SvgIconProps>((props, ref) => {
      // console.log("addingtodo", props), (<TestIcon props={props} />)

      return <ChevronRight {...props} ref={ref} />;

      //<TestIcon />
    }),

    // DetailPanel: (props: { rowData: RowData }, ref) => {
    //   const isExpanded = expandedRows[props.rowData.tableData.id];
    //   return <DeleteOutline {...props} />;
    // },
    //   DetailPanel: (props: any) => <DeleteOutline {...props} />,
    Edit: forwardRef<SVGSVGElement, SvgIconProps>((props, ref) => (
      <Edit {...props} ref={ref} />
    )),
    Export: forwardRef<SVGSVGElement, SvgIconProps>((props, ref) => (
      <SaveAlt {...props} ref={ref} />
    )),
    Filter: forwardRef<SVGSVGElement, SvgIconProps>((props, ref) => (
      <FilterList {...props} ref={ref} />
    )),
    FirstPage: forwardRef<SVGSVGElement, SvgIconProps>((props, ref) => (
      <FirstPage {...props} ref={ref} />
    )),
    LastPage: forwardRef<SVGSVGElement, SvgIconProps>((props, ref) => (
      <LastPage {...props} ref={ref} />
    )),
    NextPage: forwardRef<SVGSVGElement, SvgIconProps>((props, ref) => (
      <Add {...props} ref={ref} />
    )),
    PreviousPage: forwardRef<SVGSVGElement, SvgIconProps>((props, ref) => (
      <ChevronLeft {...props} ref={ref} />
    )),
    ResetSearch: forwardRef<SVGSVGElement, SvgIconProps>((props, ref) => (
      <Clear {...props} ref={ref} />
    )),
    Search: forwardRef<SVGSVGElement, SvgIconProps>((props, ref) => (
      <Search {...props} ref={ref} />
    )),
    SortArrow: forwardRef<SVGSVGElement, SvgIconProps>((props, ref) => (
      <ArrowDownward {...props} ref={ref} />
    )),
    ThirdStateCheck: forwardRef<SVGSVGElement, SvgIconProps>((props, ref) => (
      <Remove {...props} ref={ref} />
    )),
    ViewColumn: forwardRef<SVGSVGElement, SvgIconProps>((props, ref) => (
      <Add {...props} ref={ref} />
    )),
  };

  useEffect(() => {
    if (router.isReady &&(!dataLoaded)) {
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

          massageTree(
            removeGrandParent,
            response?.data?.result?.id,
            response?.data?.result
          );

          // setShowLoader(false);
          setDataLoaded(true);
        })
        .catch((error) => {
          setDataLoaded(true)
        });
    }
  }, [router.query.projectId]);

  const localizationOptions = {
    body: {
      emptyDataSourceMessage: <LocalSearch />,
    },
  };

  function massageTree(
    responseArr: any,
    grandParent: string,
    responseObj: any
  ) {
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

    let finalTableData = [
      { ...responseObj, parent: null },
      ...resultArr.map((item: any) => {
        if (item.parentId == null) {
          // here add parent adani
          return { ...item, parentId: responseObj["_id"] };
        } else {
          return item;
        }
      }),
    ];

    setFilterTableData([...finalTableData]);
    setTableData([...finalTableData]);

    // test();
  }

  React.useEffect(() => {
    expandFirstRow();
    //  expandAllRows();
  }, [tableData]);

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

  const expandFirstRow = () => {
    if (myTableRef.current) {
      const tableData = myTableRef.current.dataManager.data;

      tableData[0].tableData.isTreeExpanded = true;
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
const[id,setId]=useState("");
const TruncatedString = ({ text, maxLength, suffixLength }: any) => {
  let truncatedText = text;

  if (text.length > maxLength) {
    const prefix = text.substring(0, maxLength - suffixLength);
    const suffix = text.substring(text.length - suffixLength);
    truncatedText = prefix + "..." + suffix;
  }

  return truncatedText;
};
  const columns = [
    {
      title: "View Name",
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
        cursor:"default"
      },
      cellStyle: { width: "28%" },
      render: (rowData: any) => {
        // router.push(`/projects/${id}/sections`);
        
        return (
<div>
        <div className="flex items-center justify-between">  
        <div className="cursor-pointer"     
          onClick={() => {
            if(rowData?.designs.length!==0&& Object.keys(rowData.snapshots?.latestSnapshot).length <= 0) {
              setId(rowData._id);
              setCaptureAvailable(true)
             }
             else if(rowData?.designs.length!==0&&Object.keys(rowData.snapshots?.latestSnapshot).length >0 && rowData.snapshots?.snapshotActiveCount<1) {
              setId(rowData._id);
              setProcessing(true)
             }
           else if (Object.keys(rowData.snapshots?.latestSnapshot).length >= 0 && rowData.snapshots?.snapshotActiveCount>0 ) {
              router.push({
                pathname: `/projects/${router?.query?.projectId as string}/structure`,
                query: { structId: rowData._id },
              });
              setCaptureAvailable(false)
              setProcessing(false)
            }
          }}> 
                <TooltipText title={rowData?.name?.length > 40 ? rowData?.name : ""} placement="right">
      <div>
      <TruncatedString text={rowData?.name} maxLength={40}
              suffixLength={0} ></TruncatedString> 
        </div> 
        </TooltipText>
          </div>  
       {Object.keys(rowData.snapshots?.latestSnapshot).length > 0 && rowData.snapshots?.latestSnapshot?.state === "Active" &&    (new Date().getTime() - new Date(rowData.snapshots.latestSnapshot.captureDateTime).getTime())/86400000 < 3 && rowData?.snapshots?.snapshotActiveCount >0
    ?<Chips isChip={true}  title="New" bgColor="#8BD97F"></Chips>      
     :rowData?.designs.length===0 
    ? <Chips isChip={true} title="No Designs" bgColor="#F67C74"></Chips>
    :rowData.snapshots && rowData?.designs.length>0 && Object.keys(rowData.snapshots?.latestSnapshot).length < 1
    ? <Chips isChip={true}  title="No Captures" bgColor="#C24200" ></Chips>  
    :  rowData?.designs.length!==0&&Object.keys(rowData.snapshots?.latestSnapshot).length > 0 && rowData.snapshots?.latestSnapshot?rowData.snapshots?.latestSnapshot?.state !== "Active"
    ? <Chips isChip={true}  title="Processing" bgColor="#006CD0" captureTime={true}></Chips> 
    : "":""}
          </div>
    
          </div>
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
      cellStyle: { width: "8%" },
      render: (rowData: any) => {
        return <div className="cursor-default">{rowData?.issueCount ? rowData.issueCount : "-"}</div>;
      },
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
      cellStyle: { width: "8%" },

      render: (rowData: any) => {
        return <div className="cursor-default">{rowData?.taskCount ? rowData.taskCount : "-"}</div>;
      },
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
      cellStyle: { width: "24%" },
      render: (rowData: any) => {
        return (
          <CapturesFieldContainer>
            <CapturesField>
              <TooltipText title="Phone Image">
                <div>
                  <CaptureImageIcon
                    // src={capture360Image}
                    src={phoneImage}
                    alt={""}
                    // width={13}
                    // height={13}
                  />
                </div>
              </TooltipText>
              <CaptureCount>
                {" "}
                {/* {rowData.capture360Count?.length > 1
                  ? rowData.capture360Count
                  : `0${rowData.capture360Count}`} */}
                {rowData.capture && rowData.capture["Phone Image"]
                  ? rowData.capture["Phone Image"]
                  : "-"}
              </CaptureCount>
            </CapturesField>
            <CapturesField>
              <TooltipText title="360 Image">
                <div>
                  <CaptureImageIcon
                    // src={videoWalk}
                    src={capture360Image}
                    alt={""}
                  />
                </div>
              </TooltipText>
              {/* 360 Video */}
              <CaptureCount>
                {rowData.capture && rowData.capture["360 Image"]
                  ? rowData.capture["360 Image"]
                  : "-"}
              </CaptureCount>
            </CapturesField>
            <CapturesField>
              <TooltipText title="360° Video Walk">
                <div>
                  <CaptureImageIcon
                    src={videoWalk}
                    alt={""}
                    // width={15}
                    // height={15}
                  />
                </div>
              </TooltipText>
              <CaptureCount>
                {/* {rowData.capturePhoneCount?.length > 1
                  ? rowData.capturePhoneCount
                  : `0${rowData.capturePhoneCount}`}
                   */}

                {rowData.capture && rowData.capture["360 Video"]
                  ? rowData.capture["360 Video"]
                  : "-"}
              </CaptureCount>
            </CapturesField>
            {/* <CapturesField>
              <TooltipText title="Phone Video Walk">
                <div>
                  <CaptureImageIcon src={captureLidarIcon} alt={""} />
                </div>
              </TooltipText>

              <CaptureCount>-</CaptureCount>
            </CapturesField> */}
            <CapturesField>
              <TooltipText title="Drone Image">
                <div>
                  <CaptureImageIcon
                    src={DroneImage}
                    alt={""}
                    // width={13}
                    // height={13}
                  ></CaptureImageIcon>
                </div>
              </TooltipText>
              <CaptureCount>
                {rowData.capture && rowData.capture["Drone Image"]
                  ? rowData.capture["Drone Image"]
                  : "-"}
              </CaptureCount>
            </CapturesField>
          </CapturesFieldContainer>
        );
      },
      sorting: false,
    },

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
      cellStyle: { width: "24%" },
   
      render: (rowData: any) => {
        return <div className="cursor-default">{
          rowData?.lastUpdated ?
          setTheFormatedDate(rowData.lastUpdated)
          : "-"
          }</div>;
      },
    },
  ];


  return (
    <div style={{ overflow: "scroll" }} className="sections_table">
      <TableHeader>
        <Header>Views </Header>
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
                        src={crossIcon}
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

          {/* <FilterSectionIcon
            src={
              taskFilterState.numberOfFilters <= 0
                ? UserFilterIcon
                : filterActive
            }
            // src={FilterInActive}
            data-testid="filter-icon"
            alt={"close icon"}
            onClick={() => setOpenFilter(!openFilter)}
          /> */}
        </HeaderActions>
      </TableHeader>

      <SectionsListContainer>
        {/* <h1>React Table</h1> */}
        <ThemeProvider theme={defaultMaterialTheme}>
          <TableWrapper>
            {dataLoaded ? (
              <StyledTable
                tableRef={myTableRef}
                components={{
                  Container: (props) => <Paper {...props} elevation={0} />,
                  Row:(props)=>{
                    const rowData = props.data;
                    
                    const isZeroCapture =  rowData?.snapshots && rowData?.designs?.length>0 && Object.keys(rowData?.snapshots?.latestSnapshot).length <= 0;
                    const isZeroDesign= Object.keys(rowData?.snapshots?.latestSnapshot).length >=0 && rowData?.snapshots?.snapshotActiveCount <1;

                    
                    // const isProcessing=rowData?.designs.length!==0&&Object.keys(rowData.snapshots?.latestSnapshot).length !== 0 && rowData.snapshots?.latestSnapshot?.state !== "Active" 
                    return (
                        
        <MTableBodyRow
          {...props}
          className={isZeroCapture || isZeroDesign?"bg-[#E7E7E7] ":""}
        />
       
      );
    
                  }
                }}
                localization={localizationOptions}
                columns={columns}
                data={filterTableData ? filterTableData : []}
                title={""}
                options={{
                  search: false,

                  paging: false,
                  exportButton: false,
                  exportFileName: "tableData",
                  selection: false,
                  showTitle: true,
                  toolbar: false,
                  // maxBodyHeight: "75vh",
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
                parentChildData={(row: any, rows) =>
                  rows.find((a: any) => a._id === row.parentId)
                }
              />
            ) : (
              <CustomLoader />
            )}

            {/* {showLoader && <CustomLoader />} */}

            {/* <BasicTreeData/> */}
          </TableWrapper>
        </ThemeProvider>
      </SectionsListContainer>

      {openFilter && (
        <CustomDrawer variant="persistent" open>
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
      {
        isCaptureAvailable || isProcessing ?(
          <PopupComponent
          open={isCaptureAvailable?isCaptureAvailable:isProcessing}
          setShowPopUp={isCaptureAvailable?setCaptureAvailable:setProcessing}
          modalTitle={isCaptureAvailable?"No Capture Available":"Processing"}
          modalmessage={isCaptureAvailable?`Do you want to view the design?`: `Do you want to view the design?`}
          primaryButtonLabel={isCaptureAvailable?"View Design":"View Design"}
          imageSrc={info}
          isImageThere={true}
          SecondaryButtonlabel={"No"}
          callBackvalue={isCaptureAvailable? ()=> router.push({
            pathname: `/projects/${router?.query?.projectId as string}/structure`,
            query: { structId: id },
          }):()=> router.push({
            pathname: `/projects/${router?.query?.projectId as string}/structure`,
            query: { structId: id },
          }) }
        />
        )
      :""}
    </div>
  );
};

export default SectionsListing;
