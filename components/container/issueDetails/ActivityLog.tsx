import React from "react";
import Image from "next/image";
import IssuesUpdated from "../../../public/divami_icons/issueUpdated.svg";
import CommentAdded from "../../../public/divami_icons/commentAdded.svg";
import IssueRaised from "../../../public/divami_icons/issueRaised.svg";
import RfiRaised from "../../../public/divami_icons/rfiRaised.svg";
import RfiUpdated from "../../../public/divami_icons/rfiUpdated.svg";
import ScanUpdated from "../../../public/divami_icons/scanUpdated.svg";
import ImageScreenShot from "../../../public/divami_icons/imageScreenShot.svg";
import {
  ActivityCardContainer,
  ActivityCard,
  ActivityHeader,
  ActivityStatusIcon,
  ActivityStatusTitle,
  ActivityHeaderDivider,
  ActivityBody,
  ActivityTimeStamp,
  ActivityBodyIssueRaisedCase,
  ActivityCommentAddedBy,
  ActivityCommentAddedByMain,
  ActivityAddedComment,
  ActivityCommentDiv,
  ActivityComment,
  ActivityIssueRaisedMain,
  ActivityCreated,
  ActivityIssueType,
  ActivityFor,
  IssuesDescription,
  ActivityScanUploadBox,
  ActivityIssueRaisedMainProfile,
  ActivityCurrentProgress,
  ActivityImageSection,
  ActivityImage,
  ActivityScreenShotIconContainer,
} from "./ActivityLogStyles";

const ActivityLog = (props: any) => {
  const { ActivityLog } = props;

  return (
    <ActivityCardContainer data-testid="const-custom-activity-log-issue">
      {ActivityLog?.map((each: any, index: number) => {
        return (
          <ActivityCard key={index}>
            <ActivityHeader>
              <ActivityStatusIcon>
                <Image
                  src={
                    each.status === "Issue Raised"
                      ? IssueRaised
                      : each.status === "Issue Updated"
                      ? IssuesUpdated
                      : each.status === "Comment Added"
                      ? CommentAdded
                      : each.status === "RFI Updated"
                      ? RfiUpdated
                      : each.status === "RFI Raised"
                      ? RfiRaised
                      : each.status === "Scan Updated"
                      ? ScanUpdated
                      : ""
                  }
                  alt={""}
                />
              </ActivityStatusIcon>
              <ActivityStatusTitle>{each.status}</ActivityStatusTitle>
              <ActivityHeaderDivider>{" | "}</ActivityHeaderDivider>
              <ActivityTimeStamp>{each.timeStamp}</ActivityTimeStamp>
            </ActivityHeader>
            {index === ActivityLog.length - 1 ? (
              <ActivityBodyIssueRaisedCase
              //   className={
              //     index === ActivityConfig.length - 1
              //       ? styles.ActivityBodyIssueRaisedCase
              //       : styles.ActivityBody
              //   }
              >
                <ActivityCommentAddedBy>
                  {each.comment?.length > 0 && (
                    <>
                      <ActivityCommentAddedByMain>
                        {each.profile}
                      </ActivityCommentAddedByMain>
                      <ActivityAddedComment>
                        added a Comment
                      </ActivityAddedComment>
                      <ActivityCommentDiv>
                        <ActivityComment>{`"${each.comment}"`}</ActivityComment>
                      </ActivityCommentDiv>
                    </>
                  )}
                </ActivityCommentAddedBy>
                {(each.status === "Issue Raised" ||
                  each.status === "RFI Raised") && (
                  <>
                    <ActivityIssueRaisedMain>
                      {each.profile}
                    </ActivityIssueRaisedMain>
                    <ActivityCreated>Created an</ActivityCreated>
                    <ActivityIssueType>{each.issueType}</ActivityIssueType>
                    <ActivityFor>for</ActivityFor>
                    <IssuesDescription>
                      {each.issueDescription}
                    </IssuesDescription>
                  </>
                )}
                {each.status === "Scan Updated" && (
                  <ActivityScanUploadBox data-testid="activity-scan-upload-box">
                    <ActivityIssueRaisedMainProfile>
                      {each.profile}
                    </ActivityIssueRaisedMainProfile>
                    <ActivityCreated>Uploaded a new Scan</ActivityCreated>
                  </ActivityScanUploadBox>
                )}
                {each.currentProgress?.length > 0 && (
                  <ActivityCurrentProgress>
                    <span>Current Progress: </span>
                    <span>{each.currentProgress}</span>
                  </ActivityCurrentProgress>
                )}
                {each.imageDetails?.length > 0 && (
                  <ActivityImageSection>
                    <ActivityScreenShotIconContainer>
                      <Image src={ImageScreenShot} alt="" />
                    </ActivityScreenShotIconContainer>
                    <ActivityImage>{each.imageDetails}</ActivityImage>
                  </ActivityImageSection>
                )}
              </ActivityBodyIssueRaisedCase>
            ) : (
              <ActivityBody>
                <ActivityCommentAddedBy>
                  {each.comment?.length > 0 && (
                    <>
                      <ActivityCommentAddedByMain>
                        {each.profile}
                      </ActivityCommentAddedByMain>
                      <ActivityAddedComment>
                        added a Comment
                      </ActivityAddedComment>
                      <ActivityCommentDiv>
                        <ActivityComment>{`"${each.comment}"`}</ActivityComment>
                      </ActivityCommentDiv>
                    </>
                  )}
                </ActivityCommentAddedBy>
                {(each.status === "Issue Raised" ||
                  each.status === "RFI Raised") && (
                  <>
                    <ActivityIssueRaisedMain>
                      {each.profile}
                    </ActivityIssueRaisedMain>
                    <ActivityCreated>Created an</ActivityCreated>
                    <ActivityIssueType>{each.issueType}</ActivityIssueType>
                    <ActivityFor>for</ActivityFor>
                    <IssuesDescription>
                      {each.issueDescription}
                    </IssuesDescription>
                  </>
                )}
                {each.status === "Scan Updated" && (
                  <ActivityScanUploadBox>
                    <ActivityIssueRaisedMainProfile>
                      {each.profile}
                    </ActivityIssueRaisedMainProfile>
                    <ActivityCreated>Uploaded a new Scan</ActivityCreated>
                  </ActivityScanUploadBox>
                )}
                {each.currentProgress?.length > 0 && (
                  <ActivityCurrentProgress>
                    <span>Current Progress: </span>
                    <span>{each.currentProgress}</span>
                  </ActivityCurrentProgress>
                )}
                {each.imageDetails?.length > 0 && (
                  <ActivityImageSection>
                    <ActivityScreenShotIconContainer>
                      <Image src={ImageScreenShot} alt="" />
                    </ActivityScreenShotIconContainer>
                    <ActivityImage>{each.imageDetails}</ActivityImage>
                  </ActivityImageSection>
                )}
              </ActivityBody>
            )}
          </ActivityCard>
        );
      })}
    </ActivityCardContainer>
  );
};

export default ActivityLog;
