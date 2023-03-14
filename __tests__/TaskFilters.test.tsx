import '@testing-library/jest-dom';
import { fireEvent, render, screen, within } from '@testing-library/react';
import TaskFilterCommon from '../components/divami_components/task-filter-common/TaskFilterCommon';
import * as API from "../services/project"

const tasksList = [
  {
    "_id": "ISS371422",
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
      "Plumbing",
      "Software"
    ],
    "createdAt": "2023-03-01T10:09:31.422Z",
    "updatedAt": "2023-03-01T10:09:31.422Z",
    "attachments": []
  },
  {
    "_id": "ISS580216",
    "title": "ut",
    "description": "ut",
    "type": "Clash",
    "status": "To Do",
    "priority": "Low",
    "assignees": [
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
          "x": 385386.02206552675,
          "y": 2049795.8348308539,
          "z": 106
        }
      }
    },
    "progress": -1,
    "sequenceNumber": 410,
    "startDate": "2023-03-14T18:30:00.000Z",
    "dueDate": "2023-03-15T18:30:00.000Z",
    "tags": [
      "Electrical"
    ],
    "createdAt": "2023-03-01T11:03:00.216Z",
    "updatedAt": "2023-03-01T11:03:00.216Z",
    "attachments": []
  },
]

jest.mock("../services/task.ts", () => {
  return {
    getTasksTypes: jest.fn(() => Promise.resolve({ success: true, result: ["Transmittals", "Submittals", "RFI"] })),
    getTasksPriority: jest.fn(() => Promise.resolve({ success: true, result: ["High", "Low", "Medium"] })),
    getTaskStatus: jest.fn(() => Promise.resolve({ success: true, result: ["To Do", "Blocked", "In Progress", "Completed"] })),
  };
});

// jest.mock("../services/project.ts", () => {
//   return {
//     getProjectUsers: jest.fn(() => Promise.resolve({ success: true, result: [] })),
//   };
// });
jest.mock('../services/project', () => {
  return {
    __esModule: true,
    ...jest.requireActual('../services/project')
  };
});

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

jest.mock('next/router', () => ({
  route: '/',
  pathname: '',
  query: { projectId: '1234' },
  isReady: true,
  asPath: '',
  push: jest.fn(),
  events: {
    on: jest.fn(),
    off: jest.fn()
  },
  beforePopState: jest.fn(() => null),
  prefetch: jest.fn(() => null)
}));

describe('IssueFilter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render issue filter screen', () => {
    const mockFilteredIssues = {
      "isFilterApplied": false,
      "filterData": {},
      "numberOfFilters": 0
    }
    const closeFitlerOverlay = jest.fn();
    render(
      <TaskFilterCommon
        tasksList={tasksList}
        closeTaskFilterOverlay={closeFitlerOverlay}
        handleOnFilter={jest.fn()}
        onClose={closeFitlerOverlay}
        taskFilterState={mockFilteredIssues}
      />
    )

    const filterTitleHeader = screen.queryByText(/Filters/i);
    expect(filterTitleHeader).toBeInTheDocument();
    const closeIcon = screen.getByTestId('filter-close');
    fireEvent.click(closeIcon);
    expect(closeFitlerOverlay).toBeCalled();
    const resetButton = screen.getByTestId('filter-refresh');
    fireEvent.click(resetButton);
    expect(closeFitlerOverlay).toBeCalled();
    const applyFilterButton = screen.getByTestId('filter-apply');
    fireEvent.click(applyFilterButton);
    expect(closeFitlerOverlay).toBeCalled();
    const cancelFilterButton = screen.getByTestId('filter-cancel');
    fireEvent.click(cancelFilterButton);
    expect(closeFitlerOverlay).toBeCalled();

  });


  it('should render issue filter screen with filter options', () => {
    const mockFilteredIssues = {
      "isFilterApplied": true,
      "filterData": {
        "taskType": [
          "1", "2", "3"
        ],
        "taskPriority": ["1", "2", "3"],
        "taskStatus": ["1", "2"],
        "assigneesData": null,
        "toDate": ""
      },
      "numberOfFilters": 0
    }
    const closeFitlerOverlay = jest.fn();
    render(
      <TaskFilterCommon
        tasksList={tasksList}
        closeTaskFilterOverlay={closeFitlerOverlay}
        handleOnFilter={jest.fn()}
        onClose={closeFitlerOverlay}
        taskFilterState={mockFilteredIssues}
      />
    )

    const filterTitleHeader = screen.queryByText(/Filters/i);
    expect(filterTitleHeader).toBeInTheDocument();

    const closeIcon = screen.getByTestId('filter-close');
    fireEvent.click(closeIcon);
    expect(closeFitlerOverlay).toBeCalled();

    const resetButton = screen.getByTestId('filter-refresh');
    fireEvent.click(resetButton);

    const applyFilterButton = screen.getByTestId('filter-apply');
    fireEvent.click(applyFilterButton);


    const cancelFilterButton = screen.getByTestId('filter-cancel');
    fireEvent.click(cancelFilterButton);
    expect(closeFitlerOverlay).toBeCalled();


  });

  it('should render issue filter screen with a different mock data', () => {
    const mockFilteredIssues = {
      "isFilterApplied": true,
      "filterData": {
        "taskType": [
          "Building code", "Building code", "Building code", "Building code", "Building code"
        ],
        "taskPriority": ["1", "2", "3"],
        "taskStatus": ["1", "2", "3", "4"],
        "assigneesData": null,
        "toDate": ""
      },
      "numberOfFilters": 0
    }
    const closeFitlerOverlay = jest.fn();
    // const onCloseMock = jest.fn((x = false) => !x)
    render(
      <TaskFilterCommon
        tasksList={tasksList}
        closeTaskFilterOverlay={closeFitlerOverlay}
        handleOnFilter={jest.fn()}
        onClose={closeFitlerOverlay}
        taskFilterState={mockFilteredIssues}
      />
    )

    const filterTitleHeader = screen.queryByText(/Filters/i);
    expect(filterTitleHeader).toBeInTheDocument();

    const closeIcon = screen.getByTestId('filter-close');
    fireEvent.click(closeIcon);
    expect(closeFitlerOverlay).toBeCalled();

    const resetButton = screen.getByTestId('filter-refresh');
    fireEvent.click(resetButton);
    expect(closeFitlerOverlay).toBeCalled();

    const applyFilterButton = screen.getByTestId('filter-apply');
    fireEvent.click(applyFilterButton);
    expect(closeFitlerOverlay).toBeCalled();

    const cancelFilterButton = screen.getByTestId('filter-cancel');
    fireEvent.click(cancelFilterButton);
    expect(closeFitlerOverlay).toBeCalled();

    const selectAllCheckbox = screen.getByTestId('filter-select-all');
    fireEvent.click(selectAllCheckbox);
    expect(selectAllCheckbox).toHaveAttribute("alt", 'unchecked checkbox');

    const selectEachCheckbox = screen.getAllByTestId('filter-select-each');
    fireEvent.click(selectEachCheckbox[0], {});
    expect(selectEachCheckbox[0]).toHaveAttribute("alt", 'checked checkbox');
  });

});