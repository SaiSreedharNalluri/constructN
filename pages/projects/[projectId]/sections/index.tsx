import React, { useState } from "react";

import Header from "../../../../components/divami_components/header/Header";
import SidePanelMenu from "../../../../components/divami_components/side-panel/SidePanel";
import logo from "./logo.svg";
import ReactDOM from "react-dom";
import MaterialTable, { MTableToolbar } from "material-table";

import { ThemeProvider, Typography, createTheme } from "@mui/material";
// import "./App.css";
// import BasicTreeData from "./components/Tree";
import ProgressBar from "../../../../components/divami_components/ProgressBarMode/ProgressBar";
// import ProgressBar from "./components/progressBar/ProgressBar";
// import CaptureMode from "./components/CaptureMode/CaptureMode";
import AddBox from "@material-ui/icons/AddBox";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
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
      {props.text}
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
    <ChevronRight {...props} ref={ref} />
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
    <ChevronRight {...props} ref={ref} />
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
    <ViewColumn {...props} ref={ref} />
  )),
};

const Index: React.FC = () => {
  const defaultMaterialTheme = createTheme();
  const [selectedRow, setSelectedRow] = useState(null);

  const columns = [
    {
      title: "Section Name",
      field: "sectionname",
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
      cellStyle: { width: "20%" },
    },
    {
      title: "Issues",
      field: "issues",
      sorting: true,
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
      sorting: true,
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
      sorting: true,
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
      title: "Progress",
      field: "progress",
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
      // sorting: true,
    },
    {
      title: "Last Updated",
      field: "lastupdated",
      sorting: true,
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

  const [tableData, setTableData] = useState([
    {
      id: 1,
      sectionname: "Basement",
      issues: 150,
      tasks: 34,
      captures: 109,
      progress: "44%",
      lastupdated: "Today",
      imageUrl: <ProgressBar />,
    },
    {
      id: 2,
      sectionname: "Parking",
      issues: 5,
      tasks: 14,
      captures: 50,
      progress: "44%",
      lastupdated: "Today",
      imageUrl: <ProgressBar />,
      parentId: 1,
    },
    {
      id: 3,
      sectionname: "Electrical Room",
      issues: 5,
      tasks: 14,
      captures: 50,
      progress: "44%",
      lastupdated: "Today",
      imageUrl: <ProgressBar />,
      parentId: 1,
    },
    {
      id: 7,
      sectionname: "Lobby",
      issues: 5,
      tasks: 14,
      captures: 50,
      progress: "44%",
      lastupdated: "Today",
      imageUrl: <ProgressBar />,
    },
    {
      id: 8,
      sectionname: "Lobby",
      issues: 5,
      tasks: 14,
      captures: 50,
      progress: "44%",
      lastupdated: "Today",
      imageUrl: <ProgressBar />,
    },
    {
      id: 9,
      sectionname: "Lobby",
      issues: 5,
      tasks: 14,
      captures: 50,
      progress: "44%",
      lastupdated: "Today",
      imageUrl: <ProgressBar />,
    },
    {
      id: 10,
      sectionname: "Lobby",
      issues: 5,
      tasks: 14,
      captures: 50,
      progress: "44%",
      lastupdated: "Today",
      imageUrl: <ProgressBar />,
    },
    {
      id: 11,
      sectionname: "Lobby",
      issues: 5,
      tasks: 14,
      captures: 50,
      progress: "44%",
      lastupdated: "Today",
      imageUrl: <ProgressBar />,
    },
    {
      id: 12,
      sectionname: "Lobby",
      issues: 5,
      tasks: 14,
      captures: 50,
      progress: "44%",
      lastupdated: "Today",
      imageUrl: <ProgressBar />,
    },
    {
      id: 13,
      sectionname: "Lobby",
      issues: 5,
      tasks: 14,
      captures: 50,
      progress: "44%",
      lastupdated: "Today",
      imageUrl: <ProgressBar />,
    },
    {
      id: 14,
      sectionname: "Lobby",
      issues: 5,
      tasks: 14,
      captures: 50,
      progress: "44%",
      lastupdated: "Today",
      imageUrl: <ProgressBar />,
    },
    {
      id: 15,
      sectionname: "Raheja",
      issues: 5,
      tasks: 14,
      captures: 50,
      progress: "44%",
      lastupdated: "Today",
      imageUrl: <ProgressBar />,
    },
    {
      id: 4,
      sectionname: "Ground Floor",
      issues: 150,
      tasks: 150,
      captures: 909,
      progress: "90%",
      lastupdated: "3h ago",
      imageUrl: <ProgressBar />,
      parentId: 1,
    },
    {
      id: 5,

      sectionname: "First Floor",
      issues: 150,
      tasks: 150,
      captures: 909,
      progress: "90%",
      lastupdated: "3h ago",
    },

    {
      id: 6,

      sectionname: "Store 01",
      issues: 150,
      tasks: 150,
      captures: 909,
      progress: "90%",
      lastupdated: "3h ago",
      parentId: 3,
    },

    // { name: 'Zerya Betül', surname: 'Baran', birthYear: 2017, birthCity: 34 },
  ]);

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
              <div>
                {/* <h1>React Table</h1> */}
                <ThemeProvider theme={defaultMaterialTheme}>
                  <MaterialTable
                    // icons={tableIcons.Search}
                    components={{
                      Toolbar: (props) => (
                        <div>
                          <MTableToolbar {...props}   />
                        </div>
                      ),
                    }}
                    columns={columns}
                    data={tableData}
                    options={{
                      sorting: true,
                      // searchFieldVariant: "outlined",
                      // filtering: true,
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
                      showTitle: false,
                      rowStyle: {
                        fontFamily: "Open Sans",
                        fontStyle: "normal",
                        fontWeight: "400",
                        fontSize: "14px",
                        // lineHeight: "20px",
                        color: "#101F4C",
                      },
                    }}
                    icons={tableIcons}
                    parentChildData={(row, rows) =>
                      rows.find((a) => a.id === row.parentId)
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
