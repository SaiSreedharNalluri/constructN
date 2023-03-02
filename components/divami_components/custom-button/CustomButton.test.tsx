import { render, fireEvent, screen, getByText } from "@testing-library/react";
import CustomButton from "./CustomButton";
import "@testing-library/jest-dom";

describe("CustomButton", () => {
  const mockFormHandler = jest.fn();
  const props = {
    type: "contained",
    label: "Click me",
    formHandler: mockFormHandler,
  };

  //  In the first test, we have tested if the component renders with the correct props
  it("renders with the correct props", () => {
    const { getByText } = render(<CustomButton {...props} />);
    expect(getByText("Click me")).toBeInTheDocument();
  });

  it("renders with the correct props", () => {
    render(<CustomButton {...props} />);
    // expect(getByText("Click me")).toBeInTheDocument();
    expect(screen.getByTestId("testing_button")).toBeInTheDocument();
  });

  it("renders with the correct props", () => {
    const updateProp = {
      ...props,
      type: "outlined",
    };
    render(<CustomButton {...updateProp} />);
    const textButton = screen.getByTestId("testing_button");
    fireEvent.click(textButton);
    expect(textButton).toBeInTheDocument();
  });
  it("renders with the correct props", () => {
    const updateProp = {
      ...props,
      type: "disabled",
    };
    render(<CustomButton {...updateProp} />);

    const textButton = screen.getByTestId("testing_button");
    fireEvent.click(textButton);
    expect(textButton).toBeInTheDocument();
  });

  it("renders with the correct props", () => {
    const updateProp = {
      ...props,
      type: "",
    };
    render(<CustomButton {...updateProp} />);

    const textButton = screen.getByTestId("testing_button");
    fireEvent.click(textButton);
    expect(textButton).toBeInTheDocument();
  });

  // we have tested if the onClick event is fired when the button is clicked
  it("fires the formHandler function when the button is clicked", () => {
    const { getByText } = render(<CustomButton {...props} />);
    fireEvent.click(getByText("Click me"));
    expect(mockFormHandler).toHaveBeenCalledTimes(2);
  });
});
