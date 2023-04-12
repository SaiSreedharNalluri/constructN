import '@testing-library/jest-dom';
import { render } from "@testing-library/react";
import Body from "../components/divami_components/create-issue/body/Body";
import * as API from "../services/project";



jest.mock("../services/issue.ts", () => ({
  getIssuesTypes: jest.fn(() => Promise.resolve({ success: true, result: ["siva", "batman", "bug"] })),
  getIssuesPriority: jest.fn(() => Promise.resolve({ success: true, result: ["siva", "batman", "High"] })),
}))

jest.mock('../services/project', () => {
  return {
    __esModule: true,
    ...jest.requireActual('../services/project')
  };
});

jest.mock('cookies-next', () => ({
  getCookie: () => (JSON.stringify({
    _id: '12345',
  })),
}));

jest.spyOn(API, "getProjectUsers").mockImplementation(() => Promise.resolve({
  success: true, result: [{
    "user": {
      "_id": "USR744836",
      "firstName": "vineeth ",
      "lastName": "constructn",
      "email": "vineeth@constructn.ai",
      "contact": {
        "code": "500049",
        "number": 1234567890
      },
      "dob": "1996-08-19T00:00:00.000Z",
      "createdAt": "2023-01-24T07:19:04.836Z",
      "updatedAt": "2023-03-03T06:46:53.846Z",
      "avatar": "https://constructn-attachments-dev.s3.ap-south-1.amazonaws.com/avatars/USR744836.png",
      "fullName": "vineeth  constructn",
      "age": 26
    },
    "role": "admin"
  }]
}));

const useRouter = jest.spyOn(require('next/router'), 'useRouter');
useRouter.mockImplementation(() => ({
  route: '/',
  pathname: '',
  query: { projectId: '1234' },
  asPath: '',
  isReady: true,
  push: jest.fn(),
  events: {
    on: jest.fn(),
    off: jest.fn(),
  },
  beforePopState: jest.fn(() => null),
  prefetch: jest.fn(() => null),
}));

describe("Create Issue Body", () => {
  const handleFormData = jest.fn();
  const editData = {
    title: "Test issue",
    tags: ["tag1", "tag2"],
    type: "Bug",
    description: "Test description",
    priority: "High",
    assignedTo: "John Doe",
    dueDate: "2022-01-01",
    attachments: ["image1.jpg", "image2.png"],
  };
  const validate = jest.fn();
  const setIsValidate = jest.fn();
  const tagsList = ["tag1", "tag2", "tag3"];
  const issueStatusList = ["Open", "In progress", "Resolved"];

  it("should render the create issue form fields", () => {
    render(<Body
      handleFormData={handleFormData}
      // editData={editData}
      validate={validate}
      setIsValidate={setIsValidate}
      tagsList={tagsList}
      issueStatusList={issueStatusList}
    />)
  });

});