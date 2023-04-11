import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { useRouter } from "next/router";
import type { NextRouter } from "next/router";
import "@testing-library/jest-dom";
import ActivityLog from "../components/divami_components/hotspot_detail/ActivityLog";

describe("ActivityLog Component", () => {
  const mockActivityLog = [
    {
      status: "Scan Updated",
      scan_updated: "15 Dec 2022",
      profile: "Adam Smith",
      comment: "Uploaded a new Scan",
      currentProgress: "30%",
      imageDetails: "Blalalalal.jpg",
    },
    {
      status: "Scan Updated",
      scan_updated: "12 Nov 22",
      profile: "Adam Smith",
      comment: "Uploaded a new Scan",
      currentProgress: "28.8%",
      imageDetails: "Blalalalal.jpg",
    },
  ];

  it("should render the activity log", () => {
    // const { getByText } = render(<ActivityLog ActivityLog={mockActivityLog} />);

    const { getByTestId } = render(
      <ActivityLog ActivityLog={mockActivityLog} />
    );
    expect(getByTestId("const-custom-activity-log-issue")).toBeInTheDocument();
  });
});

test("renders Scan Updated activity card", () => {
  const mockProps = {
    ActivityLog: [
      {
        status: "Scan Updated",
        scan_updated: "12 Nov 22",
        profile: "Adam Smith",
        comment: "Uploaded a new Scan",
        currentProgress: "28.8%",
        imageDetails: "Blalalalal.jpg",
      },
    ],
  };

  render(<ActivityLog {...mockProps} />);

  const activityStatusTitle = screen.getByText("Scan Updated");
  expect(activityStatusTitle).toBeInTheDocument();

  const currentProgress = screen.getByText("28.8%");
  expect(currentProgress).toBeInTheDocument();

  const activityProfile = screen.getByText("Adam Smith");
  expect(activityProfile).toBeInTheDocument();

  const activityComment = screen.getByText("Uploaded a new Scan");
  expect(activityComment).toBeInTheDocument();
});
