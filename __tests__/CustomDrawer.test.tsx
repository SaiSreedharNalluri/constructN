import { render, fireEvent, screen } from "@testing-library/react";
import CustomDrawer from "../components/divami_components/custom-drawer/custom-drawer";
import "@testing-library/jest-dom";

describe("CustomDrawer", () => {
  const props = {
    label: "Click me",
  };

  it("renders correctly  for parent custom drawer", () => {
    render(<CustomDrawer />);
    const customElement = screen.getByTestId("const-custom-drawer");
    expect(customElement).toBeInTheDocument();
  });

  it("renders correctly for styled drawer", () => {
    render(<CustomDrawer />);
    const customElement = screen.getByTestId("const-styled-drawer");
    expect(customElement).toBeInTheDocument();
  });
});

// Test that the CustomDrawer renders its children:
it("renders its children", () => {
  const { getByText } = render(
    <CustomDrawer>
      <p>Child element</p>
    </CustomDrawer>
  );
  const childElement = getByText("Child element");
  expect(childElement).toBeInTheDocument();
});
