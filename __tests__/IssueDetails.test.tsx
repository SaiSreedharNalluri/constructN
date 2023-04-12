import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Moment from "moment";
import CustomIssueDetailsDrawer from "../components/divami_components/issue_detail/IssueDetail";
import { createComment } from '../services/comments';
// import * as editIssueAPI from "../services/issue";
import * as commentsAPI from "../services/comments";
// import { editIssue } from "../services/issue"
// import { createComment } from "../services/comments";
// import * as issueDetails from "../components/divami_components/issue_detail/IssueDetail";

// jest.mock("../services/comments");
// jest.mock("../services/issue");
// const editIssueAPI = editIssue as jest.Mock;
// editIssueAPI.mockResolvedValue(() => Promise.resolve({ success: true }));
const issueMock = {
  "title": "test",
  "description": "test",
  "type": "Clash",
  "status": "To Do",
  "priority": "High",
  "assignees": [
    {
      "_id": "USR370060",
      "firstName": "swathi",
      "lastName": "divami",
      "email": "swathi@divami.com",
      "fullName": "swathi divami"
    }
  ],
  "owner": "USR370060",
  "project": "PRJ201897",
  "structure": "STR654406",
  "snapshot": "SNP746698",
  "context": {
    "type": "Issue",
    "cameraObject": {
      "cameraPosition": {
        "x": 385387.185919544,
        "y": 2049797.3090976952,
        "z": 159.85971788829193
      },
      "cameraTarget": {
        "x": 385387.185919544,
        "y": 2049797.309151555,
        "z": 106
      }
    },
    "tag": {
      "tagPosition": {
        "x": 385385.9804429793,
        "y": 2049804.9918154217,
        "z": 106
      }
    }
  },
  "progress": -1,
  "sequenceNumber": 404,
  "startDate": "2023-02-28T18:30:00.000Z",
  "dueDate": "2023-03-03T18:30:00.000Z",
  "tags": [
    "Software"
  ],
  "createdAt": "2023-03-01T10:09:31.422Z",
  "updatedAt": "2023-03-01T10:09:31.422Z",
  "_id": "ISS371422",
  "__v": 0
}

const projectUsersMock = [
  {
    "user": {
      "_id": "USR744836",
      "firstName": "Siva ",
      "lastName": "Rajana",
      "email": "sivathebatman@gmail.com",
      "contact": {
        "code": "500049",
        "number": 1234567890
      },
      "dob": "1996-08-19T00:00:00.000Z",
      "createdAt": "2023-01-24T07:19:04.836Z",
      "updatedAt": "2023-02-27T11:34:58.211Z",
      "avatar": "https://constructn-attachments-dev.s3.ap-south-1.amazonaws.com/avatars/USR744836.png",
      "fullName": "siva rajana",
      "age": 29
    },
    "role": "admin"
  }]


// jest.mock('../services/comments.ts', () => {
//   return {
//     __esModule: true,    //    <----- this __esModule: true is important
//     ...jest.requireActual('../services/comments.ts')
//   };
// });

// jest.mock('../services/issue.ts', () => {
//   return {
//     __esModule: true,    //    <----- this __esModule: true is important
//     ...jest.requireActual('../services/issue.ts')
//   };
// });

jest.mock("../services/issue", () => {
  return {
    editIssue: jest.fn(() => Promise.resolve({ success: true, result: [] })),
  };
});

jest.mock("../services/comments", () => {
  return {
    createComment: jest.fn(() => Promise.resolve({ success: true, result: [] })),
  };
});


describe("IssueDetails", () => {

  beforeEach(() => {
    jest.clearAllMocks();

    // jest.mock("../services/issue", () => {
    //   return {
    //     editIssue: jest.fn(() => Promise.resolve({ success: true, result: [] })),
    //   };
    // });

    // jest.mock("../services/comments", () => {
    //   return {
    //     createComment: jest.fn(() => Promise.resolve({ success: true, result: [] })),
    //   };
    // });

    // jest.spyOn(editIssueAPI, "editIssue").mockImplementation(() => Promise.resolve({ success: true, result: [] }));

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
  });

  it("should render the IssueDetails component", () => {
    const { getByTestId } = render(<CustomIssueDetailsDrawer
      onClose={jest.fn()}
      issue={issueMock}
      issuesList={[issueMock]}
      issueType={[
        "Safety"]}
      issuePriority={["high"]}
      issueStatus={["To Do"]}
      projectUsers={projectUsersMock}
      currentProject={"PRJ201897"}
      currentSnapshot={issueMock}
      currentStructure={issueMock}
      contextInfo={""}
      deleteTheIssu={jest.fn()}
      setIssueList={jest.fn()}
      getIssues={jest.fn()}
    />);
    expect(getByTestId('issue-detail-header')).toHaveTextContent("Clash");
    expect(getByTestId('issue-detail-header')).toHaveTextContent("404");
    expect(getByTestId('issue-title')).toHaveTextContent("test");
    expect(getByTestId('issue-priority')).toHaveTextContent("High");
    expect(getByTestId('issue-captured')).toHaveTextContent(Moment("2023-03-01T10:09:31.422Z").format("DD MMM YY"))
    expect(getByTestId('issue-progress')).toHaveTextContent("To Do")
    expect(getByTestId('issue-assignees')).toHaveTextContent("swathi divami")
    expect(getByTestId('issue-description')).toHaveTextContent("test")
    expect(getByTestId('chip-button')).toHaveTextContent("Software")
  })

  it("should get a dropdown upon clicking edit progress icon", async () => {

    render(<CustomIssueDetailsDrawer
      onClose={jest.fn()}
      issue={issueMock}
      issuesList={[issueMock]}
      issueType={[
        "Safety"]}
      issuePriority={["high"]}
      issueStatus={["To Do"]}
      projectUsers={projectUsersMock}
      currentProject={"PRJ201897"}
      currentSnapshot={issueMock}
      currentStructure={issueMock}
      contextInfo={""}
      deleteTheIssu={jest.fn()}
      setIssueList={jest.fn()}
      getIssues={jest.fn()}
    />);

    const editIcon = screen.getByTestId('issue-progress-edit');
    fireEvent.click(editIcon);
    const dropdown = screen.getByTestId('progress-options');
    fireEvent.click(dropdown);
    expect(dropdown).toHaveTextContent("To Do");
    const cancelButton = screen.getByTestId("issue-edit-cancel");
    fireEvent.click(cancelButton);
    const progressLabel = screen.getByTestId("progres-label");
    expect(progressLabel).toHaveTextContent("Progress");

    const editIcon1 = screen.getByTestId('issue-progress-edit');
    fireEvent.click(editIcon1);
    const updateButton = screen.getByTestId("issue-edit-save");
    fireEvent.click(updateButton);
    const progressLabeAgain = screen.getByTestId("progres-label");
    expect(progressLabeAgain).toHaveTextContent("Progress");

  })

  it("should rendeer a autocomplete component upon clicking assignee edit icon", async () => {
    render(<CustomIssueDetailsDrawer
      onClose={jest.fn()}
      issue={issueMock}
      issuesList={[issueMock]}
      issueType={[
        "Safety"]}
      issuePriority={["high"]}
      issueStatus={["To Do"]}
      projectUsers={projectUsersMock}
      currentProject={"PRJ201897"}
      currentSnapshot={issueMock}
      currentStructure={issueMock}
      contextInfo={""}
      deleteTheIssu={jest.fn()}
      setIssueList={jest.fn()}
      getIssues={jest.fn()}
    />);

    const editIcon = screen.getByTestId('issue-assignees-edit');
    fireEvent.click(editIcon);
    const dropdown = screen.getByTestId('assignee-options');
    fireEvent.keyDown(dropdown, { key: 'Enter' });
    const cancelButton = screen.getByTestId("issue-edit-cancel");
    fireEvent.click(cancelButton);
    const progressLabel = screen.getByTestId("progres-label");
    expect(progressLabel).toHaveTextContent("Progress");

    const editIcon1 = screen.getByTestId('issue-assignees-edit');
    fireEvent.click(editIcon1);
    const updateButton = screen.getByTestId("issue-edit-save");
    fireEvent.click(updateButton);
    const progressLabeAgain = screen.getByTestId("assigned-to-label");
    expect(progressLabeAgain).toHaveTextContent("Assigned to");
  })

  it("should rendeer a pop up after clicking on delete icon", async () => {
    const deleteFn = jest.fn()
    render(<CustomIssueDetailsDrawer
      onClose={jest.fn()}
      issue={issueMock}
      issuesList={[issueMock]}
      issueType={[
        "Safety"]}
      issuePriority={["high"]}
      issueStatus={["To Do"]}
      projectUsers={projectUsersMock}
      currentProject={"PRJ201897"}
      currentSnapshot={issueMock}
      currentStructure={issueMock}
      contextInfo={""}
      deleteTheIssue={deleteFn}
      setIssueList={jest.fn()}
      getIssues={jest.fn()}
    />);

    const deleteIcon = screen.getByTestId('delete-icon');
    fireEvent.click(deleteIcon);
    const popup = screen.getByTestId('popup-message');
    expect(popup).toHaveTextContent("ISS371422");
    const deleteButton = screen.getByTestId("delete-popup-button");
    fireEvent.click(deleteButton);
    expect(deleteFn.mock.calls.length).toBe(1);
  });
  it("should be unmount the issue details page after clicking on back arrow icon", () => {

    render(<CustomIssueDetailsDrawer
      onClose={jest.fn()}
      issue={issueMock}
      issuesList={[issueMock]}
      issueType={[
        "Safety"]}
      issuePriority={["high"]}
      issueStatus={["To Do"]}
      projectUsers={projectUsersMock}
      currentProject={"PRJ201897"}
      currentSnapshot={issueMock}
      currentStructure={issueMock}
      contextInfo={""}
      deleteTheIssu={jest.fn()}
      setIssueList={jest.fn()}
      getIssues={jest.fn()}
    />);

    const backArrowIcon = screen.getByTestId('back-arrow');
    fireEvent.click(backArrowIcon);
    const detailsHeader = screen.queryByText('ISS371422');
    expect(detailsHeader).toBeNull();
  });

  it("should be able to edit the issue", () => {

    render(<CustomIssueDetailsDrawer
      onClose={jest.fn()}
      issue={issueMock}
      issuesList={[issueMock]}
      issueType={[
        "Safety"]}
      issuePriority={["high"]}
      issueStatus={["To Do"]}
      projectUsers={projectUsersMock}
      currentProject={"PRJ201897"}
      currentSnapshot={issueMock}
      currentStructure={issueMock}
      contextInfo={""}
      deleteTheIssu={jest.fn()}
      setIssueList={jest.fn()}
      getIssues={jest.fn()}
    />);

    const editIcon = screen.getByTestId('edit-icon');
    fireEvent.click(editIcon);
    const createIssueButton = screen.getByTestId('create-issue-button');
    expect(createIssueButton).toHaveTextContent(/Update/i);
    fireEvent.click(createIssueButton);
  });

  it("should be able add new comment", () => {
    render(<CustomIssueDetailsDrawer
      onClose={jest.fn()}
      issue={issueMock}
      issuesList={[issueMock]}
      issueType={[
        "Safety"]}
      issuePriority={["high"]}
      issueStatus={["To Do"]}
      projectUsers={projectUsersMock}
      currentProject={"PRJ201897"}
      currentSnapshot={issueMock}
      currentStructure={issueMock}
      contextInfo={""}
      deleteTheIssu={jest.fn()}
      setIssueList={jest.fn()}
      getIssues={jest.fn()}
    />);

    const inputEl: any = screen.getByTestId('issue-comment-input').querySelector('input');
    fireEvent.change(inputEl, { target: { value: 'test comment' } });
    const sendButton = screen.getByTestId('issue-comment-send-button');
    fireEvent.click(sendButton);
  });

});
