import React, { useEffect, useState } from "react";

import Header from "../../../../components/divami_components/header/Header";
import SidePanelMenu from "../../../../components/divami_components/side-panel/SidePanel";
import logo from "./logo.svg";
import ReactDOM from "react-dom";
import MaterialTable, { MTableToolbar } from "material-table";

import {
  InputAdornment,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
// import "./App.css";
// import BasicTreeData from "./components/Tree";
import ProgressBar from "../../../../components/divami_components/ProgressBarMode/ProgressBar";
// import ProgressBar from "./components/progressBar/ProgressBar";
// import CaptureMode from "./components/CaptureMode/CaptureMode";
import AddBox from "@material-ui/icons/AddBox";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Add from "@material-ui/icons/Add";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";

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
import { forwardRef } from "react";
import CaptureMode from "../../../../components/divami_components/CaptureMode/CaptureMode";
import { useTheme } from "@material-ui/core/styles";
import searchTable from "../../../../public/divami_icons/searchTable.svg";
import filterTable from "../../../../public/divami_icons/filterTable.svg";
import SearchBoxIcon from "../../../../public/divami_icons/search.svg";
import CrossIcon from "../../../../public/divami_icons/crossIcon.svg";
import SearchMag from "../../../../public/divami_icons/search.svg";
import FilterInActive from "../../../../public/divami_icons/filterInactive.svg";
import phoneImage from "../../../../public/divami_icons/phoneImage.svg";
import hotspotImg from "../../../../public/divami_icons/hotspotImg.svg";
import videoWalk from "../../../../public/divami_icons/videoWalk.svg";
import lidarScan from "../../../../public/divami_icons/lidarScan.svg";
import capture360Image from "../../../../public/divami_icons/capture360Image.svg";
import captureLidarIcon from "../../../../public/divami_icons/captureLidarIcon.svg";
import DroneImage from "../../../../public/divami_icons/DroneImage.svg";

import {
  ArrowIcon,
  CloseIcon,
  Content,
  CustomSearchField,
  FunnelIcon,
  SearchAreaContainer,
  SearchGlassIcon,
  SearchIconStyling,
  SectionsListContainer,
} from "./SectionsStyles";
import Image from "next/image";
import { useRouter } from "next/router";
import { getStructureHierarchy } from "../../../../services/structure";
import { AxiosResponse } from "axios";
import { ChildrenEntity } from "../../../../models/IStructure";
import { getSectionsList } from "../../../../services/sections";
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
} from "../../../../components/divami_components/CaptureMode/CaptureModeStyles";
import moment from "moment";
import SectionsListing from "../../../../components/divami_components/sectionsList/SectionsListing";

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

const MyNewTitle = (props: any) => {
  console.log("MyNewTitle", props);
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

const Index: React.FC = () => {
  const router = useRouter();

  const defaultMaterialTheme = createTheme();
  const [selectedRow, setSelectedRow] = useState(null);
  const [isSearch, setIsSearch] = useState(false);
  const [searchVal, setIsSearchVal] = useState("");
  const [searchingOn, setSearchingOn] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  // let [state, setState] = useState<ChildrenEntity[] | any[]>([]);
  const [tableData, setTableData] = useState<any>(
    // { name: 'Zerya Betül', surname: 'Baran', birthYear: 2017, birthCity: 34 },
    []
  );

  const [filterTableData, setFilterTableData] = useState<any>([]);

  let [gridData, setGridData] = useState<any>([]);

  // useEffect(() => {
  //   handleSearch();
  // }, [searchTerm]);

  // https://api.dev2.constructn.ai/api/v1/projects/PRJ201897/structures/hierarchy

  useEffect(() => {
    console.log("griddata", gridData);
  }, [gridData]);

  useEffect(() => {
    console.log("filterTableData", filterTableData);
  }, [filterTableData]);

  useEffect(() => {
    console.log("router?.query?.projectId", router);

    if (router.isReady) {
      // if (router.query.structId !== undefined)
      // setSelector(router.query.structId.toString());
      // getStructureHierarchy(router?.query?.projectId as string)
      //   .then((response: AxiosResponse<any>) => {
      //     console.log("respjali", response);
      //     setGridData([...response?.data?.result]);
      //     let removeGrandParent = response?.data?.result[0]?.children?.map(
      //       (item: any, index: number) => {
      //         return {
      //           ...item,
      //           parent: null,
      //         };
      //       }
      //     );
      //     console.log("removeGrandParent", removeGrandParent);
      //     massageTree(removeGrandParent, response?.data?.result[0]?.id);
      //     setTableData([...dummyData]);
      //     console.log("secondcall", response?.data?.result[0]?.children);
      //   })
      //   .catch((error) => {
      //     console.log("error", error);
      //   });
      getSectionsList(router?.query?.projectId as string)
        .then((response: AxiosResponse<any>) => {
          console.log("respjali", response);
          setGridData([response?.data?.result]);
          let removeGrandParent = response?.data?.result?.children?.map(
            (item: any, index: number) => {
              return {
                ...item,
                parent: null,
              };
            }
          );
          console.log("removeGrandParent", removeGrandParent);
          massageTree(removeGrandParent, response?.data?.result?.id);
          setTableData([...dummyData]);
          console.log("secondcall", response?.data?.result[0]?.children);
        })
        .catch((error) => {
          console.log("error", error);
        });
      // getSectionsList(router?.query?.projectId as string)
      //   .then((response: AxiosResponse<any>) => {
      //     setGridData([...response?.data?.result]);
      //     let removeGrandParent = response?.data?.result[0]?.children?.map(
      //       (item: any, index: number) => {
      //         return {
      //           ...item,
      //           parent: null,
      //         };
      //       }
      //     );
      //     console.log("removeparent", removeGrandParent);
      //     massageTree(removeGrandParent, response?.data?.result[0]?.id);
      //     setTableData([...dummyData]);
      //     console.log("secondcall", response?.data?.result[0]?.children);
      //   })
      //   .catch((error) => {
      //     console.log("error", error);
      //   });
    }
  }, [router.query.projectId]);

  function massageTree(responseArr: any, grandParent: string) {
    console.log("responseArr", responseArr);
    console.log("grandParent", grandParent);

    let resultArr: any = [];
    console.log("FLAG 1", responseArr, grandParent);
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

    console.log("MASSAGED", resultArr);
    setFilterTableData([...resultArr]);
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
  //   console.log("Robby", tableData);
  //   setFilterTableData([...tableData]);
  // }, [tableData]);

  const handleSearchWindow = () => {
    if (searchTerm === "") {
      setSearchingOn(!searchingOn);
    } else {
      setSearchTerm("");
    }
  };

  const handleSearch = () => {
    console.log("TEST");
    // if (searchTerm.length) {
    //   const newTableData = tableData.filter((item: any) =>
    //     item.name.toLowerCase().includes(searchTerm.toLowerCase())
    //   );
    //   setFilterTableData(newTableData);
    // } else {
    //   setFilterTableData([...dummyData]);
    // }
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
        console.log("rowData", rowData);
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
                {rowData.capture["Phone Image"]
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
                {rowData.capture["360 Image"]
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

                {rowData.capture["360 Video"]
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
                {rowData.capture["Drone Image"]
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
        return <>{moment(rowData.updatedAt).format("DD MMM YYYY")}</>;
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
  const breadCrumbsData = [{ label: "Manage Users" }];

  const [isFullScreen, setIsFullScreen] = useState(false);

  return (
    // <React.Fragment>
    //   <div>
    //     <div>
    //       <Header />
    //       <div className="flex w-screen fixed">
    //         <div>
    //           <Content>
    //             <SidePanelMenu onChangeData={() => {}} />
    //             <SectionsListing />
    //           </Content>
    //         </div>
    //         <div></div>
    //       </div>
    //     </div>
    //   </div>
    // </React.Fragment>
    <div className=" w-full  h-full">
      <div className="w-full">
        {!isFullScreen && (
          <Header
            showBreadcrumbs
            breadCrumbData={breadCrumbsData}
            fromUsersList
          />
        )}

        {/* <Header breadCrumb={getBreadCrumbs()}></Header> */}
      </div>
      <Content>
        <SidePanelMenu onChangeData={() => {}} />
        {/* <SidePanelMenuContainer onChangeData={() => {}} /> */}
        <SectionsListing />
      </Content>
    </div>
  );
};

export default Index;
