import '@testing-library/jest-dom';
import { fireEvent, render, screen } from "@testing-library/react";
import CreateTask from "../components/divami_components/create-task/CreateTask";
import { ISnapshot } from '../models/ISnapshot';
import * as API from "../services/project"

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

const contextInfo = {
  id: "Temp Issue",
  type: "Issue",
  cameraObject: {
    cameraPosition: {
      x: 385387.185919544,
      y: 2049797.3090976952,
      z: 159.85971788829193
    },
    cameraTarget: {
      x: 385387.185919544,
      y: 2049797.309151555,
      z: 106
    }
  },
  tag: {
    tagPosition: {
      x: 385387.06263203063,
      y: 2049799.0813983465,
      z: 106
    }
  }
}

const currentStructure = {
  _id: "STR654406",
  name: "3_Floor_A3_Block",
  type: "Interior",
  isExterior: false,
  project: "PRJ201897",
  parent: "STR536138",
  children: [],
  location: [],
  designs: [
    {
      _id: "DSG812951",
      type: "Plan Drawings",
      name: "floormap.pdf",
      project: "PRJ201897",
      structure: "STR654406",
      storage: [
        {
          provider: "constructn-oss",
          path: "PRJ201897/structures/STR654406/designs/DSG812951/floormap.pdf",
          providerType: "internal",
          format: ".PDF"
        },
        {
          provider: "autodesk-oss",
          pathId: "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWRoYW5pX2tvcmVnYW9uX3BhcmtfcHVuZS8lMkZQUkoyMDE4OTclMkZzdHJ1Y3R1cmVzJTJGU1RSNjU0NDA2JTJGZGVzaWducyUyRkRTRzgxMjk1MSUyRkEzLUYzLnBkZg",
          providerType: "external",
          format: ".SVF2"
        }
      ],
      createdAt: "2023-02-09T12:39:24.079Z",
      updatedAt: "2023-02-09T12:39:24.079Z",
      __v: 0,
      tm: {
        tm: [
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
        offset: [
          0,
          0,
          106
        ]
      }
    },
    {
      _id: "DSG783371",
      type: "BIM",
      name: "Block A3.rvt",
      project: "PRJ201897",
      structure: "STR654406",
      storage: [
        {
          provider: "constructn-oss",
          path: "PRJ201897/structures/STR654406/designs/DSG783371/Block A3.rvt",
          providerType: "internal",
          format: ".RVT"
        },
        {
          provider: "autodesk-oss",
          pathId: "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWRoYW5pX2tvcmVnYW9uX3BhcmtfcHVuZS8lMkZQUkoyMDE4OTclMkZzdHJ1Y3R1cmVzJTJGU1RSNTM2MTM4JTJGZGVzaWducyUyRkRTRzIzNDI5MyUyRmFkaGFuaV9hM19ibG9jay5ydnQ",
          providerType: "external",
          format: ".SVF2"
        }
      ],
      createdAt: "2023-02-09T12:39:24.079Z",
      updatedAt: "2023-02-09T12:39:24.079Z",
      __v: 0,
      tm: {
        tm: [
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
        offset: [
          385383.538,
          2049820.99,
          106
        ],
        properties_child: [
          "IfcGUID",
          "IfcGUID"
        ],
        properties_head: [
          "IFC Parameters"
        ]
      }
    }
  ],
  createdAt: "2023-01-24T10:20:54.406Z",
  updatedAt: "2023-02-09T12:39:24.079Z",
  __v: 0
}

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

jest.mock("../services/tags.ts", () => ({
  getTagsList: jest.fn(() => Promise.resolve({ success: true, result: ["siva", "batman"] })),
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

jest.mock("../services/task.ts", () => ({
  getTasksTypes: jest.fn(() => Promise.resolve({ success: true, result: ["siva", "batman"] })),
  getTasksPriority: jest.fn(() => Promise.resolve({ success: true, result: ["siva", "batman"] })),
  getTaskStatus: jest.fn(() => Promise.resolve({ success: true, result: ["siva", "batman"] })),
}))

describe('CreateIssue', () => {
  it('should render the component', () => {
    const handleCreateTask = jest.fn();
    const onCancelCreate = jest.fn();
    render(<CreateTask
      handleCreateTask={handleCreateTask}
      currentProject={"PRJ201897"}
      currentSnapshot={currentSnapshot}
      currentStructure={currentStructure}
      contextInfo={contextInfo}
      closeIssueCreate={onCancelCreate}
      onCancelCreate={onCancelCreate}
    />);
    expect(screen.getByText('Create Task')).toBeInTheDocument();
    const closeIcon = screen.getByTestId('const-custom-drawer-close-icon');
    fireEvent.click(closeIcon);
    const popUp = screen.getByText('Are you sure you want to cancel create task?');
    expect(popUp).toBeInTheDocument();
    const cancelBtn = screen.getByTestId('CancelBtn');
    fireEvent.click(cancelBtn, { target: { event: "Cancel" } });
    const submitBtn = screen.getByTestId('createButton');
    fireEvent.click(submitBtn, { target: { event: "Submit" } });
  });

  it('should render the component', () => {
    const handleCreateTask = jest.fn();
    const onCancelCreate = jest.fn();
    render(<CreateTask
      handleCreateTask={handleCreateTask}
      currentProject={"PRJ201897"}
      currentSnapshot={currentSnapshot}
      currentStructure={currentStructure}
      contextInfo={contextInfo}
      closeTaskCreate={onCancelCreate}
      onCancelCreate={onCancelCreate}
      editData={["siva"]}
    />);
    const closeIcon = screen.getByTestId('const-custom-drawer-close-icon');
    fireEvent.click(closeIcon);
    const popUp = screen.getByText('Are you sure you want to cancel edit task?');
    expect(popUp).toBeInTheDocument();
    const cancelBtn = screen.getByTestId('CancelBtn');
    fireEvent.click(cancelBtn, { target: { event: "Cancel" } });
    const popCancelBtn = screen.getByTestId('closePopup');
    fireEvent.click(popCancelBtn, {});
    const cancelBtnAgain = screen.getByTestId('CancelBtn');
    fireEvent.click(cancelBtnAgain, { target: { event: "Cancel" } });
    const submitBtn = screen.getByTestId('closeWindow');
    fireEvent.click(submitBtn, {});

    const titleEl = screen.getByTestId("inputTextField");
    expect(titleEl).toBeInTheDocument();
    fireEvent.change(titleEl, { target: { value: "siva" } });
  });

});
