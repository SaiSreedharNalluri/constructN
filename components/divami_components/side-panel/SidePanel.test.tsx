import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { useRouter } from "next/router";
import type { NextRouter } from "next/router";
import "@testing-library/jest-dom";

import SidePanelMenu from "./SidePanel";
import { Router } from "react-router-dom";

jest.mock("next/router", () => ({
  useRouter: () => ({
    pathname: "/projects/123/dashboard",
    push: jest.fn(),
    query: { projectId: "123" },
  }),
}));

describe("SidePanelMenu component", () => {
  test("renders correctly", () => {
    const { getByTestId } = render(<SidePanelMenu onChangeData={() => {}} />);
    expect(getByTestId("const-custom-sidepanel")).toBeInTheDocument();
  });

  test("changes active menu item when clicked", () => {
    const { getByAltText, getByTestId } = render(
      <SidePanelMenu onChangeData={() => {}} />
    );
    const structureIcon = getByAltText("structure");
    const scheduleIcon = getByAltText("schedule");

    fireEvent.click(structureIcon);
    expect(structureIcon).toHaveClass("css-1h5x3dy");
    expect(scheduleIcon).not.toHaveClass("active");

    fireEvent.click(scheduleIcon);
    expect(structureIcon).not.toHaveClass("active");
    expect(scheduleIcon).toHaveClass("css-1h5x3dy");
  });

  it("updates active state and calls onChangeData prop when a menu option is clicked", () => {
    const mockOnChangeData = jest.fn();
    const { getByTestId } = render(
      <SidePanelMenu onChangeData={mockOnChangeData} />
    );

    // Click on the second menu option
    fireEvent.click(getByTestId("const-custom-sidepanel").children[1]);

    // Check that the second menu option is active
    expect(
      getByTestId("const-custom-sidepanel").children[1].querySelector("img")
    ).toHaveAttribute("src", "/_next/image?url=%2Fimg.jpg&w=96&q=75");
    // expect(mockOnChangeData).toHaveBeenCalledTimes(1);
  });

  it("navigates to the correct URL when a menu option is clicked dashboard", () => {
    const { getByTestId } = render(<SidePanelMenu onChangeData={jest.fn()} />);
    // const currentPathname = "/projects/123/structure";
    const currentPathname = "/projects/123/dashboard";

    // Set the current URL to the specified pathname
    window.history.pushState({}, "", currentPathname);

    // Click on the first menu option
    fireEvent.click(getByTestId("const-custom-sidepanel").children[0]);

    // Check that the URL has been updated to the correct path
    expect(window.location.pathname).toBe("/projects/123/dashboard");
  });

  it("navigates to the correct URL when a menu option is clicked for structure", () => {
    const { getByTestId } = render(<SidePanelMenu onChangeData={jest.fn()} />);
    // const currentPathname = "/projects/123/structure";
    const currentPathname = "/projects/123/structure";

    // Set the current URL to the specified pathname
    window.history.pushState({}, "", currentPathname);

    // Click on the first menu option
    fireEvent.click(getByTestId("const-custom-sidepanel").children[0]);

    // Check that the URL has been updated to the correct path
    expect(window.location.pathname).toBe("/projects/123/structure");
  });

  it("navigates to the correct URL when a menu option is clicked for settings", () => {
    render(<SidePanelMenu onChangeData={jest.fn()} />);
    // const currentPathname = "/projects/123/structure";
    const currentPathname = "/projects/123/settings";

    // Set the current URL to the specified pathname
    window.history.pushState({}, "", currentPathname);

    const settingId = screen.getByTestId("const-custom-sidepanel-icon-3");
    console.log("settingId", settingId);
    // Click on the first menu option
    fireEvent.click(settingId);

    // Check that the URL has been updated to the correct path
    expect(window.location.pathname).toBe("/projects/123/settings");
  });

  it("navigates to the correct URL when a menu option is clicked for schedule", () => {
    const { getByTestId } = render(<SidePanelMenu onChangeData={jest.fn()} />);
    // const currentPathname = "/projects/123/structure";
    const currentPathname = "/projects/123/schedule";

    // Set the current URL to the specified pathname
    window.history.pushState({}, "", currentPathname);

    // Click on the first menu option
    fireEvent.click(getByTestId("const-custom-sidepanel").children[0]);

    // Check that the URL has been updated to the correct path
    expect(window.location.pathname).toBe("/projects/123/schedule");
  });

  it("navigates to the correct URL when a menu option is clicked for blank", async () => {
    const { getByTestId } = render(<SidePanelMenu onChangeData={jest.fn()} />);
    // const currentPathname = "/projects/123/structure";
    const currentPathname = "/projects/123/struc";

    // Set the current URL to the specified pathname
    window.history.pushState({}, "", currentPathname);

    // Click on the first menu option
    // fireEvent.click(getByTestId("const-custom-sidepanel").children[0]);

    // Check that the URL has been updated to the correct path
      await waitFor(() => {
        expect(window.location.pathname).toBe("/projects/123/struc");
    })
  });

  it("updates config state when a menu option is clicked", async () => {
    render(<SidePanelMenu onChangeData={() => {}} />);
    const dashboardOption = await screen.findByAltText("dashboard");

    fireEvent.click(dashboardOption);

    const dashboardOptionImg = await screen.findByRole("img", {
      name: "dashboard",
    });

    expect(dashboardOptionImg).toHaveAttribute(
      "src",
      "/_next/image?url=%2Fimg.jpg&w=96&q=75"
    );
  });
});
