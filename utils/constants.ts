import { IGenData } from "../models/IGenData";

export const role = [
  { id: "", name: "Please select the role" },
  { id: "admin", name: "Admin" },
  { id: "collaborator", name: "Collaborator" },
  { id: "viewer", name: "Viewer" },
];
export const roleData = [
  { id: "admin", name: "Admin" },
  { id: "collaborator", name: "Collaborator" },
  { id: "viewer", name: "Viewer" },
];
export const userNotificationData = [
  { id: 1, name: "Unread" },
  { id: 2, name: "All" },
];
export const sampleGenData: IGenData = {
  project: "PRJ201897",
  structure: {
    _id: "STR013274",
    name: "5_Floor_A3_Block",
    type: "Interior",
    isExterior: false,
    project: "PRJ201897",
    parent: "STR536138",
    children: [],
    // "location": [],
    designs: [
      {
        _id: "DSG870661",
        type: "Plan Drawings",
        name: "floormap.pdf",
        project: "PRJ201897",
        structure: "STR013274",
        storage: [
          {
            provider: "constructn-oss",
            path: "PRJ201897/structures/STR013274/designs/DSG870661/floormap.pdf",
            providerType: "internal",
            format: ".PDF",
          },
          {
            provider: "autodesk-oss",
            pathId:
              "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWRoYW5pX2tvcmVnYW9uX3BhcmtfcHVuZS8lMkZQUkoyMDE4OTclMkZzdHJ1Y3R1cmVzJTJGU1RSMDEzMjc0JTJGZGVzaWducyUyRkRTRzg3MDY2MSUyRkEzLUY1LnBkZg",
            providerType: "external",
            format: ".SVF2",
          },
        ],
      },
      {
        _id: "DSG812594",
        type: "BIM",
        name: "Block A3.rvt",
        project: "PRJ201897",
        structure: "STR013274",
        storage: [
          {
            provider: "constructn-oss",
            path: "PRJ201897/structures/STR013274/designs/DSG812594/Block A3.rvt",
            providerType: "internal",
            format: ".RVT",
          },
          {
            provider: "autodesk-oss",
            pathId:
              "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWRoYW5pX2tvcmVnYW9uX3BhcmtfcHVuZS8lMkZQUkoyMDE4OTclMkZzdHJ1Y3R1cmVzJTJGU1RSNTM2MTM4JTJGZGVzaWducyUyRkRTRzIzNDI5MyUyRmFkaGFuaV9hM19ibG9jay5ydnQ",
            providerType: "external",
            format: ".SVF2",
          },
        ],
      },
    ],
  },
  snapshotList: [
    {
      _id: "SNP869976",
      progress: -1,
      status: "Active",
      visualizations: [],
      structure: "STR013274",
      date: "2023-1-6",
      project: "PRJ201897",
      reality: [
        {
          _id: "RLT938278",
          job: "JOB870103",
          capture: "CAP870166",
          snapshot: "SNP869976",
          status: "active",
          realityType: ["pointCloud"],

          type: "interior",
          mode: "360 Video",
        },
      ],
    },
    {
      _id: "SNP125445",
      progress: -1,
      status: "Active",
      visualizations: [],
      structure: "STR013274",
      date: "2022-12-22",
      project: "PRJ201897",
      reality: [
        {
          _id: "RLT190984",
          job: "JOB125741",
          capture: "CAP125876",
          snapshot: "SNP125445",
          status: "active",
          realityType: ["pointCloud"],
          type: "interior",
          mode: "360 Video",
        },
        {
          _id: "RLT280976",
          job: "JOB240494",
          capture: "CAP240637",
          snapshot: "SNP125445",
          status: "active",
          realityType: ["pointCloud"],
          type: "interior",
          mode: "360 Video",
        },
      ],
    },
  ],
  currentViewMode: "Design",
  currentViewType: "PlanDrawings",
  viewerContext: {},
  currentSnapshotBase: {
    _id: "SNP869976",
    progress: 0,
    status: "Active",
    structure: "STR013274",
    date: "2023-01-06",
    project: "PRJ201897",
    reality: [
      {
        _id: "RLT938278",
        job: "JOB870103",
        capture: "CAP870166",
        snapshot: "SNP869976",
        status: "active",
        realityType: ["pointCloud"],

        type: "interior",
        mode: "360 Video",
      },
    ],
  },
  currentSnapshotCompare: {
    _id: "SNP125445",
    progress: 0,
    status: "Active",
    structure: "STR013274",
    date: "2022-12-22",
    project: "PRJ201897",
    reality: [
      {
        _id: "RLT190984",
        job: "JOB125741",
        capture: "CAP125876",
        snapshot: "SNP125445",
        status: "active",
        realityType: ["pointCloud"],

        type: "interior",
        mode: "360 Video",
      },
      {
        _id: "RLT280976",
        job: "JOB240494",
        capture: "CAP240637",
        snapshot: "SNP125445",
        status: "active",
        realityType: ["pointCloud"],
        type: "interior",
        mode: "360 Video",
      },
    ],
  },
  currentCompareMode: "noCompare",
  currentLayersList: ["360 Video"],
  currentTaskList: [],
  currentIssueList: [
    {
      _id: "ISS656256",
      title: "5_Floor_A3_Block_2023-03-10",
      description: "uyytuyt",
      type: "Safety",
      status: "To Do",
      priority: "High",

      owner: "USR950472",
      project: "PRJ201897",
      structure: "STR013274",
      context: {
        id: "Temp Issue",
        type: "Issue",
        cameraObject: {
          cameraPosition: {
            x: 385387.185919544,
            y: 2049796.7486528917,
            z: 165.85680135561137,
          },
          cameraTarget: {
            x: 385387.185919544,
            y: 2049797.309151555,
            z: 112.0,
          },
        },
        tag: {
          tagPosition: {
            x: 385382.07053447835,
            y: 2049805.105799658,
            z: 112,
          },
        },
      },
      screenshot:
        "https://constructn-attachments-dev.s3.ap-south-1.amazonaws.com/ISS/ISS656256/1678427656049-screenshot.png",
      progress: 0,
      sequenceNumber: 494,
      dueDate: "2023-04-04",
      tags: ["Electrical"],
    },
    {
      _id: "ISS502161",
      title: "5_Floor_A3_Block_2023-03-10",
      description: "dffdfd",
      type: "Clash",
      status: "To Do",
      priority: "High",

      owner: "USR950472",
      project: "PRJ201897",
      structure: "STR013274",
      context: {
        type: "Issue",
        id: "Temp_Issue",
        cameraObject: {
          cameraPosition: {
            x: 385387.2426536827,
            y: 2049781.8501664493,
            z: 113.83173831693408,
          },
          cameraTarget: {
            x: 385387.2426531442,
            y: 2049781.8501672759,
            z: 113.8317384807786,
          },
          pitch: 0.16458658187125502,
          yaw: 0.5775039438315247,
          fov: 60,
        },
        tag: {
          tagPosition: {
            x: 0.3912782073020935,
            y: -36.13823365815915,
            z: 1.7557694220504771,
          },
        },
        image: {
          imagePosition: {
            x: 385387.2426531442,
            y: 2049781.8501672759,
            z: 113.8317384807786,
          },
          imageName: "DT_VID_20230106_122319_00_219IMG_806.JPG",
        },
      },
      screenshot:
        "https://constructn-attachments-dev.s3.ap-south-1.amazonaws.com/ISS/ISS502161/1678429501880-screenshot.png",
      progress: 0,
      sequenceNumber: 495,
      dueDate: "2023-04-04",
      tags: ["Electrical"],
    },
  ],
  currentHotspotList: [],
  // selectedTask?: ITasks,
  // selectedIssue?: Issue,
  // selectedHotspot?: IHotspot
};
