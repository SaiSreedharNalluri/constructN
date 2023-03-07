import CustomTaskDetailsDrawer from "../components/divami_components/task_detail/TaskDetail"
import { ISnapshot } from "../models/ISnapshot";
import Moment from "moment";
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

// jest.mock('next/router', () => ({
//   route: '/',
//   pathname: '',
//   query: { projectId: '1234' },
//   isReady: true,
//   asPath: '',
//   push: jest.fn(),
//   events: {
//     on: jest.fn(),
//     off: jest.fn()
//   },
//   beforePopState: jest.fn(() => null),
//   prefetch: jest.fn(() => null)
// }));

jest.mock("../services/task", () => {
  return {
    updateTask: jest.fn(() => Promise.resolve({ success: true, result: [] })),
  };
});

jest.mock("../services/comments", () => {
  return {
    createComment: jest.fn(() => Promise.resolve({ success: true, result: [] })),
  };
});

describe('TaskDetails', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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

  const currentSnapshot: ISnapshot = {
    createdAt: "2023-01-24T15:23:40.031Z",
    date: "2023-1-06",
    progress: -1,
    project: "PRJ201897",
    reality: [
      {
        capture: "CAP820581",
        completedDateTime: "2023-01-30T04:55:02.797Z",
        // createdAt :"2023-01-30T04:55:05.466Z",
        job: "JOB820391",
        mode: "Drone Image",
        snapshot: "SNP820031",
        status: "active",
        type: "exterior",
        // updatedAt:"2023-01-30T04:55:05.466Z",
        _id: "RLT832872"
      }
    ],
    status: "Inactive",
    structure: "STR536138",
    updatedAt: "2023-01-30T04:55:05.466Z",
    // visualizations:[]
  }

  const structure = {
    "_id": "STR664865",
    "name": "1_Floor_A3_Block",
    "type": "Interior",
    "isExterior": false,
    "project": "PRJ201897",
    "parent": "STR536138",
    "children": [],
    "location": [],
    "designs": [
      {
        "_id": "DSG638729",
        "type": "Plan Drawings",
        "name": "floormap.pdf",
        "project": "PRJ201897",
        "structure": "STR664865",
        "storage": [
          {
            "provider": "constructn-oss",
            "path": "PRJ201897/structures/STR664865/designs/DSG638729/floormap.pdf",
            "providerType": "internal",
            "format": ".PDF"
          },
          {
            "provider": "autodesk-oss",
            "pathId": "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWRoYW5pX2tvcmVnYW9uX3BhcmtfcHVuZS8lMkZQUkoyMDE4OTclMkZzdHJ1Y3R1cmVzJTJGU1RSNjY0ODY1JTJGZGVzaWducyUyRkRTRzYzODcyOSUyRkEzLUYxLnBkZg",
            "providerType": "external",
            "format": ".SVF2"
          }
        ],
        "createdAt": "2023-02-09T12:38:46.704Z",
        "updatedAt": "2023-02-09T12:38:46.704Z",
        "__v": 0,
        "tm": {
          "tm": [
            4.201579,
            0.574277,
            0,
            385366.46875,
            -0.574277,
            4.201579,
            0,
            2049775.125,
            0,
            0,
            4.240644,
            0,
            0,
            0,
            0,
            1
          ],
          "offset": [
            0,
            0,
            100
          ]
        }
      },
      {
        "_id": "DSG740607",
        "type": "BIM",
        "name": "Block A3.rvt",
        "project": "PRJ201897",
        "structure": "STR664865",
        "storage": [
          {
            "provider": "constructn-oss",
            "path": "PRJ201897/structures/STR664865/designs/DSG740607/Block A3.rvt",
            "providerType": "internal",
            "format": ".RVT"
          },
          {
            "provider": "autodesk-oss",
            "pathId": "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWRoYW5pX2tvcmVnYW9uX3BhcmtfcHVuZS8lMkZQUkoyMDE4OTclMkZzdHJ1Y3R1cmVzJTJGU1RSNTM2MTM4JTJGZGVzaWducyUyRkRTRzIzNDI5MyUyRmFkaGFuaV9hM19ibG9jay5ydnQ",
            "providerType": "external",
            "format": ".SVF2"
          }
        ],
        "createdAt": "2023-02-09T12:38:46.704Z",
        "updatedAt": "2023-02-09T12:38:46.704Z",
        "__v": 0,
        "tm": {
          "tm": [
            -0.136552,
            0.992896,
            0,
            385382.75,
            -0.992896,
            -0.136552,
            0,
            2049802,
            0,
            0,
            1.002242,
            95.249374,
            0,
            0,
            0,
            1
          ],
          "offset": [
            385383.538,
            2049820.99,
            100
          ],
          "properties_child": [
            "IfcGUID",
            "IfcGUID"
          ],
          "properties_head": [
            "IFC Parameters"
          ]
        }
      }
    ],
    "createdAt": "2023-01-24T10:04:24.865Z",
    "updatedAt": "2023-02-09T12:38:46.704Z",
    "__v": 0
  }

  const mockTask = {
    "_id": "TSK557956",
    "title": "Siva",
    "description": "",
    "type": "Transmittals",
    "status": "To Do",
    "priority": "High",
    "assignees": [
      {
        "_id": "USR370060",
        "firstName": "swathi",
        "lastName": "divami",
        "email": "swathi@divami.com",
        "fullName": "swathi divami"
      },
      {
        "_id": "USR370060",
        "firstName": "swathi",
        "lastName": "divami",
        "email": "swathi@divami.com",
        "fullName": "swathi divami"
      }
    ],
    "owner": {
      "_id": "USR370060",
      "firstName": "swathi",
      "lastName": "divami",
      "fullName": "swathi divami"
    },
    "project": "PRJ201897",
    "structure": "STR654406",
    "snapshot": "SNP746698",
    "context": {
      "id": "Temp Task",
      "type": "Task",
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
          "x": 385397.5663064057,
          "y": 2049801.8890134313,
          "z": 106
        }
      }
    },
    "progress": -1,
    "sequenceNumber": 422,
    "tags": [],
    "createdAt": "2023-03-02T07:02:37.956Z",
    "updatedAt": "2023-03-02T07:02:38.306Z",
    "screenshot": "https://constructn-attachments-dev.s3.ap-south-1.amazonaws.com/TSK/TSK557956/1677740557665-screenshot.png",
    "attachments": [
      {
        "_id": "ATT558297",
        "name": "Screenshot 2023-02-27 at 2.32.16 PM.png",
        "url": "https://constructn-attachments-dev.s3.ap-south-1.amazonaws.com/TSK/TSK557956/1677740557633-Screenshot%202023-02-27%20at%202.32.16%20PM.png",
        "entity": "TSK557956",
        "createdAt": "2023-03-02T07:02:38.296Z",
        "updatedAt": "2023-03-02T07:02:38.296Z"
      }
    ]
  }

  it('should render correctly', () => {
    const { getByTestId } = render(<CustomTaskDetailsDrawer
      taskList={[mockTask]}
      task={mockTask}
      onClose={jest.fn()}
      taskType={"Transmittals"}
      taskPriority={"High"}
      taskStatus={["To Do"]}
      projectUsers={[...mockTask.assignees]}
      deleteTheTask={jest.fn()}
      currentProject={"PRJ201897"}
      currentStructure={structure}
      currentSnapshot={currentSnapshot}
      contextInfo={{ type: 'Task' }}
      getTasks={jest.fn()}
      deleteTheAttachment={jest.fn()}
    />)

    expect(getByTestId('task-detail-header')).toHaveTextContent("Transmittals");
    expect(getByTestId('task-detail-header')).toHaveTextContent("422");
    expect(getByTestId('task-title')).toHaveTextContent("Siva");
    expect(getByTestId('task-priority')).toHaveTextContent("High");
    expect(getByTestId('task-captured')).toHaveTextContent(Moment("2023-03-02T07:02:37.956Z").format("DD MMM YY"))
    expect(getByTestId('task-progress')).toHaveTextContent("To Do")
  });

  it('should be unmount the issue details page after clicking on back arrow icon', () => {
    render(<CustomTaskDetailsDrawer
      taskList={[mockTask]}
      task={mockTask}
      onClose={jest.fn()}
      taskType={"Transmittals"}
      taskPriority={"High"}
      taskStatus={["To Do"]}
      projectUsers={[...mockTask.assignees]}
      deleteTheTask={jest.fn()}
      currentProject={"PRJ201897"}
      currentStructure={structure}
      currentSnapshot={currentSnapshot}
      contextInfo={{ type: 'Task' }}
      getTasks={jest.fn()}
      deleteTheAttachment={jest.fn()}
    />)

    const detailsHeader = screen.queryByText('TSK557956');
    expect(detailsHeader).toBeNull();
    const backArrowIcon = screen.getByTestId('back-arrow');
    fireEvent.click(backArrowIcon);
    const detailsHeader1 = screen.queryByText('TSK557956');
    expect(detailsHeader1).toBeNull();
  });

  it('should be unmount the issue details page after clicking on back arrow icon', () => {
    render(<CustomTaskDetailsDrawer
      taskList={[mockTask]}
      task={mockTask}
      onClose={jest.fn()}
      taskType={"Transmittals"}
      taskPriority={"High"}
      taskStatus={["To Do"]}
      projectUsers={[...mockTask.assignees]}
      deleteTheTask={jest.fn()}
      currentProject={"PRJ201897"}
      currentStructure={structure}
      currentSnapshot={currentSnapshot}
      contextInfo={{ type: 'Task' }}
      getTasks={jest.fn()}
      deleteTheAttachment={jest.fn()}
    />)

    const detailsHeader = screen.queryByText('TSK557956');
    expect(detailsHeader).toBeNull();
    const backArrowIcon = screen.getByTestId('back-arrow');
    fireEvent.click(backArrowIcon);
    const detailsHeader1 = screen.queryByText('TSK557956');
    expect(detailsHeader1).toBeNull();
  });

  it('should get a dropdown upon clicking edit progress icon', () => {
    render(<CustomTaskDetailsDrawer
      taskList={[mockTask]}
      task={mockTask}
      onClose={jest.fn()}
      taskType={"Transmittals"}
      taskPriority={"High"}
      taskStatus={["To Do"]}
      projectUsers={[...mockTask.assignees]}
      deleteTheTask={jest.fn()}
      currentProject={"PRJ201897"}
      currentStructure={structure}
      currentSnapshot={currentSnapshot}
      contextInfo={{ type: 'Task' }}
      getTasks={jest.fn()}
      deleteTheAttachment={jest.fn()}
    />)

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
  });
  it('should rendeer a autocomplete component upon clicking assignee edit icon', () => {
    render(<CustomTaskDetailsDrawer
      taskList={[mockTask]}
      task={mockTask}
      onClose={jest.fn()}
      taskType={"Transmittals"}
      taskPriority={"High"}
      taskStatus={["To Do"]}
      projectUsers={[...mockTask.assignees]}
      deleteTheTask={jest.fn()}
      currentProject={"PRJ201897"}
      currentStructure={structure}
      currentSnapshot={currentSnapshot}
      contextInfo={{ type: 'Task' }}
      getTasks={jest.fn()}
      deleteTheAttachment={jest.fn()}
    />)

    const editIcon = screen.getByTestId('assignees-edit');
    fireEvent.click(editIcon);
    const dropdown = screen.getByTestId('assignee-options');
    fireEvent.keyDown(dropdown, { key: 'Enter' });
    const cancelButton = screen.getByTestId("issue-edit-cancel");
    fireEvent.click(cancelButton);
    const progressLabel = screen.getByTestId("progres-label");
    expect(progressLabel).toHaveTextContent("Progress");

    const editIcon1 = screen.getByTestId('assignees-edit');
    fireEvent.click(editIcon1);
    const updateButton = screen.getByTestId("issue-edit-save");
    fireEvent.click(updateButton);
    const progressLabeAgain = screen.getByTestId("assigned-to-label");
    expect(progressLabeAgain).toHaveTextContent("Assigned to");
  });

  it('should rendeer a pop up after clicking on delete icon', () => {
    const deleteFn = jest.fn();
    render(<CustomTaskDetailsDrawer
      taskList={[mockTask]}
      task={mockTask}
      onClose={jest.fn()}
      taskType={"Transmittals"}
      taskPriority={"High"}
      taskStatus={["To Do"]}
      projectUsers={[...mockTask.assignees]}
      deleteTheTask={deleteFn}
      currentProject={"PRJ201897"}
      currentStructure={structure}
      currentSnapshot={currentSnapshot}
      contextInfo={{ type: 'Task' }}
      getTasks={jest.fn()}
      deleteTheAttachment={jest.fn()}
    />)

    const deleteIcon = screen.getByTestId('delete-icon');
    fireEvent.click(deleteIcon);
    const popup = screen.getByTestId('popup-message');
    expect(popup).toHaveTextContent("TSK557956");
    const deleteButton = screen.getByTestId("delete-popup-button");
    fireEvent.click(deleteButton);
    expect(deleteFn.mock.calls.length).toBe(1);

  });

  it('should be able to edit the task', () => {
    const deleteFn = jest.fn();
    render(<CustomTaskDetailsDrawer
      taskList={[mockTask]}
      task={mockTask}
      onClose={jest.fn()}
      taskType={"Transmittals"}
      taskPriority={"High"}
      taskStatus={["To Do"]}
      projectUsers={[...mockTask.assignees]}
      deleteTheTask={deleteFn}
      currentProject={"PRJ201897"}
      currentStructure={structure}
      currentSnapshot={currentSnapshot}
      contextInfo={{ type: 'Task' }}
      getTasks={jest.fn()}
      deleteTheAttachment={jest.fn()}
    />)

    const editIcon = screen.getByTestId('edit-icon');
    fireEvent.click(editIcon);
    const createIssueButton = screen.getByTestId('create-issue-button');
    expect(createIssueButton).toHaveTextContent(/Update/i);
    fireEvent.click(createIssueButton);
  });

  it('should be able add new comment', () => {
    const deleteFn = jest.fn();
    render(<CustomTaskDetailsDrawer
      taskList={[mockTask]}
      task={mockTask}
      onClose={jest.fn()}
      taskType={"Transmittals"}
      taskPriority={"High"}
      taskStatus={["To Do"]}
      projectUsers={[...mockTask.assignees]}
      deleteTheTask={deleteFn}
      currentProject={"PRJ201897"}
      currentStructure={structure}
      currentSnapshot={currentSnapshot}
      contextInfo={{ type: 'Task' }}
      getTasks={jest.fn()}
      deleteTheAttachment={jest.fn()}
    />)

    const inputEl: any = screen.getByTestId('issue-comment-input').querySelector('input');
    fireEvent.change(inputEl, { target: { value: 'test comment' } });
    const sendButton = screen.getByTestId('issue-comment-send-button');
    fireEvent.click(sendButton);
  });
});