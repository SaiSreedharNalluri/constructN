import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import FilterCommon from '../components/divami_components/issue-filter-common/IssueFilterCommon';
import * as issuesAPI from "../services/issue"

const issues = [
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



jest.mock("../services/issue", () => {
  return {
    getProjectUsers: jest.fn(() => Promise.resolve({ success: true, result: [] })),
    getIssuesTypes: jest.fn(() => Promise.resolve({ success: true, result: [] })),
    getIssuesPriority: jest.fn(() => Promise.resolve({ success: true, result: [] })),
    getIssuesStatus: jest.fn(() => Promise.resolve({ success: true, result: [] })),
  };
});

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
    // const onCloseMock = jest.fn((x = false) => !x)
    render(
      <FilterCommon
        closeFilterOverlay={closeFitlerOverlay}
        issuesList={issues}
        visibility={false}
        closeOverlay={jest.fn()}
        handleOnFilter={jest.fn()}
        onClose={closeFitlerOverlay}
        handleOnSort={() => { }}
        deleteTheIssue={() => { }}
        clickIssueEditSubmit={() => { }}
        issueFilterState={mockFilteredIssues}
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


  it('should render issue filter screen1', () => {
    const mockFilteredIssues = {
      "isFilterApplied": true,
      "filterData": {
        "issueTypeData": [
          "Building code", "Building code", "Building code", "Building code", "Building code"
        ],
        "issuePriorityData": ["1", "2", "3"],
        "issueStatusData": ["1", "2", "3", "4"],
        "assigneesData": null,
        "toDate": ""
      },
      "numberOfFilters": 0
    }
    const closeFitlerOverlay = jest.fn();
    // const onCloseMock = jest.fn((x = false) => !x)
    render(
      <FilterCommon
        closeFilterOverlay={closeFitlerOverlay}
        issuesList={issues}
        visibility={false}
        closeOverlay={jest.fn()}
        handleOnFilter={jest.fn()}
        onClose={closeFitlerOverlay}
        handleOnSort={() => { }}
        deleteTheIssue={() => { }}
        clickIssueEditSubmit={() => { }}
        issueFilterState={mockFilteredIssues}
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

  it('should render issue filter screen2', () => {
    const mockFilteredIssues = {
      "isFilterApplied": true,
      "filterData": {
        "issueTypeData": [
          "Building code", "Building code", "Building code", "Building code"
        ],
        "issuePriorityData": ["1"],
        "issueStatusData": ["1", "2", "3"],
        "assigneesData": null,
        "toDate": ""
      },
      "numberOfFilters": 0
    }
    const closeFitlerOverlay = jest.fn();
    // const onCloseMock = jest.fn((x = false) => !x)
    render(
      <FilterCommon
        closeFilterOverlay={closeFitlerOverlay}
        issuesList={issues}
        visibility={false}
        closeOverlay={jest.fn()}
        handleOnFilter={jest.fn()}
        onClose={closeFitlerOverlay}
        handleOnSort={() => { }}
        deleteTheIssue={() => { }}
        clickIssueEditSubmit={() => { }}
        issueFilterState={mockFilteredIssues}
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

    const selectAllCheckbox = screen.getByTestId('filter-select-all');
    fireEvent.click(selectAllCheckbox);

    const selectEachCheckbox = screen.getByTestId('filter-select-each');
    fireEvent.click(selectEachCheckbox, {
      target: {
        index: 1, item: {
          "0": "L",
          "1": "o",
          "2": "w",
          "optionTitle": "Low",
          "optionStatus": "F"
        }
      }
    });
  });
});