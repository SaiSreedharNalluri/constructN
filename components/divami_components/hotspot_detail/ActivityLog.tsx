import Image from "next/image";
import {
  ActivityAddedComment,
  ActivityBody,
  ActivityBodyIssueRaisedCase,
  ActivityCard,
  ActivityCardContainer,
  ActivityComment,
  ActivityCommentAddedBy,
  ActivityCommentAddedByMain,
  ActivityCommentDiv,
  ActivityCreated,
  ActivityCurrentProgress,
  ActivityFor,
  ActivityHeader,
  ActivityHeaderDivider,
  ActivityImage,
  ActivityImageSection,
  ActivityIssueRaisedMain,
  ActivityIssueRaisedMainProfile,
  ActivityIssueType,
  ActivityScanUploadBox,
  ActivityScreenShotIconContainer,
  ActivityStatusIcon,
  ActivityStatusTitle,
  ActivityTimeStamp,
  IssuesDescription,
} from "./ActivityLogStyles";
import hotspotActivity from "../../../public/divami_icons/hotspotActivity.svg";
import ImageScreenShot from "../../../public/divami_icons/imageScreenShot.svg";

const ActivityLog = (props: any) => {
  const { ActivityLog } = props;
  return (
    <ActivityCardContainer>
      {ActivityLog.map((each: any, index: number) => {
        return (
          <ActivityCard key={index}>
            <ActivityHeader>
              <ActivityStatusIcon>
                <Image src={hotspotActivity} alt="group" />
              </ActivityStatusIcon>
              <ActivityStatusTitle>Scan Updated</ActivityStatusTitle>
              <ActivityHeaderDivider>{" | "}</ActivityHeaderDivider>
              <ActivityTimeStamp>{each.scan_updated}</ActivityTimeStamp>
            </ActivityHeader>

            <ActivityBody>
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
            </ActivityBody>
          </ActivityCard>
        );
      })}
    </ActivityCardContainer>
  );
};

export default ActivityLog;
