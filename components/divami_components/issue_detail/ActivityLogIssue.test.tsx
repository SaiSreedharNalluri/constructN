import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { useRouter } from "next/router";
import type { NextRouter } from "next/router";
import "@testing-library/jest-dom";
import ActivityLog from "./ActivityLog";

describe("ActivityLog Component", () => {
  const mockActivityLog = [
    {
      status: "Issue Raised",
      profile: "John",
      issueType: "bug",
      issueDescription: "This is a bug",
      timeStamp: "2022-01-01",
    },

    ,
    {
      status: "Comment Added",
      profile: "Mark",
      comment: "This is a comment",
      timeStamp: "2022-01-02",
    },
  ];

  it("should render the activity log", () => {
    // const { getByText } = render(<ActivityLog ActivityLog={mockActivityLog} />);

    const { getByTestId } = render(
      <ActivityLog ActivityLog={mockActivityLog} />
    );
    expect(getByTestId("const-custom-activity-log-issue")).toBeInTheDocument();
    // expect(getByText("Issue Raised")).toBeInTheDocument();
    // expect(getByText("John")).toBeInTheDocument();
    // expect(getByText("bug")).toBeInTheDocument();
    // expect(getByText("This is a bug")).toBeInTheDocument();
    // expect(getByText("2022-01-01")).toBeInTheDocument();
    // expect(getByText("Comment Added")).toBeInTheDocument();
    // expect(getByText("Mark")).toBeInTheDocument();
    // expect(getByText("This is a comment")).toBeInTheDocument();
    // expect(getByText("2022-01-02")).toBeInTheDocument();
  });
});

// test("renders IssueUpdated icon when status is 'Issue Updated'", () => {
//   const ActivityLogData = [
//     {
//       status: "Issue Updated",
//       timeStamp: "2023-03-06T10:00:00Z",
//       profile: "John Doe",
//       comment: "",
//       issueType: "",
//       issueDescription: "",
//       currentProgress: "",
//       imageDetails: [],
//     },
//   ];

//   render(<ActivityLog ActivityLog={ActivityLogData} />);

//   const IssueUpdatedIcon = screen.getByAltText("Issue Updated");

//   expect(IssueUpdatedIcon).toBeInTheDocument();
// });

test("renders comment added activity card", () => {
  const mockProps = {
    ActivityLog: [
      {
        status: "Comment Added",
        timeStamp: "2022-01-01T00:00:00.000Z",
        profile: "John Doe",
        comment: "This is a test comment.",
        imageDetails: "",
      },
    ],
  };

  render(<ActivityLog {...mockProps} />);

  const activityStatusTitle = screen.getByText("Comment Added");
  expect(activityStatusTitle).toBeInTheDocument();

  const activityTimeStamp = screen.getByText("2022-01-01T00:00:00.000Z");
  expect(activityTimeStamp).toBeInTheDocument();

  const activityProfile = screen.getByText("John Doe");
  expect(activityProfile).toBeInTheDocument();

  const activityComment = screen.getByText('"This is a test comment."');
  expect(activityComment).toBeInTheDocument();
});

test("renders ActivityLog with RFI Updated status", () => {
  const activityLogData = [
    {
      status: "RFI Updated",
      timeStamp: "2022-05-01T10:30:00.000Z",
      profile: "John Doe",
      currentProgress: "In Progress",
      imageDetails: "Some image details",
    },
  ];

  render(<ActivityLog ActivityLog={activityLogData} />);

  const activityStatusTitle = screen.getByText("RFI Updated");
  expect(activityStatusTitle).toBeInTheDocument();
});

test("renders activity log card for RFI Raised status", () => {
  const mockActivityLog = [
    {
      status: "RFI Raised",
      profile: "John Doe",
      issueType: "RFI",
      issueDescription: "This is a test RFI",
      timeStamp: "2022-03-01T08:00:00.000Z",
    },
  ];

  render(<ActivityLog ActivityLog={mockActivityLog} />);

  // const activityLogCard = screen.getByRole("article");
  // expect(activityLogCard).toBeInTheDocument();

  const activityStatusTitle = screen.getByText("RFI Raised");
  expect(activityStatusTitle).toBeInTheDocument();

  const activityTimeStamp = screen.getByText("2022-03-01T08:00:00.000Z");
  expect(activityTimeStamp).toBeInTheDocument();

  const activityIssueRaisedMain = screen.getByText("John Doe");
  expect(activityIssueRaisedMain).toBeInTheDocument();

  const activityIssueType = screen.getByText("RFI");
  expect(activityIssueType).toBeInTheDocument();

  const issuesDescription = screen.getByText("This is a test RFI");
  expect(issuesDescription).toBeInTheDocument();
});

it("renders Scan Updated activity correctly", () => {
  const mockActivityLog = [
    {
      status: "Scan Updated",
      profile: "John Doe",
      timeStamp: "2022-01-01T00:00:00.000Z",
    },
  ];
  render(<ActivityLog ActivityLog={mockActivityLog} />);
  const scanUploadBox = screen.getByTestId("activity-scan-upload-box");
  expect(scanUploadBox).toBeInTheDocument();
  const profile = screen.getByText(/John Doe/);
  expect(profile).toBeInTheDocument();
  const message = screen.getByText(/Uploaded a new Scan/);
  expect(message).toBeInTheDocument();
});
