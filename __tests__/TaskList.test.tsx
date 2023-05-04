import { fireEvent, render, screen } from "@testing-library/react";
import { ISnapshot } from "../models/ISnapshot";
import '@testing-library/jest-dom';
import CustomIssueListDrawer from "../components/divami_components/issue-listing/IssueList";
import { Issue } from "../models/Issue";
import CustomTaskListDrawer from "../components/divami_components/task_list/TaskList";
import TaskList from "../components/divami_components/task_list/TaskList";


const currentSnapshot: ISnapshot = {
    createdAt:"2023-01-24T15:23:40.031Z",
date:"2023-1-06",
progress:-1,
project:"PRJ201897",
reality:[
    {capture:"CAP820581",
    completedDateTime :"2023-01-30T04:55:02.797Z",
    // createdAt :"2023-01-30T04:55:05.466Z",
    job :"JOB820391",
    mode :"Drone Image",
    snapshot   :    "SNP820031",
    status :"active",
    type:"exterior",
    // updatedAt:"2023-01-30T04:55:05.466Z",
    _id :"RLT832872"}
],
status:"Inactive",
structure:"STR536138",
updatedAt:"2023-01-30T04:55:05.466Z",
// visualizations:[]
}
const str={
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
const issues = [
    {
      "_id": "TSK557956",
      "title": "task_1",
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
    },
    {
      "_id": "TSK724881",
      "title": "Task",
      "description": "csdc",
      "type": "Submittals",
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
            "x": 385381.6360181819,
            "y": 2049799.3878389273,
            "z": 106
          }
        }
      },
      "progress": -1,
      "sequenceNumber": 425,
      "tags": [],
      "createdAt": "2023-03-02T08:12:04.881Z",
      "updatedAt": "2023-03-02T08:12:04.881Z",
      "attachments": []
    },
    {
      "_id": "TSK821452",
      "title": "Task",
      "description": "Testing Assign",
      "type": "Submittals",
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
            "x": 385383.08423083014,
            "y": 2049807.1806022697,
            "z": 106
          }
        }
      },
      "progress": -1,
      "sequenceNumber": 426,
      "tags": [],
      "createdAt": "2023-03-02T08:13:41.452Z",
      "updatedAt": "2023-03-02T08:13:41.452Z",
      "attachments": []
    },
    {
      "_id": "TSK975065",
      "title": "Task",
      "description": "description",
      "type": "RFI",
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
            "x": 385389.22189395817,
            "y": 2049809.3184400008,
            "z": 106
          }
        }
      },
      "progress": -1,
      "sequenceNumber": 429,
      "tags": [],
      "createdAt": "2023-03-02T09:39:35.064Z",
      "updatedAt": "2023-03-02T09:39:35.064Z",
      "attachments": []
    },
    {
      "_id": "TSK056780",
      "title": "Task",
      "description": "Description ",
      "type": "RFI",
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
            "x": 385392.1872817616,
            "y": 2049806.7669329506,
            "z": 106
          }
        }
      },
      "progress": -1,
      "sequenceNumber": 430,
      "tags": [],
      "createdAt": "2023-03-02T09:40:56.779Z",
      "updatedAt": "2023-03-02T09:40:56.779Z",
      "attachments": []
    }
  ]
jest.mock('next/router', () => ({
            route: '/',
            pathname: '',
            query: { projectId: '1234' },
            isReady:true,
            asPath: '',
            push: jest.fn(),
            events: {
              on: jest.fn(),
              off: jest.fn()
            },
            beforePopState: jest.fn(() => null),
            prefetch: jest.fn(() => null)
      }));

  
    
    it("renders component with empty issue list", () => {    
        const { container } = 
        render(<TaskList
            tasksList={issues}
            taskMenuClicked={jest.fn()}
            currentProject={"PRJ201897"}
            currentStructure={str}
            currentSnapshot={currentSnapshot}
            contextInfo={{type: 'Task'}}
            closeTaskFilterOverlay={jest.fn()}
            handleOnTaskFilter={jest.fn()}
            onClose={jest.fn()}
            deleteTheTask={jest.fn()}
            taskFilterState={{
                isFilterApplied: false,
                filterData: {},
                numberOfFilters: 0,
              }}
            getTasks={jest.fn()}
            handleOnTasksSort={jest.fn()}
            deleteTheAttachment={jest.fn()}
          />)
        expect(container).toMatchSnapshot();
        expect(screen.getByText("Task List")).toBeInTheDocument();
            const s = screen.getByTestId('search-icon');
            fireEvent.click(s);
            const search = screen.getAllByPlaceholderText('Search');
            fireEvent.change(search[0],{target:{value:'A'}});
            expect(search[0]).toBeInTheDocument();
            fireEvent.click(screen.getByTestId("search-close"))
            fireEvent.click(screen.getAllByTestId('item-body')[0])
            const closeIcon = screen.getByTestId('close-icon')
            fireEvent.click(closeIcon);
            // expect(screen.getByText("Task List")).not.toBeInTheDocument();
    });
    it("renders component with empty issue list", () => {    
        const { container } = 
        render(<TaskList
            tasksList={[]}
            taskMenuClicked={jest.fn()}
            currentProject={"PRJ201897"}
            currentStructure={str}
            currentSnapshot={currentSnapshot}
            contextInfo={{type: 'Task'}}
            closeTaskFilterOverlay={jest.fn()}
            handleOnTaskFilter={jest.fn()}
            onClose={jest.fn()}
            deleteTheTask={jest.fn()}
            taskFilterState={{
                isFilterApplied: true,
                filterData: {},
                numberOfFilters: 0,
              }}
            getTasks={jest.fn()}
            handleOnTasksSort={jest.fn()}
            deleteTheAttachment={jest.fn()}
          />)
        expect(container).toMatchSnapshot();
        
    });
    it('renders component with data',() => {
        const { container } = render(<TaskList
            tasksList={issues}
            taskMenuClicked={jest.fn()}
            currentProject={"PRJ201897"}
            currentStructure={str}
            currentSnapshot={currentSnapshot}
            contextInfo={{type: 'Task'}}
            closeTaskFilterOverlay={jest.fn()}
            handleOnTaskFilter={jest.fn()}
            onClose={jest.fn()}
            deleteTheTask={jest.fn()}
            taskFilterState={{
                isFilterApplied: false,
                filterData: {},
                numberOfFilters: 0,
              }}
            getTasks={jest.fn()}
            handleOnTasksSort={jest.fn()}
            deleteTheAttachment={jest.fn()}
          />)
          const sort = screen.getByTestId("sort")
          fireEvent.click(sort);
          expect(screen.getByText("Status ( To Do - Completed)")).toBeInTheDocument()
          const sortitem = screen.getAllByTestId("sort-menu-item");
          fireEvent.click(sortitem[0])
          const download = screen.getByTestId("download");
          fireEvent.click(download)
          
          const filter = screen.getByTestId("filter");
          fireEvent.click(filter)
          expect(screen.getByText("Filters")).toBeInTheDocument()
          fireEvent.click(screen.getByTestId("filter-close"))
          expect(screen.getByText("Task List")).toBeInTheDocument()
    });

    // it('check on click functionalities',() => {
    //     render(
    //         <CustomTaskListDrawer
    //                 closeFilterOverlay={()=>{}}
    //                 issuesList={issues as unknown as Issue[]}
    //                 visibility={false}
    //                 closeOverlay={jest.fn()}
    //                 handleOnFilter={jest.fn()}
    //                 onClose={jest.fn()}
    //                 handleOnSort={jest.fn()}
    //                 deleteTheIssue={()=>{}}
    //                 clickIssueEditSubmit={jest.fn()}
    //                 issuePriorityList={ ['High', 'Low', 'Medium']}
    //                 issueStatusList={['Blocked', 'To Do', 'In Progress', 'Completed']}
    //                 currentStructure={str}
    //                 currentSnapshot={currentSnapshot}
    //                 contextInfo={
    //                     {type: 'Task'}}
    //                 currentProject={'"PRJ201897"'}
    //                 issueTypesList={['Clash', 'Building code', 'Design', 'Safety', 'Commissioning']}
    //                 issueFilterState={{filterData:{},
    //                     isFilterApplied :false,
    //                     numberOfFilters :0}}
    //                 getIssues={()=>{}}
    //                 handleOnIssueSort={()=>{}}
    //                 deleteTheAttachment={()=>{}}
    //             />
    //         );
    //         const sort = screen.getByTestId("sort")
    //         fireEvent.click(sort);
    //         expect(screen.getByText("Status ( To Do - Completed)")).toBeInTheDocument()
    //         const sortitem = screen.getAllByTestId("sort-menu-item");
    //         fireEvent.click(sortitem[0])
    //         const download = screen.getByTestId("download");
    //         fireEvent.click(download)
            
    //         const filter = screen.getByTestId("filter");
    //         fireEvent.click(filter)
    //         expect(screen.getByText("Filters")).toBeInTheDocument()
    //         fireEvent.click(screen.getByTestId("filter-close"))
    //         expect(screen.getByText("Issue List")).toBeInTheDocument()

    // })