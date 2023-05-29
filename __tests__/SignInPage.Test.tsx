import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SignInPage from "../components/divami_components/sign-in/SignInPage";

describe("SignInPage", () => {
  const useRouter = jest.spyOn(require("next/router"), "useRouter");
  useRouter.mockImplementation(() => ({
    route: "/",
    pathname: "",
    query: { projectId: "1234" },
    asPath: "",
    push: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
    },
    beforePopState: jest.fn(() => null),
    prefetch: jest.fn(() => null),
  }));

  it("renders sign in form correctly", () => {
    render(<SignInPage />);

    // Verify the presence of important elements in the sign in form
    expect(screen.getByTestId("SignInHeading").textContent).toBe("Sign In");
  });

  it("renders forgot password button", () => {
    render(<SignInPage />);

    // Verify the presence of important elements in the sign in form

    const forgot_button = screen.getByTestId("forgotPasswordClick");
    fireEvent.click(forgot_button);

    expect(useRouter).toHaveBeenCalled();
  });
  it("renders sign up button", () => {
    render(<SignInPage />);

    // Verify the presence of important elements in the sign in form

    const signup_button = screen.getByTestId("signUpRoute");
    fireEvent.click(signup_button);

    expect(useRouter).toHaveBeenCalled();
  });

  it("renders remember me button", () => {
    render(<SignInPage />);

    // Verify the presence of important elements in the sign in form

    const remember_button = screen.getByTestId("rememeberClick");
    fireEvent.change(remember_button);

    expect(remember_button).toBeChecked();
  });
  //   it("handles form submission correctly", () => {
  //     render(<SignInPage />);

  //     // Fill in the email and password fields
  //     fireEvent.change(screen.getByLabelText("Email ID"), {
  //       target: { value: "test@example.com" },
  //     });
  //     fireEvent.change(screen.getByLabelText("Password"), {
  //       target: { value: "password123" },
  //     });

  //     // Submit the form
  //     fireEvent.click(screen.getByText("Sign In"));

  //     // Verify that the form submission was handled correctly
  //     // You may need to mock the API calls or dependencies for proper testing
  //     // For example, you can use Jest's `jest.mock` to mock the `login` function
  //     // and test if it was called with the correct arguments
  //     // Also, you can use `waitFor` from React Testing Library to handle asynchronous actions
  //     // and assertions.

  //     // Example:
  //     // - Mock the login function
  //     // jest.mock("../../../services/userAuth", () => ({
  //     //   login: jest.fn(),
  //     // }));

  //     // - Verify that the login function was called with the correct arguments
  //     // expect(login).toHaveBeenCalledWith("test@example.com", "password123");
  //   });

  // Add more tests to cover other functionality and edge cases
});
