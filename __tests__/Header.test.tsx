//unit testing for header component
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import Header from '../components/divami_components/header/Header';

describe('Header', () => {
  const useRouter = jest.spyOn(require('next/router'), 'useRouter');
  useRouter.mockImplementation(() => ({
    route: '/',
    pathname: '',
    query: { projectId: '1234' },
    asPath: '',
    push: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
    },
    beforePopState: jest.fn(() => null),
    prefetch: jest.fn(() => null),
  }));

  it('should render the Header component Logo', () => {
    const { container } = render(
      <Header
        toolClicked={true}
        viewMode
        showBreadcrumbs={false}
        breadCrumbData={[{ name: "Adani-Park-Pune" }, { name: "Adani-Hyd-Park" }]}
        handleBreadCrumbClick={jest.fn()}
      />
    );
    expect(container).toMatchSnapshot();
    const logoElement = screen.getByTestId(/constructn-logo/i);
    fireEvent.click(logoElement);
    expect(logoElement).toBeInTheDocument();

    const breadcrumbLabel = screen.queryByText(/Adani-Park-Pune/i);
    expect(breadcrumbLabel).not.toBeInTheDocument();
  });

  it('should toggle BreadCrumb', () => {
    render(
      <Header
        toolClicked={true}
        viewMode
        showBreadcrumbs={true}
        breadCrumbData={[{ name: "Adani-Park-Pune" }, { name: "Adani-Hyd-Park" }]}
        handleBreadCrumbClick={jest.fn()}
      />
    );
    const breadcrumbLabel = screen.queryByText(/Adani-Park-Pune/i);
    expect(breadcrumbLabel).toBeInTheDocument();
  });

  it('should not render the Design Button when not passsing toolClicked prop', () => {
    const {container} = render(
      <Header
        viewMode="Design"
        showBreadcrumbs={false}
        breadCrumbData={[]}
        handleBreadCrumbClick={jest.fn()}
      />
    );
    expect(container).toMatchSnapshot();
    const designButton = screen.queryByText(/design/i);
    expect(designButton).toBeNull();
  });

  it('should render the Design Button and get it toggled', () => {
    render(
      <Header
        toolClicked={jest.fn}
        viewMode="Design"
        showBreadcrumbs={false}
        breadCrumbData={[]}
        handleBreadCrumbClick={jest.fn()}
      />
    );
    const designButton = screen.getByTestId(/design-button/i);
    expect(designButton).toHaveStyle(`background-color: #F1742E;`);
    fireEvent.click(designButton);
    expect(designButton).not.toHaveStyle(`background-color: #F1742E;`);
  });

  it('should render the Reality Button get it toggled', () => {
    render(
      <Header
        toolClicked={jest.fn}
        viewMode="Reality"
        showBreadcrumbs={false}
        breadCrumbData={[]}
        handleBreadCrumbClick={jest.fn()}
      />
    );
    const realityButton = screen.getByTestId(/reality-button/i);
    expect(realityButton).toHaveStyle(`background-color: #F1742E;`);
    fireEvent.click(realityButton);
    expect(realityButton).not.toHaveStyle(`background-color: #F1742E;`);

  });

  it('should render the Profile Image, toggle dropdown & able to logout', () => {
    render(
      <Header
        toolClicked={jest.fn}
        viewMode="Design"
        showBreadcrumbs={false}
        breadCrumbData={[]}
        handleBreadCrumbClick={jest.fn()}
      />
    );
    const profileImage = screen.getByAltText('Profile Image Icon');
    fireEvent.click(profileImage);
    const logOutButton = screen.getByTestId(/logout-button/i);
    expect(logOutButton).toBeInTheDocument();
    fireEvent.click(profileImage);
    const logOutButtonAgain = screen.queryByText("Logout");
    expect(logOutButtonAgain).toBeNull();
    fireEvent.click(profileImage);
    const logOutButtonEl = screen.getByTestId(/logout-button/i);
    fireEvent.click(logOutButtonEl);
    expect(useRouter).toHaveBeenCalled();
  });
});
