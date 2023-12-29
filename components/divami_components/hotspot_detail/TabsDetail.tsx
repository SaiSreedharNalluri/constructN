import { Box, Typography } from "@mui/material";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import React, { useEffect, useState } from "react";
import { styled } from "@mui/system";
import {
  ImageHeaderDiv,
  ProgressStatus,
  ProgressTitle,
  SecondBodyDiv,
  SecondContPrior,
  SecondContPriorParal,
  SpanTitleDiv,
  TabOneDiv,
  ThirdBodyDiv,
  TitleDiv,
} from "./HotspotDetailStyles";
import TabTwo from "./config";
import ActivityLog from "./ActivityLog";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
const CustomTabPanel = styled(TabPanel)`
  padding: none;
`;

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
export const BasicTabs = (props: any) => {
  const [value, setValue] = React.useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const [activityStatus, setActivityStatus] = useState(TabTwo);
  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "#D9D9D9", color: "black" }}>
        {" "}
        <Tabs
          TabIndicatorProps={{
            style: { background: "#F1742E", height: "3px" },
          }}
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          sx={{
            "& .MuiTabs-scroller": {
              padding: "0px 20px",
            },
            "& .MuiBox-root": {
              border: "1px solid red",
            },
            "& .MuiTabs-flexContainer": {
              paddingTop: "20px",
              paddingLeft: "0",
            },

            "& .Mui-selected": {
              paddingTop: "0px",
              paddingLeft: "0",
              paddingBottom: "0",
              fontSize: "14px",
              fontWeight: "400",
              textTransform: "capitalize",
            },

            "& .MuiTab-root": {
              minWidth: "0px",
              paddingTop: "0px",
              paddingLeft: "0",
              paddingBottom: "0",
              fontSize: "14px",
              fontWeight: "400",
              textTransform: "capitalize",
              minHeight: "0",
            },

            "& .MuiTabs-indicator": {
              background: "#101F4C",
              width: "68px !important",
            },
          }}
        >
          {/* MuiTab-root.Mui-selected */}
          <Tab
            label="Details"
            {...a11yProps(0)}
            style={{
              marginRight: "40px",
              paddingLeft: "0px",
              color: "#101F4C",
              fontFamily: "Open Sans",
              fontStyle: "normal",
              fontSize: "14px",
              fontWeight: "400",
            }}
          />
          {/* <Tab label="Activity log" {...a11yProps(1)} /> */}
          <Tab
            label="Activity log"
            {...a11yProps(1)}
            style={{
              paddingRight: "0px",
              color: "#101F4C",
              fontFamily: "Open Sans",
              fontStyle: "normal",
              fontSize: "14px",
              fontWeight: "400",
            }}
          />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <TabOneDiv>
          <SecondBodyDiv>
            <SecondContPrior>
              <ProgressTitle>0.2%</ProgressTitle>
              <ProgressStatus>Progress Rate</ProgressStatus>
            </SecondContPrior>

            <SecondContPriorParal>
              <ProgressTitle>30%</ProgressTitle>
              <ProgressStatus>Current Progress</ProgressStatus>
            </SecondContPriorParal>
          </SecondBodyDiv>

          <ThirdBodyDiv>
            <TitleDiv>Current Scan : 15 Dec 2022 05:10 PM (30%) </TitleDiv>

            <ImageHeaderDiv>
              <div></div>
            </ImageHeaderDiv>
          </ThirdBodyDiv>

          <ThirdBodyDiv>
            <TitleDiv>Last Scan : 15 Dec 2022 05:10 PM (30%) </TitleDiv>

            <ImageHeaderDiv>
              <div></div>
            </ImageHeaderDiv>
          </ThirdBodyDiv>
        </TabOneDiv>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <ActivityLog ActivityLog={activityStatus} />
      </CustomTabPanel>
    </Box>
  );
};

export default TabPanel;
