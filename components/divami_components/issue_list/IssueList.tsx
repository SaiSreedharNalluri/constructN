import { useState } from "react";
import BodyComponent from "./body/body";
import { Box } from "@mui/material";
import Image from "next/image";

// import HeaderComponent from "./header/Header";
import {
  IssueListContainer,
  HeaderContainer,
  TitleContiner,
  CloseIcon,
  MiniHeaderContainer,
  MiniSymbolsContainer,
  SearchGlassIcon,
  DividerIcon,
  ArrowUpIcon,
  DueDate,
  FunnelIcon,
  DownloadIcon,
  BodyContainer,BodyInfo,BodyContIcon,BodyContTitle,SecondHeader,FirstHeader,ThirdHeader,DueDateDiv,HorizontalLine
} from "./IssueListStyles";
import CrossIcon from "../../../public/divami_icons/crossIcon.svg";
import searchGlassIcon from "../../../public/divami_icons/searchGlassIcon.svg";
import dividerIcon from "../../../public/divami_icons/dividerIcon.svg";
import arrowUp from "../../../public/divami_icons/arrowUp.svg";
import downloadIcon from "../../../public/divami_icons/downloadIcon.svg";
import hourGlassIcon from "../../../public/divami_icons/hourGlassIcon.svg";
import filterFunnelIcon from "../../../public/divami_icons/filterFunnelIcon.svg";

import taskListing from "./body/Constant";

export const IssueListing = () => {
  const title = "Issue List";
  return (
    <IssueListContainer>
      <HeaderContainer>
        <TitleContiner>
          <span>{title}</span>

          <CloseIcon src={CrossIcon} alt={"close icon"} />
        </TitleContiner>
      </HeaderContainer>

      <MiniHeaderContainer>
        <MiniSymbolsContainer>
          {/* <Image src={searchGlassIcon} alt="Arrow" /> */}
          <SearchGlassIcon src={searchGlassIcon} alt={"close icon"} />
          <DividerIcon src={dividerIcon} alt={"close icon"} />

          {/* <Image src={dividerIcon} alt="Arrow" /> */}
          <ArrowUpIcon src={arrowUp} alt="Arrow" />

          <DueDate>Due Date</DueDate>
          <DownloadIcon src={downloadIcon} alt="Arrow" />

          <FunnelIcon src={filterFunnelIcon} alt="Arrow" />
        </MiniSymbolsContainer>
      </MiniHeaderContainer>

      <BodyContainer>
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
      </BodyContainer>
    </IssueListContainer>
  );
};

// export default IssueList;
