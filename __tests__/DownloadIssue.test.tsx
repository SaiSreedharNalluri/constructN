import { render, screen, fireEvent } from "@testing-library/react";
import { CSVLink } from "react-csv";
import Download from "../../../public/divami_icons/download.svg";
import getDownladableIssueList from "../../constructn-web/components/divami_components/issue-listing/IssueList";

const filteredIssuesList = [
  {
    title: "Issue 1",
    type: "Bug",
    description: "This is a bug",
    status: "Open",
    priority: "High",
    screenshot: "screenshot.jpg",
    assignees: [
      {
        _id: "1",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
      },
      {
        _id: "2",
        firstName: "Jane",
        lastName: "Doe",
        email: "jane.doe@example.com",
      },
    ],
    owner: "John",
    project: "Project A",
    structure: "Structure A",
    progress: 0,
    tags: ["tag1", "tag2"],
    attachments: [
      {
        name: "attachment1",
        url: "attachment1.jpg",
        entity: "entity1",
        _id: "1",
      },
      {
        name: "attachment2",
        url: "attachment2.jpg",
        entity: "entity2",
        _id: "2",
      },
    ],
    sequenceNumber: 1,
    createdAt: "2021-01-01T00:00:00Z",
    updatedAt: "2021-01-02T00:00:00Z",
    startDate: "2021-01-01T00:00:00Z",
    dueDate: "2021-01-31T00:00:00Z",
    context: { name: "Context A", type: "Type A" },
    _id: "1",
    __v: 0,
  },
  {
    title: "Issue 2",
    type: "Feature",
    description: "This is a feature",
    status: "Closed",
    priority: "Low",
    screenshot: "screenshot.jpg",
    assignees: [
      {
        _id: "1",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
      },
    ],
    owner: "John",
    project: "Project A",
    structure: "Structure A",
    progress: 0,
    tags: ["tag1"],
    attachments: [
      {
        name: "attachment1",
        url: "attachment1.jpg",
        entity: "entity1",
        _id: "1",
      },
    ],
    sequenceNumber: 2,
    createdAt: "2021-02-01T00:00:00Z",
    updatedAt: "2021-02-02T00:00:00Z",
    startDate: "2021-02-01T00:00:00Z",
    dueDate: "2021-02-28T00:00:00Z",
    context: { name: "Context A", type: "Type A" },
    _id: "2",
    __v: 0,
  },
];

// describe("CSVLink component", () => {
//   test("clicking the download button downloads a CSV file with the expected data", () => {
//     const issues = [
//       {
//         title: "Issue 1",
//         type: "Bug",
//         description: "This is a bug",
//         status: "Open",
//         priority: "High",
//         screenshot: "screenshot.jpg",
//         assignees: [
//           {
//             _id: "1",
//             firstName: "John",
//             lastName: "Doe",
//             email: "john.doe@example.com",
//           },
//           {
//             _id: "2",
//             firstName: "Jane",
//             lastName: "Doe",
//             email: "jane.doe@example.com",
//           },
//         ],
//         owner: "John",
//         project: "Project A",
//         structure: "Structure A",
//         progress: 0,
//         tags: ["tag1", "tag2"],
//         attachments: [
//           {
//             name: "attachment1",
//             url: "attachment1.jpg",
//             entity: "entity1",
//             _id: "1",
//           },
//           {
//             name: "attachment2",
//             url: "attachment2.jpg",
//             entity: "entity2",
//             _id: "2",
//           },
//         ],
//         sequenceNumber: 1,
//         createdAt: "2021-01-01T00:00:00Z",
//         updatedAt: "2021-01-02T00:00:00Z",
//         startDate: "2021-01-01T00:00:00Z",
//         dueDate: "2021-01-31T00:00:00Z",
//         context: { name: "Context A", type: "Type A" },
//         _id: "1",
//         __v: 0,
//       },
//       {
//         title: "Issue 2",
//         type: "Feature",
//         description: "This is a feature",
//         status: "Closed",
//         priority: "Low",
//         screenshot: "screenshot.jpg",
//         assignees: [
//           {
//             _id: "1",
//             firstName: "John",
//             lastName: "Doe",
//             email: "john.doe@example.com",
//           },
//         ],
//         owner: "John",
//         project: "Project A",
//         structure: "Structure A",
//         progress: 0,
//         tags: ["tag1"],
//         attachments: [
//           {
//             name: "attachment1",
//             url: "attachment1.jpg",
//             entity: "entity1",
//             _id: "1",
//           },
//         ],
//         sequenceNumber: 2,
//         createdAt: "2021-02-01T00:00:00Z",
//         updatedAt: "2021-02-02T00:00:00Z",
//         startDate: "2021-02-01T00:00:00Z",
//         dueDate: "2021-02-28T00:00:00Z",
//         context: { name: "Context A", type: "Type A" },
//         _id: "2",
//         __v: 0,
//       },
//     ];
//     const expectedCsvData = [
//       ["id", "title", "status"],
//       ["1", "Issue 1", "Open"],
//       ["2", "Issue 2", "Closed"],
//     ];

//     const { getByTestId } = render(
//       <CSVLink
//         data={() => getDownladableIssueList(issues)}
//         filename="my-issues.csv"
//         className="text-black btn btn-primary fill-black fa fa-Download"
//         target="_blank"
//         data-testid="download"
//       >
//         <img src="download-icon.png" alt="Download" />
//       </CSVLink>
//     );

//     const downloadButton = getByTestId("download");
//     fireEvent.click(downloadButton);

//     const downloadLink = document.createElement("a");
//     downloadLink.href = window.URL.createObjectURL(
//       new Blob([expectedCsvData], { type: "text/csv" })
//     );
//     downloadLink.download = "my-issues.csv";

//     expect(downloadButton).toHaveTextContent("Download");
//     expect(downloadButton).toHaveClass(
//       "text-black",
//       "btn",
//       "btn-primary",
//       "fill-black",
//       "fa",
//       "fa-Download"
//     );
//     expect(downloadLink.href).toEqual(downloadButton.href);
//     expect(downloadLink.download).toEqual(downloadButton.download);
//   });
// });

test("renders CSVLink component", () => {
  render(<CSVLink data={[]} />);
});
