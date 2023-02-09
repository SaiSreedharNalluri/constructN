import React from "react";
import { styled } from "@mui/system";

import { Box } from "@mui/material";
import Image from "next/image";
import taskListing from "./Constant";
import hourGlassIcon  from "../../../../public/divami_icons/hourGlassIcon.svg";
// import hourGlassIcon  from "../../../../public/divami_icons/hourGlassIcon.svg";


const BodyInfo = styled("div")();

const BodyContIcon = styled("div")();

const BodyContTitle = styled("div")({
  marginLeft: "2px",
});

const SecondHeader = styled("div")({
  marginLeft: "26px",
});

const ThirdHeader = styled("div")({
  display: "flex",
  marginLeft: "26px",
  marginTop: "6px",
  justifyContent: "space-between",
});

const DueDateDiv = styled("div")({
  fontFamily: "Open Sans",
  fontStyle: "italic",
  fontWeight: "400",
  fontSize: "14px",
  lineHeight: "19px",
});

const HorizontalLine = styled("div")({
  backgroundColor: "#d9d9d9",
  border: "1px solid #d9d9d9",
  width: "398x",
  marginTop: "20px",
  marginBottom: "20px",
});

const FirstHeader = styled("div")({
  display: "flex",
});

const BodyComponent = () => {
  return (
    <Box sx={{ marginTop: "15px" }}>
      {taskListing.map((val) => {
        return (
          <div>
            <BodyInfo>
              <FirstHeader>
                <BodyContIcon>
                  <Image src={hourGlassIcon} alt="Arrow" />
                </BodyContIcon>

                <BodyContTitle>
                  {val.title} (#{val.id})
                </BodyContTitle>
              </FirstHeader>

              <SecondHeader>
                <div>{val.priority} Priority</div>
              </SecondHeader>

              {/* <div className={styles.second_header}>
                  </div> */}

              <ThirdHeader>
                <div>{val.assignee}</div>
                <DueDateDiv>Due by {val.due_date}</DueDateDiv>
              </ThirdHeader>
            </BodyInfo>

            <HorizontalLine></HorizontalLine>
          </div>
        );
      })}
    </Box>
  );
};

export default BodyComponent;
