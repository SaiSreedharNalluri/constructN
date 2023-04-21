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
import TestIcon from "./test_icon";
import { useTheme } from "@material-ui/core/styles";
import searchTable from "../../../../public/divami_icons/searchTable.svg";
import filterTable from "../../../../public/divami_icons/filterTable.svg";
import SearchBoxIcon from "../../../../public/divami_icons/search.svg";
import CrossIcon from "../../../../public/divami_icons/crossIcon.svg";
import SearchMag from "../../../../public/divami_icons/search.svg";
import FilterInActive from "../../../../public/divami_icons/filterInactive.svg";

import {
  ArrowIcon,
  CloseIcon,
  CustomSearchField,
  FunnelIcon,
  SearchAreaContainer,
  SearchGlassIcon,
  SearchIconStyling,
} from "./SectionsStyles";
import Image from "next/image";
import { useRouter } from "next/router";
import { getStructureHierarchy } from "../../../../services/structure";
import { AxiosResponse } from "axios";
import { ChildrenEntity } from "../../../../models/IStructure";

const dummyData: any = [
  {
    _id: 1,
    name: "Basement",
    // issues: 150,
    // tasks: 34,
    // captures: 109,
    // progress: "44%",
    // lastupdated: "Today",
    // imageUrl: <ProgressBar />,
  },
  {
    _id: 2,
    name: "Parking",
    // issues: 34,
    // tasks: 12,
    // captures: 50,
    // progress: "44%",
    // lastupdated: "Today",
    // imageUrl: <ProgressBar />,
  },
  {
    _id: 3,
    name: "Electrical Room",
    // issues: 12,
    // tasks: 43,
    // captures: 50,
    // progress: "44%",
    // lastupdated: "Today",
    // imageUrl: <ProgressBar />,
  },
  {
    _id: 7,
    name: "Second Floor",
    // issues: 554,
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
    if (router.isReady) {
      // if (router.query.structId !== undefined)
      console.log("Karan");
      // setSelector(router.query.structId.toString());
      getStructureHierarchy(router.query.projectId as string)
        .then((response: AxiosResponse<any>) => {
          setGridData([...response.data.result]);
          let removeGrandParent = response.data.result[0].children.map(
            (item: any, index: number) => {
              return {
                ...item,
                parent: null,
              };
            }
          );
          massageTree(removeGrandParent, response.data.result[0].id);
          setTableData([...dummyData]);
          //   setFilterTableData([...response.data.result[0].children]);

          console.log("Karan", response.data.result[0].children);
          // if (selector.length < 1) setSelector(response.data.result[0]._id);
        })
        .catch((error) => {
          console.log("error", error);
        });
    }
  }, []);

  function massageTree(responseArr: any, grandParent: string) {
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

  // const handleSearchWindow = () => {
  //   if (searchTerm === "") {
  //     setSearchingOn(!searchingOn);
  //   } else {
  //     setSearchTerm("");
  //   }
  // };

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
      field: "issues",
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
      field: "tasks",
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
      render: (rowData: any) => <CaptureMode />,
      sorting: false,
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
    },
    {
      title: "Status & Progress",
      field: "progress",
      sorting: true,

      render: (rowData: any) => <ProgressBar />,
      headerStyle: {
        borderBottom: "1px solid #FF843F",
        fontFamily: "Open Sans",
        fontStyle: "normal",
        fontWeight: "500",
        fontSize: "14px",
        lineHeight: "20px",
        color: "#101F4C",
      },
      cellStyle: { width: "18%" },
      // sorting: true,
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
    <React.Fragment>
      <div>
        <div>
          <Header />
          <div className="flex w-screen fixed">
            <div>
              {/* <CollapsableMenu onChangeData={() => {}} /> */}
              <SidePanelMenu onChangeData={() => {}} />
            </div>
            <div className="sections_table">
              <SearchIconStyling>
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
                              // onClick={() => {
                              //   // handleSearchWindow();
                              // }}
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
              </SearchIconStyling>

              <FunnelIcon
                src={FilterInActive}
                alt="Arrow"
                data-testid="filter"
              />

              {/* <ArrowIcon
                src={searchTable}
                alt="search"
                onClick={() => {
                  setIsSearch(true);
                }}
              /> */}
              <div>
                {/* <h1>React Table</h1> */}
                <ThemeProvider theme={defaultMaterialTheme}>
                  <MaterialTable
                    // icons={tableIcons.Search}
                    components={{
                      Toolbar: (props) => (
                        <div className="balu">
                          <MTableToolbar {...props} />
                        </div>
                      ),
                    }}
                    columns={columns}
                    data={filterTableData ? filterTableData : []}
                    title={<MyNewTitle sections="Sections" />}
                    //onSearchChange={setIsSearchVal}
                    options={{
                      sorting: true,
                      thirdSortClick: false,
                      // searchFieldStyle: {
                      //   width: 100,
                      // },

                      // searchFieldVariant: "outlined",
                      // filtering: true,
                      // searchText: searchVal,
                      search: false,
                      paging: false,
                      // pageSizeOptions: [5, 10, 20, 25, 50, 100],

                      // by default it should give 5 rows
                      // pageSize: 5,
                      // paginationType:"stepped",
                      // showFirstLastPageButtons
                      // paginationPosition

                      exportButton: false,
                      maxBodyHeight: 500,
                      // export all data
                      exportFileName: "TableData",
                      selection: false,
                      showTitle: true,

                      rowStyle: {
                        fontFamily: "Open Sans",
                        fontStyle: "normal",
                        fontWeight: "400",
                        fontSize: "14px",
                        // lineHeight: "20px",
                        color: "#101F4C",
                      },
                      headerStyle: {
                        // backgroundColor: "green",
                        // color: "#FFF",
                        padding: "6px",
                      },
                    }}
                    icons={tableIcons}
                    // detailPanel={[
                    //   { icon: tableIcons.Add, tooltip: "Show Surname" },
                    // ]}
                    parentChildData={(row, rows) =>
                      rows.find((a) => a._id === row.parentId)
                    }
                  />

                  {/* <BasicTreeData/> */}
                </ThemeProvider>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Index;
