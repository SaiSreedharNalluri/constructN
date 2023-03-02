
import TimeLineComponent from "../components/divami_components/timeline-container/TimeLineComponent";
import { fireEvent, render, screen } from "@testing-library/react";
import ProjectHierarchy from "../components/divami_components/project-hierarchy/ProjectHierarchy";
import '@testing-library/jest-dom';
const treeData = [
    {
        "_id": "STR468587",
        "name": "Adani Koregaon Park",
        "type": "Exterior",
        "isExterior": true,
        "project": "PRJ201897",
        "parent": null,
        "children": [
            {
                "_id": "STR536138",
                "name": "A3_Block",
                "type": "Exterior",
                "isExterior": true,
                "project": "PRJ201897",
                "parent": "STR468587",
                "children": [],
                "location": [],
                "designs": [
                    {
                        "_id": "DSG234293",
                        "type": "BIM",
                        "name": "adhani_a3_block.rvt",
                        "project": "PRJ201897",
                        "structure": "STR536138",
                        "storage": [
                            {
                                "provider": "constructn-oss",
                                "path": "PRJ201897/structures/STR536138/designs/DSG234293/adhani_a3_block.rvt",
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
                        "createdAt": "2023-02-09T17:12:52.952Z",
                        "updatedAt": "2023-02-09T17:12:52.952Z",
                        "__v": 0
                    }
                ]
            },
            {
                "_id": "STR511876",
                "name": "A2_Block",
                "type": "Exterior",
                "isExterior": true,
                "project": "PRJ201897",
                "parent": "STR468587",
                "children": [
                    {
                        "_id": "STR780049",
                        "name": "1_Floor_A2_Block",
                        "type": "Interior",
                        "isExterior": false,
                        "project": "PRJ201897",
                        "parent": "STR511876",
                        "children": [],
                        "location": [],
                        "designs": [
                            {
                                "_id": "DSG051690",
                                "type": "Plan Drawings",
                                "name": "floormap.pdf",
                                "project": "PRJ201897",
                                "structure": "STR780049",
                                "storage": [
                                    {
                                        "provider": "constructn-oss",
                                        "path": "PRJ201897/structures/STR780049/designs/DSG051690/floormap.pdf",
                                        "providerType": "internal",
                                        "format": ".PDF"
                                    },
                                    {
                                        "provider": "autodesk-oss",
                                        "pathId": "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWRoYW5pX2tvcmVnYW9uX3BhcmtfcHVuZS8lMkZQUkoyMDE4OTclMkZzdHJ1Y3R1cmVzJTJGU1RSNzgwMDQ5JTJGZGVzaWducyUyRkRTRzA1MTY5MCUyRkEyLUYxLnBkZg",
                                        "providerType": "external",
                                        "format": ".SVF2"
                                    }
                                ],
                                "createdAt": "2023-02-09T12:42:19.836Z",
                                "updatedAt": "2023-02-09T12:42:19.836Z",
                                "__v": 0
                            },
                            {
                                "_id": "DSG196412",
                                "type": "BIM",
                                "name": "Block A2.rvt",
                                "project": "PRJ201897",
                                "structure": "STR780049",
                                "storage": [
                                    {
                                        "provider": "constructn-oss",
                                        "path": "PRJ201897/structures/STR780049/designs/DSG196412/Block A2.rvt",
                                        "providerType": "internal",
                                        "format": ".RVT"
                                    },
                                    {
                                        "provider": "autodesk-oss",
                                        "pathId": "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWRoYW5pX2tvcmVnYW9uX3BhcmtfcHVuZS8lMkZQUkoyMDE4OTclMkZzdHJ1Y3R1cmVzJTJGU1RSNTExODc2JTJGZGVzaWducyUyRkRTRzI4MjkwNCUyRmFkaGFuaV9hMl9ibG9jay5ydnQ",
                                        "providerType": "external",
                                        "format": ".SVF2"
                                    }
                                ],
                                "createdAt": "2023-02-09T12:42:19.836Z",
                                "updatedAt": "2023-02-09T12:42:19.836Z",
                                "__v": 0
                            }
                        ]
                    },
                    {
                        "_id": "STR800484",
                        "name": "2_Floor_A2_Block",
                        "type": "Interior",
                        "isExterior": false,
                        "project": "PRJ201897",
                        "parent": "STR511876",
                        "children": [],
                        "location": [],
                        "designs": [
                            {
                                "_id": "DSG088904",
                                "type": "Plan Drawings",
                                "name": "floormap.pdf",
                                "project": "PRJ201897",
                                "structure": "STR800484",
                                "storage": [
                                    {
                                        "provider": "constructn-oss",
                                        "path": "PRJ201897/structures/STR800484/designs/DSG088904/floormap.pdf",
                                        "providerType": "internal",
                                        "format": ".PDF"
                                    },
                                    {
                                        "provider": "autodesk-oss",
                                        "pathId": "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWRoYW5pX2tvcmVnYW9uX3BhcmtfcHVuZS8lMkZQUkoyMDE4OTclMkZzdHJ1Y3R1cmVzJTJGU1RSODAwNDg0JTJGZGVzaWducyUyRkRTRzA4ODkwNCUyRkEyLUYyLnBkZg",
                                        "providerType": "external",
                                        "format": ".SVF2"
                                    }
                                ],
                                "createdAt": "2023-02-09T12:42:44.104Z",
                                "updatedAt": "2023-02-09T12:42:44.104Z",
                                "__v": 0
                            },
                            {
                                "_id": "DSG207527",
                                "type": "BIM",
                                "name": "Block A2.rvt",
                                "project": "PRJ201897",
                                "structure": "STR800484",
                                "storage": [
                                    {
                                        "provider": "constructn-oss",
                                        "path": "PRJ201897/structures/STR800484/designs/DSG207527/Block A2.rvt",
                                        "providerType": "internal",
                                        "format": ".RVT"
                                    },
                                    {
                                        "provider": "autodesk-oss",
                                        "pathId": "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWRoYW5pX2tvcmVnYW9uX3BhcmtfcHVuZS8lMkZQUkoyMDE4OTclMkZzdHJ1Y3R1cmVzJTJGU1RSNTExODc2JTJGZGVzaWducyUyRkRTRzI4MjkwNCUyRmFkaGFuaV9hMl9ibG9jay5ydnQ",
                                        "providerType": "external",
                                        "format": ".SVF2"
                                    }
                                ],
                                "createdAt": "2023-02-09T12:42:44.104Z",
                                "updatedAt": "2023-02-09T12:42:44.104Z",
                                "__v": 0
                            }
                        ]
                    },
                    {
                        "_id": "STR812949",
                        "name": "3_Floor_A2_Block",
                        "type": "Interior",
                        "isExterior": false,
                        "project": "PRJ201897",
                        "parent": "STR511876",
                        "children": [],
                        "location": [],
                        "designs": [
                            {
                                "_id": "DSG099683",
                                "type": "Plan Drawings",
                                "name": "floormap.pdf",
                                "project": "PRJ201897",
                                "structure": "STR812949",
                                "storage": [
                                    {
                                        "provider": "constructn-oss",
                                        "path": "PRJ201897/structures/STR812949/designs/DSG099683/floormap.pdf",
                                        "providerType": "internal",
                                        "format": ".PDF"
                                    },
                                    {
                                        "provider": "autodesk-oss",
                                        "pathId": "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWRoYW5pX2tvcmVnYW9uX3BhcmtfcHVuZS8lMkZQUkoyMDE4OTclMkZzdHJ1Y3R1cmVzJTJGU1RSODIzNDk2JTJGZGVzaWducyUyRkRTRzExMzI4OSUyRkEyLUY0LnBkZg",
                                        "providerType": "external",
                                        "format": ".SVF2"
                                    }
                                ],
                                "createdAt": "2023-02-09T12:42:53.511Z",
                                "updatedAt": "2023-02-09T12:42:53.511Z",
                                "__v": 0
                            },
                            {
                                "_id": "DSG541428",
                                "type": "BIM",
                                "name": "Block A2.rvt",
                                "project": "PRJ201897",
                                "structure": "STR812949",
                                "storage": [
                                    {
                                        "provider": "constructn-oss",
                                        "path": "PRJ201897/structures/STR812949/designs/DSG541428/Block A2.rvt",
                                        "providerType": "internal",
                                        "format": ".RVT"
                                    },
                                    {
                                        "provider": "autodesk-oss",
                                        "pathId": "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWRoYW5pX2tvcmVnYW9uX3BhcmtfcHVuZS8lMkZQUkoyMDE4OTclMkZzdHJ1Y3R1cmVzJTJGU1RSNTExODc2JTJGZGVzaWducyUyRkRTRzI4MjkwNCUyRmFkaGFuaV9hMl9ibG9jay5ydnQ",
                                        "providerType": "external",
                                        "format": ".SVF2"
                                    }
                                ],
                                "createdAt": "2023-02-09T12:42:53.511Z",
                                "updatedAt": "2023-02-09T12:42:53.511Z",
                                "__v": 0
                            }
                        ]
                    },
                    {
                        "_id": "STR823496",
                        "name": "4_Floor_A2_Block",
                        "type": "Interior",
                        "isExterior": false,
                        "project": "PRJ201897",
                        "parent": "STR511876",
                        "children": [],
                        "location": [],
                        "designs": [
                            {
                                "_id": "DSG113289",
                                "type": "Plan Drawings",
                                "name": "floormap.pdf",
                                "project": "PRJ201897",
                                "structure": "STR823496",
                                "storage": [
                                    {
                                        "provider": "constructn-oss",
                                        "path": "PRJ201897/structures/STR823496/designs/DSG113289/floormap.pdf",
                                        "providerType": "internal",
                                        "format": ".PDF"
                                    },
                                    {
                                        "provider": "autodesk-oss",
                                        "pathId": "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWRoYW5pX2tvcmVnYW9uX3BhcmtfcHVuZS8lMkZQUkoyMDE4OTclMkZzdHJ1Y3R1cmVzJTJGU1RSODIzNDk2JTJGZGVzaWducyUyRkRTRzExMzI4OSUyRkEyLUY0LnBkZg",
                                        "providerType": "external",
                                        "format": ".SVF2"
                                    }
                                ],
                                "createdAt": "2023-02-09T12:43:02.342Z",
                                "updatedAt": "2023-02-09T12:43:02.342Z",
                                "__v": 0
                            },
                            {
                                "_id": "DSG598955",
                                "type": "BIM",
                                "name": "Block A2.rvt",
                                "project": "PRJ201897",
                                "structure": "STR823496",
                                "storage": [
                                    {
                                        "provider": "constructn-oss",
                                        "path": "PRJ201897/structures/STR823496/designs/DSG598955/Block A2.rvt",
                                        "providerType": "internal",
                                        "format": ".RVT"
                                    },
                                    {
                                        "provider": "autodesk-oss",
                                        "pathId": "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWRoYW5pX2tvcmVnYW9uX3BhcmtfcHVuZS8lMkZQUkoyMDE4OTclMkZzdHJ1Y3R1cmVzJTJGU1RSNTExODc2JTJGZGVzaWducyUyRkRTRzI4MjkwNCUyRmFkaGFuaV9hMl9ibG9jay5ydnQ",
                                        "providerType": "external",
                                        "format": ".SVF2"
                                    }
                                ],
                                "createdAt": "2023-02-09T12:43:02.342Z",
                                "updatedAt": "2023-02-09T12:43:02.342Z",
                                "__v": 0
                            }
                        ]
                    },
                    {
                        "_id": "STR833556",
                        "name": "5_Floor_A2_Block",
                        "type": "Interior",
                        "isExterior": false,
                        "project": "PRJ201897",
                        "parent": "STR511876",
                        "children": [],
                        "location": [],
                        "designs": [
                            {
                                "_id": "DSG125307",
                                "type": "Plan Drawings",
                                "name": "floormap.pdf",
                                "project": "PRJ201897",
                                "structure": "STR833556",
                                "storage": [
                                    {
                                        "provider": "constructn-oss",
                                        "path": "PRJ201897/structures/STR833556/designs/DSG125307/floormap.pdf",
                                        "providerType": "internal",
                                        "format": ".PDF"
                                    },
                                    {
                                        "provider": "autodesk-oss",
                                        "pathId": "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWRoYW5pX2tvcmVnYW9uX3BhcmtfcHVuZS8lMkZQUkoyMDE4OTclMkZzdHJ1Y3R1cmVzJTJGU1RSODMzNTU2JTJGZGVzaWducyUyRkRTRzEyNTMwNyUyRkEyLUY1LnBkZg",
                                        "providerType": "external",
                                        "format": ".SVF2"
                                    }
                                ],
                                "createdAt": "2023-02-09T12:43:10.181Z",
                                "updatedAt": "2023-02-09T12:43:10.181Z",
                                "__v": 0
                            },
                            {
                                "_id": "DSG610611",
                                "type": "BIM",
                                "name": "Block A2.rvt",
                                "project": "PRJ201897",
                                "structure": "STR833556",
                                "storage": [
                                    {
                                        "provider": "constructn-oss",
                                        "path": "PRJ201897/structures/STR833556/designs/DSG610611/Block A2.rvt",
                                        "providerType": "internal",
                                        "format": ".RVT"
                                    },
                                    {
                                        "provider": "autodesk-oss",
                                        "pathId": "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWRoYW5pX2tvcmVnYW9uX3BhcmtfcHVuZS8lMkZQUkoyMDE4OTclMkZzdHJ1Y3R1cmVzJTJGU1RSNTExODc2JTJGZGVzaWducyUyRkRTRzI4MjkwNCUyRmFkaGFuaV9hMl9ibG9jay5ydnQ",
                                        "providerType": "external",
                                        "format": ".SVF2"
                                    }
                                ],
                                "createdAt": "2023-02-09T12:43:10.181Z",
                                "updatedAt": "2023-02-09T12:43:10.181Z",
                                "__v": 0
                            }
                        ]
                    },
                    {
                        "_id": "STR843367",
                        "name": "6_Floor_A2_Block",
                        "type": "Interior",
                        "isExterior": false,
                        "project": "PRJ201897",
                        "parent": "STR511876",
                        "children": [],
                        "location": [],
                        "designs": [
                            {
                                "_id": "DSG135387",
                                "type": "Plan Drawings",
                                "name": "floormap.pdf",
                                "project": "PRJ201897",
                                "structure": "STR843367",
                                "storage": [
                                    {
                                        "provider": "constructn-oss",
                                        "path": "PRJ201897/structures/STR843367/designs/DSG135387/floormap.pdf",
                                        "providerType": "internal",
                                        "format": ".PDF"
                                    },
                                    {
                                        "provider": "autodesk-oss",
                                        "pathId": "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWRoYW5pX2tvcmVnYW9uX3BhcmtfcHVuZS8lMkZQUkoyMDE4OTclMkZzdHJ1Y3R1cmVzJTJGU1RSODQzMzY3JTJGZGVzaWducyUyRkRTRzEzNTM4NyUyRkEyLUY2LnBkZg",
                                        "providerType": "external",
                                        "format": ".SVF2"
                                    }
                                ],
                                "createdAt": "2023-02-09T12:43:18.296Z",
                                "updatedAt": "2023-02-09T12:43:18.296Z",
                                "__v": 0
                            },
                            {
                                "_id": "DSG620323",
                                "type": "BIM",
                                "name": "Block A2.rvt",
                                "project": "PRJ201897",
                                "structure": "STR843367",
                                "storage": [
                                    {
                                        "provider": "constructn-oss",
                                        "path": "PRJ201897/structures/STR843367/designs/DSG620323/Block A2.rvt",
                                        "providerType": "internal",
                                        "format": ".RVT"
                                    },
                                    {
                                        "provider": "autodesk-oss",
                                        "pathId": "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWRoYW5pX2tvcmVnYW9uX3BhcmtfcHVuZS8lMkZQUkoyMDE4OTclMkZzdHJ1Y3R1cmVzJTJGU1RSNTExODc2JTJGZGVzaWducyUyRkRTRzI4MjkwNCUyRmFkaGFuaV9hMl9ibG9jay5ydnQ",
                                        "providerType": "external",
                                        "format": ".SVF2"
                                    }
                                ],
                                "createdAt": "2023-02-09T12:43:18.296Z",
                                "updatedAt": "2023-02-09T12:43:18.296Z",
                                "__v": 0
                            }
                        ]
                    },
                    {
                        "_id": "STR853410",
                        "name": "7_Floor_A2_Block",
                        "type": "Interior",
                        "isExterior": false,
                        "project": "PRJ201897",
                        "parent": "STR511876",
                        "children": [],
                        "location": [],
                        "designs": [
                            {
                                "_id": "DSG145557",
                                "type": "Plan Drawings",
                                "name": "floormap.pdf",
                                "project": "PRJ201897",
                                "structure": "STR853410",
                                "storage": [
                                    {
                                        "provider": "constructn-oss",
                                        "path": "PRJ201897/structures/STR853410/designs/DSG145557/floormap.pdf",
                                        "providerType": "internal",
                                        "format": ".PDF"
                                    },
                                    {
                                        "provider": "autodesk-oss",
                                        "pathId": "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWRoYW5pX2tvcmVnYW9uX3BhcmtfcHVuZS8lMkZQUkoyMDE4OTclMkZzdHJ1Y3R1cmVzJTJGU1RSODUzNDEwJTJGZGVzaWducyUyRkRTRzE0NTU1NyUyRkEyLUY3LnBkZg",
                                        "providerType": "external",
                                        "format": ".SVF2"
                                    }
                                ],
                                "createdAt": "2023-02-09T12:43:25.020Z",
                                "updatedAt": "2023-02-09T12:43:25.020Z",
                                "__v": 0
                            },
                            {
                                "_id": "DSG804062",
                                "type": "BIM",
                                "name": "Block A2.rvt",
                                "project": "PRJ201897",
                                "structure": "STR853410",
                                "storage": [
                                    {
                                        "provider": "constructn-oss",
                                        "path": "PRJ201897/structures/STR853410/designs/DSG804062/Block A2.rvt",
                                        "providerType": "internal",
                                        "format": ".RVT"
                                    },
                                    {
                                        "provider": "autodesk-oss",
                                        "pathId": "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWRoYW5pX2tvcmVnYW9uX3BhcmtfcHVuZS8lMkZQUkoyMDE4OTclMkZzdHJ1Y3R1cmVzJTJGU1RSNTExODc2JTJGZGVzaWducyUyRkRTRzI4MjkwNCUyRmFkaGFuaV9hMl9ibG9jay5ydnQ",
                                        "providerType": "external",
                                        "format": ".SVF2"
                                    }
                                ],
                                "createdAt": "2023-02-09T12:43:25.020Z",
                                "updatedAt": "2023-02-09T12:43:25.020Z",
                                "__v": 0
                            }
                        ]
                    },
                    {
                        "_id": "STR865014",
                        "name": "8_Floor_A2_Block",
                        "type": "Interior",
                        "isExterior": false,
                        "project": "PRJ201897",
                        "parent": "STR511876",
                        "children": [],
                        "location": [],
                        "designs": [
                            {
                                "_id": "DSG155454",
                                "type": "Plan Drawings",
                                "name": "floormap.pdf",
                                "project": "PRJ201897",
                                "structure": "STR865014",
                                "storage": [
                                    {
                                        "provider": "constructn-oss",
                                        "path": "PRJ201897/structures/STR865014/designs/DSG155454/floormap.pdf",
                                        "providerType": "internal",
                                        "format": ".PDF"
                                    },
                                    {
                                        "provider": "autodesk-oss",
                                        "pathId": "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWRoYW5pX2tvcmVnYW9uX3BhcmtfcHVuZS8lMkZQUkoyMDE4OTclMkZzdHJ1Y3R1cmVzJTJGU1RSODY1MDE0JTJGZGVzaWducyUyRkRTRzE1NTQ1NCUyRkEyLUY4LnBkZg",
                                        "providerType": "external",
                                        "format": ".SVF2"
                                    }
                                ],
                                "createdAt": "2023-02-09T12:44:13.125Z",
                                "updatedAt": "2023-02-09T12:44:13.125Z",
                                "__v": 0
                            },
                            {
                                "_id": "DSG233862",
                                "type": "BIM",
                                "name": "Block A2.rvt",
                                "project": "PRJ201897",
                                "structure": "STR865014",
                                "storage": [
                                    {
                                        "provider": "constructn-oss",
                                        "path": "PRJ201897/structures/STR865014/designs/DSG233862/Block A2.rvt",
                                        "providerType": "internal",
                                        "format": ".RVT"
                                    },
                                    {
                                        "provider": "autodesk-oss",
                                        "pathId": "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWRoYW5pX2tvcmVnYW9uX3BhcmtfcHVuZS8lMkZQUkoyMDE4OTclMkZzdHJ1Y3R1cmVzJTJGU1RSNTExODc2JTJGZGVzaWducyUyRkRTRzI4MjkwNCUyRmFkaGFuaV9hMl9ibG9jay5ydnQ",
                                        "providerType": "external",
                                        "format": ".SVF2"
                                    }
                                ],
                                "createdAt": "2023-02-09T12:44:13.125Z",
                                "updatedAt": "2023-02-09T12:44:13.125Z",
                                "__v": 0
                            }
                        ]
                    },
                    {
                        "_id": "STR936181",
                        "name": "9_Floor_A2_Block",
                        "type": "Interior",
                        "isExterior": false,
                        "project": "PRJ201897",
                        "parent": "STR511876",
                        "children": [],
                        "location": [],
                        "designs": [
                            {
                                "_id": "DSG167807",
                                "type": "Plan Drawings",
                                "name": "floormap.pdf",
                                "project": "PRJ201897",
                                "structure": "STR936181",
                                "storage": [
                                    {
                                        "provider": "constructn-oss",
                                        "path": "PRJ201897/structures/STR936181/designs/DSG167807/floormap.pdf",
                                        "providerType": "internal",
                                        "format": ".PDF"
                                    },
                                    {
                                        "provider": "autodesk-oss",
                                        "pathId": "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWRoYW5pX2tvcmVnYW9uX3BhcmtfcHVuZS8lMkZQUkoyMDE4OTclMkZzdHJ1Y3R1cmVzJTJGU1RSOTM2MTgxJTJGZGVzaWducyUyRkRTRzE2NzgwNyUyRkEyLUY5LnBkZg",
                                        "providerType": "external",
                                        "format": ".SVF2"
                                    }
                                ],
                                "createdAt": "2023-02-09T12:45:37.669Z",
                                "updatedAt": "2023-02-09T12:45:37.669Z",
                                "__v": 0
                            },
                            {
                                "_id": "DSG248390",
                                "type": "BIM",
                                "name": "Block A2.rvt",
                                "project": "PRJ201897",
                                "structure": "STR936181",
                                "storage": [
                                    {
                                        "provider": "constructn-oss",
                                        "path": "PRJ201897/structures/STR936181/designs/DSG248390/Block A2.rvt",
                                        "providerType": "internal",
                                        "format": ".RVT"
                                    },
                                    {
                                        "provider": "autodesk-oss",
                                        "pathId": "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWRoYW5pX2tvcmVnYW9uX3BhcmtfcHVuZS8lMkZQUkoyMDE4OTclMkZzdHJ1Y3R1cmVzJTJGU1RSNTExODc2JTJGZGVzaWducyUyRkRTRzI4MjkwNCUyRmFkaGFuaV9hMl9ibG9jay5ydnQ",
                                        "providerType": "external",
                                        "format": ".SVF2"
                                    }
                                ],
                                "createdAt": "2023-02-09T12:45:37.669Z",
                                "updatedAt": "2023-02-09T12:45:37.669Z",
                                "__v": 0
                            }
                        ]
                    },
                    {
                        "_id": "STR945266",
                        "name": "10_Floor_A2_Block",
                        "type": "Interior",
                        "isExterior": false,
                        "project": "PRJ201897",
                        "parent": "STR511876",
                        "children": [],
                        "location": [],
                        "designs": [
                            {
                                "_id": "DSG178446",
                                "type": "Plan Drawings",
                                "name": "floormap.pdf",
                                "project": "PRJ201897",
                                "structure": "STR945266",
                                "storage": [
                                    {
                                        "provider": "constructn-oss",
                                        "path": "PRJ201897/structures/STR945266/designs/DSG178446/floormap.pdf",
                                        "providerType": "internal",
                                        "format": ".PDF"
                                    },
                                    {
                                        "provider": "autodesk-oss",
                                        "pathId": "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWRoYW5pX2tvcmVnYW9uX3BhcmtfcHVuZS8lMkZQUkoyMDE4OTclMkZzdHJ1Y3R1cmVzJTJGU1RSOTQ1MjY2JTJGZGVzaWducyUyRkRTRzE3ODQ0NiUyRkEyLUYxMC5wZGY",
                                        "providerType": "external",
                                        "format": ".SVF2"
                                    }
                                ],
                                "createdAt": "2023-02-09T12:45:58.692Z",
                                "updatedAt": "2023-02-09T12:45:58.692Z",
                                "__v": 0
                            },
                            {
                                "_id": "DSG261968",
                                "type": "BIM",
                                "name": "Block A2.rvt",
                                "project": "PRJ201897",
                                "structure": "STR945266",
                                "storage": [
                                    {
                                        "provider": "constructn-oss",
                                        "path": "PRJ201897/structures/STR945266/designs/DSG261968/Block A2.rvt",
                                        "providerType": "internal",
                                        "format": ".RVT"
                                    },
                                    {
                                        "provider": "autodesk-oss",
                                        "pathId": "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWRoYW5pX2tvcmVnYW9uX3BhcmtfcHVuZS8lMkZQUkoyMDE4OTclMkZzdHJ1Y3R1cmVzJTJGU1RSNTExODc2JTJGZGVzaWducyUyRkRTRzI4MjkwNCUyRmFkaGFuaV9hMl9ibG9jay5ydnQ",
                                        "providerType": "external",
                                        "format": ".SVF2"
                                    }
                                ],
                                "createdAt": "2023-02-09T12:45:58.692Z",
                                "updatedAt": "2023-02-09T12:45:58.692Z",
                                "__v": 0
                            }
                        ]
                    },
                    {
                        "_id": "STR955240",
                        "name": "11_Floor_A2_Block",
                        "type": "Interior",
                        "isExterior": false,
                        "project": "PRJ201897",
                        "parent": "STR511876",
                        "children": [],
                        "location": [],
                        "designs": [
                            {
                                "_id": "DSG192441",
                                "type": "Plan Drawings",
                                "name": "floormap.pdf",
                                "project": "PRJ201897",
                                "structure": "STR955240",
                                "storage": [
                                    {
                                        "provider": "constructn-oss",
                                        "path": "PRJ201897/structures/STR955240/designs/DSG192441/floormap.pdf",
                                        "providerType": "internal",
                                        "format": ".PDF"
                                    },
                                    {
                                        "provider": "autodesk-oss",
                                        "pathId": "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWRoYW5pX2tvcmVnYW9uX3BhcmtfcHVuZS8lMkZQUkoyMDE4OTclMkZzdHJ1Y3R1cmVzJTJGU1RSOTU1MjQwJTJGZGVzaWducyUyRkRTRzE5MjQ0MSUyRkEyLUYxMS5wZGY",
                                        "providerType": "external",
                                        "format": ".SVF2"
                                    }
                                ],
                                "createdAt": "2023-02-09T12:46:13.138Z",
                                "updatedAt": "2023-02-09T12:46:13.138Z",
                                "__v": 0
                            },
                            {
                                "_id": "DSG273348",
                                "type": "BIM",
                                "name": "Block A2.rvt",
                                "project": "PRJ201897",
                                "structure": "STR955240",
                                "storage": [
                                    {
                                        "provider": "constructn-oss",
                                        "path": "PRJ201897/structures/STR955240/designs/DSG273348/Block A2.rvt",
                                        "providerType": "internal",
                                        "format": ".RVT"
                                    },
                                    {
                                        "provider": "autodesk-oss",
                                        "pathId": "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWRoYW5pX2tvcmVnYW9uX3BhcmtfcHVuZS8lMkZQUkoyMDE4OTclMkZzdHJ1Y3R1cmVzJTJGU1RSNTExODc2JTJGZGVzaWducyUyRkRTRzI4MjkwNCUyRmFkaGFuaV9hMl9ibG9jay5ydnQ",
                                        "providerType": "external",
                                        "format": ".SVF2"
                                    }
                                ],
                                "createdAt": "2023-02-09T12:46:13.138Z",
                                "updatedAt": "2023-02-09T12:46:13.138Z",
                                "__v": 0
                            }
                        ]
                    },
                    {
                        "_id": "STR964196",
                        "name": "12_Floor_A2_Block",
                        "type": "Interior",
                        "isExterior": false,
                        "project": "PRJ201897",
                        "parent": "STR511876",
                        "children": [],
                        "location": [],
                        "designs": [
                            {
                                "_id": "DSG203802",
                                "type": "Plan Drawings",
                                "name": "floormap.pdf",
                                "project": "PRJ201897",
                                "structure": "STR964196",
                                "storage": [
                                    {
                                        "provider": "constructn-oss",
                                        "path": "PRJ201897/structures/STR964196/designs/DSG203802/floormap.pdf",
                                        "providerType": "internal",
                                        "format": ".PDF"
                                    },
                                    {
                                        "provider": "autodesk-oss",
                                        "pathId": "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWRoYW5pX2tvcmVnYW9uX3BhcmtfcHVuZS8lMkZQUkoyMDE4OTclMkZzdHJ1Y3R1cmVzJTJGU1RSOTY0MTk2JTJGZGVzaWducyUyRkRTRzIwMzgwMiUyRkEyLUYxMi5wZGY",
                                        "providerType": "external",
                                        "format": ".SVF2"
                                    }
                                ],
                                "createdAt": "2023-02-09T12:46:21.466Z",
                                "updatedAt": "2023-02-09T12:46:21.466Z",
                                "__v": 0
                            },
                            {
                                "_id": "DSG289946",
                                "type": "BIM",
                                "name": "Block A2.rvt",
                                "project": "PRJ201897",
                                "structure": "STR964196",
                                "storage": [
                                    {
                                        "provider": "constructn-oss",
                                        "path": "PRJ201897/structures/STR964196/designs/DSG289946/Block A2.rvt",
                                        "providerType": "internal",
                                        "format": ".RVT"
                                    },
                                    {
                                        "provider": "autodesk-oss",
                                        "pathId": "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWRoYW5pX2tvcmVnYW9uX3BhcmtfcHVuZS8lMkZQUkoyMDE4OTclMkZzdHJ1Y3R1cmVzJTJGU1RSNTExODc2JTJGZGVzaWducyUyRkRTRzI4MjkwNCUyRmFkaGFuaV9hMl9ibG9jay5ydnQ",
                                        "providerType": "external",
                                        "format": ".SVF2"
                                    }
                                ],
                                "createdAt": "2023-02-09T12:46:21.466Z",
                                "updatedAt": "2023-02-09T12:46:21.466Z",
                                "__v": 0
                            }
                        ]
                    },
                    {
                        "_id": "STR975073",
                        "name": "13_Floor_A2_Block",
                        "type": "Interior",
                        "isExterior": false,
                        "project": "PRJ201897",
                        "parent": "STR511876",
                        "children": [],
                        "location": [],
                        "designs": [
                            {
                                "_id": "DSG215172",
                                "type": "Plan Drawings",
                                "name": "floormap.pdf",
                                "project": "PRJ201897",
                                "structure": "STR975073",
                                "storage": [
                                    {
                                        "provider": "constructn-oss",
                                        "path": "PRJ201897/structures/STR975073/designs/DSG215172/floormap.pdf",
                                        "providerType": "internal",
                                        "format": ".PDF"
                                    },
                                    {
                                        "provider": "autodesk-oss",
                                        "pathId": "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWRoYW5pX2tvcmVnYW9uX3BhcmtfcHVuZS8lMkZQUkoyMDE4OTclMkZzdHJ1Y3R1cmVzJTJGU1RSOTc1MDczJTJGZGVzaWducyUyRkRTRzIxNTE3MiUyRkEyLUYxMy5wZGY",
                                        "providerType": "external",
                                        "format": ".SVF2"
                                    }
                                ],
                                "createdAt": "2023-02-09T12:46:34.611Z",
                                "updatedAt": "2023-02-09T12:46:34.611Z",
                                "__v": 0
                            },
                            {
                                "_id": "DSG300097",
                                "type": "BIM",
                                "name": "Block A2.rvt",
                                "project": "PRJ201897",
                                "structure": "STR975073",
                                "storage": [
                                    {
                                        "provider": "constructn-oss",
                                        "path": "PRJ201897/structures/STR975073/designs/DSG300097/Block A2.rvt",
                                        "providerType": "internal",
                                        "format": ".RVT"
                                    },
                                    {
                                        "provider": "autodesk-oss",
                                        "pathId": "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWRoYW5pX2tvcmVnYW9uX3BhcmtfcHVuZS8lMkZQUkoyMDE4OTclMkZzdHJ1Y3R1cmVzJTJGU1RSNTExODc2JTJGZGVzaWducyUyRkRTRzI4MjkwNCUyRmFkaGFuaV9hMl9ibG9jay5ydnQ",
                                        "providerType": "external",
                                        "format": ".SVF2"
                                    }
                                ],
                                "createdAt": "2023-02-09T12:46:34.611Z",
                                "updatedAt": "2023-02-09T12:46:34.611Z",
                                "__v": 0
                            }
                        ]
                    },
                    {
                        "_id": "STR983715",
                        "name": "14_Floor_A2_Block",
                        "type": "Interior",
                        "isExterior": false,
                        "project": "PRJ201897",
                        "parent": "STR511876",
                        "children": [],
                        "location": [],
                        "designs": [
                            {
                                "_id": "DSG225990",
                                "type": "Plan Drawings",
                                "name": "floormap.pdf",
                                "project": "PRJ201897",
                                "structure": "STR983715",
                                "storage": [
                                    {
                                        "provider": "constructn-oss",
                                        "path": "PRJ201897/structures/STR983715/designs/DSG225990/floormap.pdf",
                                        "providerType": "internal",
                                        "format": ".PDF"
                                    },
                                    {
                                        "provider": "autodesk-oss",
                                        "pathId": "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWRoYW5pX2tvcmVnYW9uX3BhcmtfcHVuZS8lMkZQUkoyMDE4OTclMkZzdHJ1Y3R1cmVzJTJGU1RSOTgzNzE1JTJGZGVzaWducyUyRkRTRzIyNTk5MCUyRkEyLUYxNC5wZGY",
                                        "providerType": "external",
                                        "format": ".SVF2"
                                    }
                                ],
                                "createdAt": "2023-02-09T12:46:43.916Z",
                                "updatedAt": "2023-02-09T12:46:43.916Z",
                                "__v": 0
                            },
                            {
                                "_id": "DSG309798",
                                "type": "BIM",
                                "name": "Block A2.rvt",
                                "project": "PRJ201897",
                                "structure": "STR983715",
                                "storage": [
                                    {
                                        "provider": "constructn-oss",
                                        "path": "PRJ201897/structures/STR983715/designs/DSG309798/Block A2.rvt",
                                        "providerType": "internal",
                                        "format": ".RVT"
                                    },
                                    {
                                        "provider": "autodesk-oss",
                                        "pathId": "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWRoYW5pX2tvcmVnYW9uX3BhcmtfcHVuZS8lMkZQUkoyMDE4OTclMkZzdHJ1Y3R1cmVzJTJGU1RSNTExODc2JTJGZGVzaWducyUyRkRTRzI4MjkwNCUyRmFkaGFuaV9hMl9ibG9jay5ydnQ",
                                        "providerType": "external",
                                        "format": ".SVF2"
                                    }
                                ],
                                "createdAt": "2023-02-09T12:46:43.916Z",
                                "updatedAt": "2023-02-09T12:46:43.916Z",
                                "__v": 0
                            }
                        ]
                    },
                    {
                        "_id": "STR994259",
                        "name": "15_Floor_A2_Block",
                        "type": "Interior",
                        "isExterior": false,
                        "project": "PRJ201897",
                        "parent": "STR511876",
                        "children": [],
                        "location": [],
                        "designs": [
                            {
                                "_id": "DSG235524",
                                "type": "Plan Drawings",
                                "name": "floormap.pdf",
                                "project": "PRJ201897",
                                "structure": "STR994259",
                                "storage": [
                                    {
                                        "provider": "constructn-oss",
                                        "path": "PRJ201897/structures/STR994259/designs/DSG235524/floormap.pdf",
                                        "providerType": "internal",
                                        "format": ".PDF"
                                    },
                                    {
                                        "provider": "autodesk-oss",
                                        "pathId": "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWRoYW5pX2tvcmVnYW9uX3BhcmtfcHVuZS8lMkZQUkoyMDE4OTclMkZzdHJ1Y3R1cmVzJTJGU1RSOTk0MjU5JTJGZGVzaWducyUyRkRTRzIzNTUyNCUyRkEyLUYxNS5wZGY",
                                        "providerType": "external",
                                        "format": ".SVF2"
                                    }
                                ],
                                "createdAt": "2023-02-09T12:46:52.300Z",
                                "updatedAt": "2023-02-09T12:46:52.300Z",
                                "__v": 0
                            },
                            {
                                "_id": "DSG323725",
                                "type": "BIM",
                                "name": "Block A2.rvt",
                                "project": "PRJ201897",
                                "structure": "STR994259",
                                "storage": [
                                    {
                                        "provider": "constructn-oss",
                                        "path": "PRJ201897/structures/STR994259/designs/DSG323725/Block A2.rvt",
                                        "providerType": "internal",
                                        "format": ".RVT"
                                    },
                                    {
                                        "provider": "autodesk-oss",
                                        "pathId": "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWRoYW5pX2tvcmVnYW9uX3BhcmtfcHVuZS8lMkZQUkoyMDE4OTclMkZzdHJ1Y3R1cmVzJTJGU1RSNTExODc2JTJGZGVzaWducyUyRkRTRzI4MjkwNCUyRmFkaGFuaV9hMl9ibG9jay5ydnQ",
                                        "providerType": "external",
                                        "format": ".SVF2"
                                    }
                                ],
                                "createdAt": "2023-02-09T12:46:52.300Z",
                                "updatedAt": "2023-02-09T12:46:52.300Z",
                                "__v": 0
                            }
                        ]
                    },
                    {
                        "_id": "STR017107",
                        "name": "16_Floor_A2_Block",
                        "type": "Interior",
                        "isExterior": false,
                        "project": "PRJ201897",
                        "parent": "STR511876",
                        "children": [],
                        "location": [],
                        "designs": [
                            {
                                "_id": "DSG246106",
                                "type": "Plan Drawings",
                                "name": "floormap.pdf",
                                "project": "PRJ201897",
                                "structure": "STR017107",
                                "storage": [
                                    {
                                        "provider": "constructn-oss",
                                        "path": "PRJ201897/structures/STR017107/designs/DSG246106/floormap.pdf",
                                        "providerType": "internal",
                                        "format": ".PDF"
                                    },
                                    {
                                        "provider": "autodesk-oss",
                                        "pathId": "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWRoYW5pX2tvcmVnYW9uX3BhcmtfcHVuZS8lMkZQUkoyMDE4OTclMkZzdHJ1Y3R1cmVzJTJGU1RSMDE3MTA3JTJGZGVzaWducyUyRkRTRzI0NjEwNiUyRkEyLUYxNi5wZGY",
                                        "providerType": "external",
                                        "format": ".SVF2"
                                    }
                                ],
                                "createdAt": "2023-02-09T12:46:59.391Z",
                                "updatedAt": "2023-02-09T12:46:59.391Z",
                                "__v": 0
                            },
                            {
                                "_id": "DSG334072",
                                "type": "BIM",
                                "name": "Block A2.rvt",
                                "project": "PRJ201897",
                                "structure": "STR017107",
                                "storage": [
                                    {
                                        "provider": "constructn-oss",
                                        "path": "PRJ201897/structures/STR017107/designs/DSG334072/Block A2.rvt",
                                        "providerType": "internal",
                                        "format": ".RVT"
                                    },
                                    {
                                        "provider": "autodesk-oss",
                                        "pathId": "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWRoYW5pX2tvcmVnYW9uX3BhcmtfcHVuZS8lMkZQUkoyMDE4OTclMkZzdHJ1Y3R1cmVzJTJGU1RSNTExODc2JTJGZGVzaWducyUyRkRTRzI4MjkwNCUyRmFkaGFuaV9hMl9ibG9jay5ydnQ",
                                        "providerType": "external",
                                        "format": ".SVF2"
                                    }
                                ],
                                "createdAt": "2023-02-09T12:46:59.391Z",
                                "updatedAt": "2023-02-09T12:46:59.391Z",
                                "__v": 0
                            }
                        ]
                    }
                ],
                "location": [],
                "designs": [
                    {
                        "_id": "DSG282904",
                        "type": "BIM",
                        "name": "adhani_a2_block.rvt",
                        "project": "PRJ201897",
                        "structure": "STR511876",
                        "storage": [
                            {
                                "provider": "constructn-oss",
                                "path": "PRJ201897/structures/STR511876/designs/DSG282904/adhani_a2_block.rvt",
                                "providerType": "internal",
                                "format": ".RVT"
                            }
                        ],
                        "createdAt": "2023-02-10T06:09:05.196Z",
                        "updatedAt": "2023-02-10T06:09:05.196Z",
                        "__v": 0
                    }
                ]
            },
            {
                "_id": "STR550768",
                "name": "C_Block",
                "type": "Exterior",
                "isExterior": true,
                "project": "PRJ201897",
                "parent": "STR468587",
                "children": [
                    {
                        "_id": "STR132657",
                        "name": "1_Floor_C_Block",
                        "type": "Interior",
                        "isExterior": false,
                        "project": "PRJ201897",
                        "parent": "STR550768",
                        "children": [],
                        "location": [],
                        "designs": [
                            {
                                "_id": "DSG269650",
                                "type": "Plan Drawings",
                                "name": "floormap.pdf",
                                "project": "PRJ201897",
                                "structure": "STR132657",
                                "storage": [
                                    {
                                        "provider": "constructn-oss",
                                        "path": "PRJ201897/structures/STR132657/designs/DSG269650/floormap.pdf",
                                        "providerType": "internal",
                                        "format": ".PDF"
                                    },
                                    {
                                        "provider": "autodesk-oss",
                                        "pathId": "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWRoYW5pX2tvcmVnYW9uX3BhcmtfcHVuZS8lMkZQUkoyMDE4OTclMkZzdHJ1Y3R1cmVzJTJGU1RSMTMyNjU3JTJGZGVzaWducyUyRkRTRzI2OTY1MCUyRkMtRjEucGRm",
                                        "providerType": "external",
                                        "format": ".SVF2"
                                    }
                                ],
                                "createdAt": "2023-02-09T12:48:07.420Z",
                                "updatedAt": "2023-02-09T12:48:07.420Z",
                                "__v": 0
                            },
                            {
                                "_id": "DSG239842",
                                "type": "BIM",
                                "name": "Block C.rvt",
                                "project": "PRJ201897",
                                "structure": "STR132657",
                                "storage": [
                                    {
                                        "provider": "constructn-oss",
                                        "path": "PRJ201897/structures/STR132657/designs/DSG239842/Block C.rvt",
                                        "providerType": "internal",
                                        "format": ".RVT"
                                    },
                                    {
                                        "provider": "autodesk-oss",
                                        "pathId": "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWRoYW5pX2tvcmVnYW9uX3BhcmtfcHVuZS8lMkZQUkoyMDE4OTclMkZzdHJ1Y3R1cmVzJTJGU1RSNTUwNzY4JTJGZGVzaWducyUyRkRTRzMwMjM4MyUyRmFkaGFuaV9jX2Jsb2NrLnJ2dA",
                                        "providerType": "external",
                                        "format": ".SVF2"
                                    }
                                ],
                                "createdAt": "2023-02-09T12:48:07.420Z",
                                "updatedAt": "2023-02-09T12:48:07.420Z",
                                "__v": 0
                            }
                        ]
                    },
                    {
                        "_id": "STR150123",
                        "name": "2_Floor_C_Block",
                        "type": "Interior",
                        "isExterior": false,
                        "project": "PRJ201897",
                        "parent": "STR550768",
                        "children": [],
                        "location": [],
                        "designs": [
                            {
                                "_id": "DSG281043",
                                "type": "Plan Drawings",
                                "name": "floormap.pdf",
                                "project": "PRJ201897",
                                "structure": "STR150123",
                                "storage": [
                                    {
                                        "provider": "constructn-oss",
                                        "path": "PRJ201897/structures/STR150123/designs/DSG281043/floormap.pdf",
                                        "providerType": "internal",
                                        "format": ".PDF"
                                    },
                                    {
                                        "provider": "autodesk-oss",
                                        "pathId": "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWRoYW5pX2tvcmVnYW9uX3BhcmtfcHVuZS8lMkZQUkoyMDE4OTclMkZzdHJ1Y3R1cmVzJTJGU1RSMTUwMTIzJTJGZGVzaWducyUyRkRTRzI4MTA0MyUyRkMtRjIucGRm",
                                        "providerType": "external",
                                        "format": ".SVF2"
                                    }
                                ],
                                "createdAt": "2023-02-09T12:48:16.162Z",
                                "updatedAt": "2023-02-09T12:48:16.162Z",
                                "__v": 0
                            },
                            {
                                "_id": "DSG259531",
                                "type": "BIM",
                                "name": "Block C.rvt",
                                "project": "PRJ201897",
                                "structure": "STR150123",
                                "storage": [
                                    {
                                        "provider": "constructn-oss",
                                        "path": "PRJ201897/structures/STR150123/designs/DSG259531/Block C.rvt",
                                        "providerType": "internal",
                                        "format": ".RVT"
                                    },
                                    {
                                        "provider": "autodesk-oss",
                                        "pathId": "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWRoYW5pX2tvcmVnYW9uX3BhcmtfcHVuZS8lMkZQUkoyMDE4OTclMkZzdHJ1Y3R1cmVzJTJGU1RSNTUwNzY4JTJGZGVzaWducyUyRkRTRzMwMjM4MyUyRmFkaGFuaV9jX2Jsb2NrLnJ2dA",
                                        "providerType": "external",
                                        "format": ".SVF2"
                                    }
                                ],
                                "createdAt": "2023-02-09T12:48:16.162Z",
                                "updatedAt": "2023-02-09T12:48:16.162Z",
                                "__v": 0
                            }
                        ]
                    },
                    {
                        "_id": "STR157641",
                        "name": "3_Floor_C_Block",
                        "type": "Interior",
                        "isExterior": false,
                        "project": "PRJ201897",
                        "parent": "STR550768",
                        "children": [],
                        "location": [],
                        "designs": [
                            {
                                "_id": "DSG290681",
                                "type": "Plan Drawings",
                                "name": "floormap.pdf",
                                "project": "PRJ201897",
                                "structure": "STR157641",
                                "storage": [
                                    {
                                        "provider": "constructn-oss",
                                        "path": "PRJ201897/structures/STR157641/designs/DSG290681/floormap.pdf",
                                        "providerType": "internal",
                                        "format": ".PDF"
                                    },
                                    {
                                        "provider": "autodesk-oss",
                                        "pathId": "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWRoYW5pX2tvcmVnYW9uX3BhcmtfcHVuZS8lMkZQUkoyMDE4OTclMkZzdHJ1Y3R1cmVzJTJGU1RSMTU3NjQxJTJGZGVzaWducyUyRkRTRzI5MDY4MSUyRkMtRjMucGRm",
                                        "providerType": "external",
                                        "format": ".SVF2"
                                    }
                                ],
                                "createdAt": "2023-02-09T12:48:23.794Z",
                                "updatedAt": "2023-02-09T12:48:23.794Z",
                                "__v": 0
                            },
                            {
                                "_id": "DSG270662",
                                "type": "BIM",
                                "name": "Block C.rvt",
                                "project": "PRJ201897",
                                "structure": "STR157641",
                                "storage": [
                                    {
                                        "provider": "constructn-oss",
                                        "path": "PRJ201897/structures/STR157641/designs/DSG270662/Block C.rvt",
                                        "providerType": "internal",
                                        "format": ".RVT"
                                    },
                                    {
                                        "provider": "autodesk-oss",
                                        "pathId": "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWRoYW5pX2tvcmVnYW9uX3BhcmtfcHVuZS8lMkZQUkoyMDE4OTclMkZzdHJ1Y3R1cmVzJTJGU1RSNTUwNzY4JTJGZGVzaWducyUyRkRTRzMwMjM4MyUyRmFkaGFuaV9jX2Jsb2NrLnJ2dA",
                                        "providerType": "external",
                                        "format": ".SVF2"
                                    }
                                ],
                                "createdAt": "2023-02-09T12:48:23.794Z",
                                "updatedAt": "2023-02-09T12:48:23.794Z",
                                "__v": 0
                            }
                        ]
                    },
                    {
                        "_id": "STR166364",
                        "name": "4_Floor_C_Block",
                        "type": "Interior",
                        "isExterior": false,
                        "project": "PRJ201897",
                        "parent": "STR550768",
                        "children": [],
                        "location": [],
                        "designs": [
                            {
                                "_id": "DSG301033",
                                "type": "Plan Drawings",
                                "name": "floormap.pdf",
                                "project": "PRJ201897",
                                "structure": "STR166364",
                                "storage": [
                                    {
                                        "provider": "constructn-oss",
                                        "path": "PRJ201897/structures/STR166364/designs/DSG301033/floormap.pdf",
                                        "providerType": "internal",
                                        "format": ".PDF"
                                    },
                                    {
                                        "provider": "autodesk-oss",
                                        "pathId": "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWRoYW5pX2tvcmVnYW9uX3BhcmtfcHVuZS8lMkZQUkoyMDE4OTclMkZzdHJ1Y3R1cmVzJTJGU1RSMTY2MzY0JTJGZGVzaWducyUyRkRTRzMwMTAzMyUyRkMtRjQucGRm",
                                        "providerType": "external",
                                        "format": ".SVF2"
                                    }
                                ],
                                "createdAt": "2023-02-09T12:48:29.822Z",
                                "updatedAt": "2023-02-09T12:48:29.822Z",
                                "__v": 0
                            },
                            {
                                "_id": "DSG345042",
                                "type": "BIM",
                                "name": "Block C.rvt",
                                "project": "PRJ201897",
                                "structure": "STR166364",
                                "storage": [
                                    {
                                        "provider": "constructn-oss",
                                        "path": "PRJ201897/structures/STR166364/designs/DSG345042/Block C.rvt",
                                        "providerType": "internal",
                                        "format": ".RVT"
                                    },
                                    {
                                        "provider": "autodesk-oss",
                                        "pathId": "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWRoYW5pX2tvcmVnYW9uX3BhcmtfcHVuZS8lMkZQUkoyMDE4OTclMkZzdHJ1Y3R1cmVzJTJGU1RSNTUwNzY4JTJGZGVzaWducyUyRkRTRzMwMjM4MyUyRmFkaGFuaV9jX2Jsb2NrLnJ2dA",
                                        "providerType": "external",
                                        "format": ".SVF2"
                                    }
                                ],
                                "createdAt": "2023-02-09T12:48:29.822Z",
                                "updatedAt": "2023-02-09T12:48:29.822Z",
                                "__v": 0
                            }
                        ]
                    },
                    {
                        "_id": "STR199951",
                        "name": "5_Floor_C_Block",
                        "type": "Interior",
                        "isExterior": false,
                        "project": "PRJ201897",
                        "parent": "STR550768",
                        "children": [],
                        "location": [],
                        "designs": [
                            {
                                "_id": "DSG312160",
                                "type": "Plan Drawings",
                                "name": "floormap.pdf",
                                "project": "PRJ201897",
                                "structure": "STR199951",
                                "storage": [
                                    {
                                        "provider": "constructn-oss",
                                        "path": "PRJ201897/structures/STR199951/designs/DSG312160/floormap.pdf",
                                        "providerType": "internal",
                                        "format": ".PDF"
                                    },
                                    {
                                        "provider": "autodesk-oss",
                                        "pathId": "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWRoYW5pX2tvcmVnYW9uX3BhcmtfcHVuZS8lMkZQUkoyMDE4OTclMkZzdHJ1Y3R1cmVzJTJGU1RSMTk5OTUxJTJGZGVzaWducyUyRkRTRzMxMjE2MCUyRkMtRjUucGRm",
                                        "providerType": "external",
                                        "format": ".SVF2"
                                    }
                                ],
                                "createdAt": "2023-02-09T12:48:36.056Z",
                                "updatedAt": "2023-02-09T12:48:36.056Z",
                                "__v": 0
                            },
                            {
                                "_id": "DSG359478",
                                "type": "BIM",
                                "name": "Block C.rvt",
                                "project": "PRJ201897",
                                "structure": "STR199951",
                                "storage": [
                                    {
                                        "provider": "constructn-oss",
                                        "path": "PRJ201897/structures/STR199951/designs/DSG359478/Block C.rvt",
                                        "providerType": "internal",
                                        "format": ".RVT"
                                    },
                                    {
                                        "provider": "autodesk-oss",
                                        "pathId": "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWRoYW5pX2tvcmVnYW9uX3BhcmtfcHVuZS8lMkZQUkoyMDE4OTclMkZzdHJ1Y3R1cmVzJTJGU1RSNTUwNzY4JTJGZGVzaWducyUyRkRTRzMwMjM4MyUyRmFkaGFuaV9jX2Jsb2NrLnJ2dA",
                                        "providerType": "external",
                                        "format": ".SVF2"
                                    }
                                ],
                                "createdAt": "2023-02-09T12:48:36.056Z",
                                "updatedAt": "2023-02-09T12:48:36.056Z",
                                "__v": 0
                            }
                        ]
                    },
                    {
                        "_id": "STR208517",
                        "name": "6_Floor_C_Block",
                        "type": "Interior",
                        "isExterior": false,
                        "project": "PRJ201897",
                        "parent": "STR550768",
                        "children": [],
                        "location": [],
                        "designs": [
                            {
                                "_id": "DSG326350",
                                "type": "Plan Drawings",
                                "name": "floormap.pdf",
                                "project": "PRJ201897",
                                "structure": "STR208517",
                                "storage": [
                                    {
                                        "provider": "constructn-oss",
                                        "path": "PRJ201897/structures/STR208517/designs/DSG326350/floormap.pdf",
                                        "providerType": "internal",
                                        "format": ".PDF"
                                    },
                                    {
                                        "provider": "autodesk-oss",
                                        "pathId": "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWRoYW5pX2tvcmVnYW9uX3BhcmtfcHVuZS8lMkZQUkoyMDE4OTclMkZzdHJ1Y3R1cmVzJTJGU1RSMjA4NTE3JTJGZGVzaWducyUyRkRTRzMyNjM1MCUyRkMtRjYucGRm",
                                        "providerType": "external",
                                        "format": ".SVF2"
                                    }
                                ],
                                "createdAt": "2023-02-09T12:48:42.271Z",
                                "updatedAt": "2023-02-09T12:48:42.271Z",
                                "__v": 0
                            },
                            {
                                "_id": "DSG370074",
                                "type": "BIM",
                                "name": "Block C.rvt",
                                "project": "PRJ201897",
                                "structure": "STR208517",
                                "storage": [
                                    {
                                        "provider": "constructn-oss",
                                        "path": "PRJ201897/structures/STR208517/designs/DSG370074/Block C.rvt",
                                        "providerType": "internal",
                                        "format": ".RVT"
                                    },
                                    {
                                        "provider": "autodesk-oss",
                                        "pathId": "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWRoYW5pX2tvcmVnYW9uX3BhcmtfcHVuZS8lMkZQUkoyMDE4OTclMkZzdHJ1Y3R1cmVzJTJGU1RSNTUwNzY4JTJGZGVzaWducyUyRkRTRzMwMjM4MyUyRmFkaGFuaV9jX2Jsb2NrLnJ2dA",
                                        "providerType": "external",
                                        "format": ".SVF2"
                                    }
                                ],
                                "createdAt": "2023-02-09T12:48:42.271Z",
                                "updatedAt": "2023-02-09T12:48:42.271Z",
                                "__v": 0
                            }
                        ]
                    },
                    {
                        "_id": "STR222418",
                        "name": "7_Floor_C_Block",
                        "type": "Interior",
                        "isExterior": false,
                        "project": "PRJ201897",
                        "parent": "STR550768",
                        "children": [],
                        "location": [],
                        "designs": [
                            {
                                "_id": "DSG337317",
                                "type": "Plan Drawings",
                                "name": "floormap.pdf",
                                "project": "PRJ201897",
                                "structure": "STR222418",
                                "storage": [
                                    {
                                        "provider": "constructn-oss",
                                        "path": "PRJ201897/structures/STR222418/designs/DSG337317/floormap.pdf",
                                        "providerType": "internal",
                                        "format": ".PDF"
                                    },
                                    {
                                        "provider": "autodesk-oss",
                                        "pathId": "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWRoYW5pX2tvcmVnYW9uX3BhcmtfcHVuZS8lMkZQUkoyMDE4OTclMkZzdHJ1Y3R1cmVzJTJGU1RSMjIyNDE4JTJGZGVzaWducyUyRkRTRzMzNzMxNyUyRkMtRjcucGRm",
                                        "providerType": "external",
                                        "format": ".SVF2"
                                    }
                                ],
                                "createdAt": "2023-02-09T12:48:49.104Z",
                                "updatedAt": "2023-02-09T12:48:49.104Z",
                                "__v": 0
                            },
                            {
                                "_id": "DSG436987",
                                "type": "BIM",
                                "name": "Block C.rvt",
                                "project": "PRJ201897",
                                "structure": "STR222418",
                                "storage": [
                                    {
                                        "provider": "constructn-oss",
                                        "path": "PRJ201897/structures/STR222418/designs/DSG436987/Block C.rvt",
                                        "providerType": "internal",
                                        "format": ".RVT"
                                    },
                                    {
                                        "provider": "autodesk-oss",
                                        "pathId": "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWRoYW5pX2tvcmVnYW9uX3BhcmtfcHVuZS8lMkZQUkoyMDE4OTclMkZzdHJ1Y3R1cmVzJTJGU1RSNTUwNzY4JTJGZGVzaWducyUyRkRTRzMwMjM4MyUyRmFkaGFuaV9jX2Jsb2NrLnJ2dA",
                                        "providerType": "external",
                                        "format": ".SVF2"
                                    }
                                ],
                                "createdAt": "2023-02-09T12:48:49.104Z",
                                "updatedAt": "2023-02-09T12:48:49.104Z",
                                "__v": 0
                            }
                        ]
                    },
                    {
                        "_id": "STR232529",
                        "name": "8_Floor_C_Block",
                        "type": "Interior",
                        "isExterior": false,
                        "project": "PRJ201897",
                        "parent": "STR550768",
                        "children": [],
                        "location": [],
                        "designs": [
                            {
                                "_id": "DSG346435",
                                "type": "Plan Drawings",
                                "name": "floormap.pdf",
                                "project": "PRJ201897",
                                "structure": "STR232529",
                                "storage": [
                                    {
                                        "provider": "constructn-oss",
                                        "path": "PRJ201897/structures/STR232529/designs/DSG346435/floormap.pdf",
                                        "providerType": "internal",
                                        "format": ".PDF"
                                    },
                                    {
                                        "provider": "autodesk-oss",
                                        "pathId": "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWRoYW5pX2tvcmVnYW9uX3BhcmtfcHVuZS8lMkZQUkoyMDE4OTclMkZzdHJ1Y3R1cmVzJTJGU1RSMjMyNTI5JTJGZGVzaWducyUyRkRTRzM0NjQzNSUyRkMtRjgucGRm",
                                        "providerType": "external",
                                        "format": ".SVF2"
                                    }
                                ],
                                "createdAt": "2023-02-09T12:48:58.013Z",
                                "updatedAt": "2023-02-09T12:48:58.013Z",
                                "__v": 0
                            },
                            {
                                "_id": "DSG450583",
                                "type": "BIM",
                                "name": "Block C.rvt",
                                "project": "PRJ201897",
                                "structure": "STR232529",
                                "storage": [
                                    {
                                        "provider": "constructn-oss",
                                        "path": "PRJ201897/structures/STR232529/designs/DSG450583/Block C.rvt",
                                        "providerType": "internal",
                                        "format": ".RVT"
                                    },
                                    {
                                        "provider": "autodesk-oss",
                                        "pathId": "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWRoYW5pX2tvcmVnYW9uX3BhcmtfcHVuZS8lMkZQUkoyMDE4OTclMkZzdHJ1Y3R1cmVzJTJGU1RSNTUwNzY4JTJGZGVzaWducyUyRkRTRzMwMjM4MyUyRmFkaGFuaV9jX2Jsb2NrLnJ2dA",
                                        "providerType": "external",
                                        "format": ".SVF2"
                                    }
                                ],
                                "createdAt": "2023-02-09T12:48:58.013Z",
                                "updatedAt": "2023-02-09T12:48:58.013Z",
                                "__v": 0
                            }
                        ]
                    },
                    {
                        "_id": "STR242645",
                        "name": "9_Floor_C_Block",
                        "type": "Interior",
                        "isExterior": false,
                        "project": "PRJ201897",
                        "parent": "STR550768",
                        "children": [],
                        "location": [],
                        "designs": [
                            {
                                "_id": "DSG355171",
                                "type": "Plan Drawings",
                                "name": "floormap.pdf",
                                "project": "PRJ201897",
                                "structure": "STR242645",
                                "storage": [
                                    {
                                        "provider": "constructn-oss",
                                        "path": "PRJ201897/structures/STR242645/designs/DSG355171/floormap.pdf",
                                        "providerType": "internal",
                                        "format": ".PDF"
                                    },
                                    {
                                        "provider": "autodesk-oss",
                                        "pathId": "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWRoYW5pX2tvcmVnYW9uX3BhcmtfcHVuZS8lMkZQUkoyMDE4OTclMkZzdHJ1Y3R1cmVzJTJGU1RSMjQyNjQ1JTJGZGVzaWducyUyRkRTRzM1NTE3MSUyRkMtRjkucGRm",
                                        "providerType": "external",
                                        "format": ".SVF2"
                                    }
                                ],
                                "createdAt": "2023-02-09T12:49:06.229Z",
                                "updatedAt": "2023-02-09T12:49:06.229Z",
                                "__v": 0
                            },
                            {
                                "_id": "DSG470518",
                                "type": "BIM",
                                "name": "Block C.rvt",
                                "project": "PRJ201897",
                                "structure": "STR242645",
                                "storage": [
                                    {
                                        "provider": "constructn-oss",
                                        "path": "PRJ201897/structures/STR242645/designs/DSG470518/Block C.rvt",
                                        "providerType": "internal",
                                        "format": ".RVT"
                                    },
                                    {
                                        "provider": "autodesk-oss",
                                        "pathId": "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWRoYW5pX2tvcmVnYW9uX3BhcmtfcHVuZS8lMkZQUkoyMDE4OTclMkZzdHJ1Y3R1cmVzJTJGU1RSNTUwNzY4JTJGZGVzaWducyUyRkRTRzMwMjM4MyUyRmFkaGFuaV9jX2Jsb2NrLnJ2dA",
                                        "providerType": "external",
                                        "format": ".SVF2"
                                    }
                                ],
                                "createdAt": "2023-02-09T12:49:06.229Z",
                                "updatedAt": "2023-02-09T12:49:06.229Z",
                                "__v": 0
                            }
                        ]
                    },
                    {
                        "_id": "STR266282",
                        "name": "10_Floor_C_Block",
                        "type": "Interior",
                        "isExterior": false,
                        "project": "PRJ201897",
                        "parent": "STR550768",
                        "children": [],
                        "location": [],
                        "designs": [
                            {
                                "_id": "DSG364096",
                                "type": "Plan Drawings",
                                "name": "floormap.pdf",
                                "project": "PRJ201897",
                                "structure": "STR266282",
                                "storage": [
                                    {
                                        "provider": "constructn-oss",
                                        "path": "PRJ201897/structures/STR266282/designs/DSG364096/floormap.pdf",
                                        "providerType": "internal",
                                        "format": ".PDF"
                                    },
                                    {
                                        "provider": "autodesk-oss",
                                        "pathId": "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWRoYW5pX2tvcmVnYW9uX3BhcmtfcHVuZS8lMkZQUkoyMDE4OTclMkZzdHJ1Y3R1cmVzJTJGU1RSMjY2MjgyJTJGZGVzaWducyUyRkRTRzM2NDA5NiUyRkMtRjEwLnBkZg",
                                        "providerType": "external",
                                        "format": ".SVF2"
                                    }
                                ],
                                "createdAt": "2023-02-09T12:49:30.318Z",
                                "updatedAt": "2023-02-09T12:49:30.318Z",
                                "__v": 0
                            },
                            {
                                "_id": "DSG486163",
                                "type": "BIM",
                                "name": "Block C.rvt",
                                "project": "PRJ201897",
                                "structure": "STR266282",
                                "storage": [
                                    {
                                        "provider": "constructn-oss",
                                        "path": "PRJ201897/structures/STR266282/designs/DSG486163/Block C.rvt",
                                        "providerType": "internal",
                                        "format": ".RVT"
                                    },
                                    {
                                        "provider": "autodesk-oss",
                                        "pathId": "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWRoYW5pX2tvcmVnYW9uX3BhcmtfcHVuZS8lMkZQUkoyMDE4OTclMkZzdHJ1Y3R1cmVzJTJGU1RSNTUwNzY4JTJGZGVzaWducyUyRkRTRzMwMjM4MyUyRmFkaGFuaV9jX2Jsb2NrLnJ2dA",
                                        "providerType": "external",
                                        "format": ".SVF2"
                                    }
                                ],
                                "createdAt": "2023-02-09T12:49:30.318Z",
                                "updatedAt": "2023-02-09T12:49:30.318Z",
                                "__v": 0
                            }
                        ]
                    },
                    {
                        "_id": "STR276386",
                        "name": "11_Floor_C_Block",
                        "type": "Interior",
                        "isExterior": false,
                        "project": "PRJ201897",
                        "parent": "STR550768",
                        "children": [],
                        "location": [],
                        "designs": [
                            {
                                "_id": "DSG373888",
                                "type": "Plan Drawings",
                                "name": "floormap.pdf",
                                "project": "PRJ201897",
                                "structure": "STR276386",
                                "storage": [
                                    {
                                        "provider": "constructn-oss",
                                        "path": "PRJ201897/structures/STR276386/designs/DSG373888/floormap.pdf",
                                        "providerType": "internal",
                                        "format": ".PDF"
                                    },
                                    {
                                        "provider": "autodesk-oss",
                                        "pathId": "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWRoYW5pX2tvcmVnYW9uX3BhcmtfcHVuZS8lMkZQUkoyMDE4OTclMkZzdHJ1Y3R1cmVzJTJGU1RSMjc2Mzg2JTJGZGVzaWducyUyRkRTRzM3Mzg4OCUyRkMtRjExLnBkZg",
                                        "providerType": "external",
                                        "format": ".SVF2"
                                    }
                                ],
                                "createdAt": "2023-02-09T12:49:40.765Z",
                                "updatedAt": "2023-02-09T12:49:40.765Z",
                                "__v": 0
                            },
                            {
                                "_id": "DSG496021",
                                "type": "BIM",
                                "name": "Block C.rvt",
                                "project": "PRJ201897",
                                "structure": "STR276386",
                                "storage": [
                                    {
                                        "provider": "constructn-oss",
                                        "path": "PRJ201897/structures/STR276386/designs/DSG496021/Block C.rvt",
                                        "providerType": "internal",
                                        "format": ".RVT"
                                    },
                                    {
                                        "provider": "autodesk-oss",
                                        "pathId": "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWRoYW5pX2tvcmVnYW9uX3BhcmtfcHVuZS8lMkZQUkoyMDE4OTclMkZzdHJ1Y3R1cmVzJTJGU1RSNTUwNzY4JTJGZGVzaWducyUyRkRTRzMwMjM4MyUyRmFkaGFuaV9jX2Jsb2NrLnJ2dA",
                                        "providerType": "external",
                                        "format": ".SVF2"
                                    }
                                ],
                                "createdAt": "2023-02-09T12:49:40.765Z",
                                "updatedAt": "2023-02-09T12:49:40.765Z",
                                "__v": 0
                            }
                        ]
                    },
                    {
                        "_id": "STR303698",
                        "name": "12_Floor_C_Block",
                        "type": "Interior",
                        "isExterior": false,
                        "project": "PRJ201897",
                        "parent": "STR550768",
                        "children": [],
                        "location": [],
                        "designs": [
                            {
                                "_id": "DSG383735",
                                "type": "Plan Drawings",
                                "name": "floormap.pdf",
                                "project": "PRJ201897",
                                "structure": "STR303698",
                                "storage": [
                                    {
                                        "provider": "constructn-oss",
                                        "path": "PRJ201897/structures/STR303698/designs/DSG383735/floormap.pdf",
                                        "providerType": "internal",
                                        "format": ".PDF"
                                    },
                                    {
                                        "provider": "autodesk-oss",
                                        "pathId": "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWRoYW5pX2tvcmVnYW9uX3BhcmtfcHVuZS8lMkZQUkoyMDE4OTclMkZzdHJ1Y3R1cmVzJTJGU1RSMzAzNjk4JTJGZGVzaWducyUyRkRTRzM4MzczNSUyRkMtRjEyLnBkZg",
                                        "providerType": "external",
                                        "format": ".SVF2"
                                    }
                                ],
                                "createdAt": "2023-02-09T12:49:48.891Z",
                                "updatedAt": "2023-02-09T12:49:48.891Z",
                                "__v": 0
                            },
                            {
                                "_id": "DSG515935",
                                "type": "BIM",
                                "name": "Block C.rvt",
                                "project": "PRJ201897",
                                "structure": "STR303698",
                                "storage": [
                                    {
                                        "provider": "constructn-oss",
                                        "path": "PRJ201897/structures/STR303698/designs/DSG515935/Block C.rvt",
                                        "providerType": "internal",
                                        "format": ".RVT"
                                    },
                                    {
                                        "provider": "autodesk-oss",
                                        "pathId": "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWRoYW5pX2tvcmVnYW9uX3BhcmtfcHVuZS8lMkZQUkoyMDE4OTclMkZzdHJ1Y3R1cmVzJTJGU1RSNTUwNzY4JTJGZGVzaWducyUyRkRTRzMwMjM4MyUyRmFkaGFuaV9jX2Jsb2NrLnJ2dA",
                                        "providerType": "external",
                                        "format": ".SVF2"
                                    }
                                ],
                                "createdAt": "2023-02-09T12:49:48.891Z",
                                "updatedAt": "2023-02-09T12:49:48.891Z",
                                "__v": 0
                            }
                        ]
                    },
                    {
                        "_id": "STR368439",
                        "name": "13_Floor_C_Block",
                        "type": "Interior",
                        "isExterior": false,
                        "project": "PRJ201897",
                        "parent": "STR550768",
                        "children": [],
                        "location": [],
                        "designs": [
                            {
                                "_id": "DSG394388",
                                "type": "Plan Drawings",
                                "name": "floormap.pdf",
                                "project": "PRJ201897",
                                "structure": "STR368439",
                                "storage": [
                                    {
                                        "provider": "constructn-oss",
                                        "path": "PRJ201897/structures/STR368439/designs/DSG394388/floormap.pdf",
                                        "providerType": "internal",
                                        "format": ".PDF"
                                    },
                                    {
                                        "provider": "autodesk-oss",
                                        "pathId": "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWRoYW5pX2tvcmVnYW9uX3BhcmtfcHVuZS8lMkZQUkoyMDE4OTclMkZzdHJ1Y3R1cmVzJTJGU1RSMzY4NDM5JTJGZGVzaWducyUyRkRTRzM5NDM4OCUyRkMtRjEzLnBkZg",
                                        "providerType": "external",
                                        "format": ".SVF2"
                                    }
                                ],
                                "createdAt": "2023-02-09T12:49:56.965Z",
                                "updatedAt": "2023-02-09T12:49:56.965Z",
                                "__v": 0
                            },
                            {
                                "_id": "DSG526920",
                                "type": "BIM",
                                "name": "Block C.rvt",
                                "project": "PRJ201897",
                                "structure": "STR368439",
                                "storage": [
                                    {
                                        "provider": "constructn-oss",
                                        "path": "PRJ201897/structures/STR368439/designs/DSG526920/Block C.rvt",
                                        "providerType": "internal",
                                        "format": ".RVT"
                                    },
                                    {
                                        "provider": "autodesk-oss",
                                        "pathId": "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWRoYW5pX2tvcmVnYW9uX3BhcmtfcHVuZS8lMkZQUkoyMDE4OTclMkZzdHJ1Y3R1cmVzJTJGU1RSNTUwNzY4JTJGZGVzaWducyUyRkRTRzMwMjM4MyUyRmFkaGFuaV9jX2Jsb2NrLnJ2dA",
                                        "providerType": "external",
                                        "format": ".SVF2"
                                    }
                                ],
                                "createdAt": "2023-02-09T12:49:56.965Z",
                                "updatedAt": "2023-02-09T12:49:56.965Z",
                                "__v": 0
                            }
                        ]
                    },
                    {
                        "_id": "STR379409",
                        "name": "14_Floor_C_Block",
                        "type": "Interior",
                        "isExterior": false,
                        "project": "PRJ201897",
                        "parent": "STR550768",
                        "children": [],
                        "location": [],
                        "designs": [
                            {
                                "_id": "DSG406188",
                                "type": "Plan Drawings",
                                "name": "floormap.pdf",
                                "project": "PRJ201897",
                                "structure": "STR379409",
                                "storage": [
                                    {
                                        "provider": "constructn-oss",
                                        "path": "PRJ201897/structures/STR379409/designs/DSG406188/floormap.pdf",
                                        "providerType": "internal",
                                        "format": ".PDF"
                                    },
                                    {
                                        "provider": "autodesk-oss",
                                        "pathId": "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWRoYW5pX2tvcmVnYW9uX3BhcmtfcHVuZS8lMkZQUkoyMDE4OTclMkZzdHJ1Y3R1cmVzJTJGU1RSMzc5NDA5JTJGZGVzaWducyUyRkRTRzQwNjE4OCUyRkMtRjE0LnBkZg",
                                        "providerType": "external",
                                        "format": ".SVF2"
                                    }
                                ],
                                "createdAt": "2023-02-09T12:50:03.748Z",
                                "updatedAt": "2023-02-09T12:50:03.748Z",
                                "__v": 0
                            },
                            {
                                "_id": "DSG546117",
                                "type": "BIM",
                                "name": "Block C.rvt",
                                "project": "PRJ201897",
                                "structure": "STR379409",
                                "storage": [
                                    {
                                        "provider": "constructn-oss",
                                        "path": "PRJ201897/structures/STR379409/designs/DSG546117/Block C.rvt",
                                        "providerType": "internal",
                                        "format": ".RVT"
                                    },
                                    {
                                        "provider": "autodesk-oss",
                                        "pathId": "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWRoYW5pX2tvcmVnYW9uX3BhcmtfcHVuZS8lMkZQUkoyMDE4OTclMkZzdHJ1Y3R1cmVzJTJGU1RSNTUwNzY4JTJGZGVzaWducyUyRkRTRzMwMjM4MyUyRmFkaGFuaV9jX2Jsb2NrLnJ2dA",
                                        "providerType": "external",
                                        "format": ".SVF2"
                                    }
                                ],
                                "createdAt": "2023-02-09T12:50:03.748Z",
                                "updatedAt": "2023-02-09T12:50:03.748Z",
                                "__v": 0
                            }
                        ]
                    },
                    {
                        "_id": "STR416194",
                        "name": "15_Floor_C_Block",
                        "type": "Interior",
                        "isExterior": false,
                        "project": "PRJ201897",
                        "parent": "STR550768",
                        "children": [],
                        "location": [],
                        "designs": [
                            {
                                "_id": "DSG418315",
                                "type": "Plan Drawings",
                                "name": "floormap.pdf",
                                "project": "PRJ201897",
                                "structure": "STR416194",
                                "storage": [
                                    {
                                        "provider": "constructn-oss",
                                        "path": "PRJ201897/structures/STR416194/designs/DSG418315/floormap.pdf",
                                        "providerType": "internal",
                                        "format": ".PDF"
                                    },
                                    {
                                        "provider": "autodesk-oss",
                                        "pathId": "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWRoYW5pX2tvcmVnYW9uX3BhcmtfcHVuZS8lMkZQUkoyMDE4OTclMkZzdHJ1Y3R1cmVzJTJGU1RSNDE2MTk0JTJGZGVzaWducyUyRkRTRzQxODMxNSUyRkMtRjE1LnBkZg",
                                        "providerType": "external",
                                        "format": ".SVF2"
                                    }
                                ],
                                "createdAt": "2023-02-09T12:50:10.372Z",
                                "updatedAt": "2023-02-09T12:50:10.372Z",
                                "__v": 0
                            },
                            {
                                "_id": "DSG563879",
                                "type": "BIM",
                                "name": "Block C.rvt",
                                "project": "PRJ201897",
                                "structure": "STR416194",
                                "storage": [
                                    {
                                        "provider": "constructn-oss",
                                        "path": "PRJ201897/structures/STR416194/designs/DSG563879/Block C.rvt",
                                        "providerType": "internal",
                                        "format": ".RVT"
                                    },
                                    {
                                        "provider": "autodesk-oss",
                                        "pathId": "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWRoYW5pX2tvcmVnYW9uX3BhcmtfcHVuZS8lMkZQUkoyMDE4OTclMkZzdHJ1Y3R1cmVzJTJGU1RSNTUwNzY4JTJGZGVzaWducyUyRkRTRzMwMjM4MyUyRmFkaGFuaV9jX2Jsb2NrLnJ2dA",
                                        "providerType": "external",
                                        "format": ".SVF2"
                                    }
                                ],
                                "createdAt": "2023-02-09T12:50:10.372Z",
                                "updatedAt": "2023-02-09T12:50:10.372Z",
                                "__v": 0
                            }
                        ]
                    },
                    {
                        "_id": "STR424158",
                        "name": "16_Floor_C_Block",
                        "type": "Interior",
                        "isExterior": false,
                        "project": "PRJ201897",
                        "parent": "STR550768",
                        "children": [],
                        "location": [],
                        "designs": [
                            {
                                "_id": "DSG428083",
                                "type": "Plan Drawings",
                                "name": "floormap.pdf",
                                "project": "PRJ201897",
                                "structure": "STR424158",
                                "storage": [
                                    {
                                        "provider": "constructn-oss",
                                        "path": "PRJ201897/structures/STR424158/designs/DSG428083/floormap.pdf",
                                        "providerType": "internal",
                                        "format": ".PDF"
                                    },
                                    {
                                        "provider": "autodesk-oss",
                                        "pathId": "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWRoYW5pX2tvcmVnYW9uX3BhcmtfcHVuZS8lMkZQUkoyMDE4OTclMkZzdHJ1Y3R1cmVzJTJGU1RSNDI0MTU4JTJGZGVzaWducyUyRkRTRzQyODA4MyUyRkMtRjE2LnBkZg",
                                        "providerType": "external",
                                        "format": ".SVF2"
                                    }
                                ],
                                "createdAt": "2023-02-09T12:50:17.282Z",
                                "updatedAt": "2023-02-09T12:50:17.282Z",
                                "__v": 0
                            },
                            {
                                "_id": "DSG584917",
                                "type": "BIM",
                                "name": "Block C.rvt",
                                "project": "PRJ201897",
                                "structure": "STR424158",
                                "storage": [
                                    {
                                        "provider": "constructn-oss",
                                        "path": "PRJ201897/structures/STR424158/designs/DSG584917/Block C.rvt",
                                        "providerType": "internal",
                                        "format": ".RVT"
                                    },
                                    {
                                        "provider": "autodesk-oss",
                                        "pathId": "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWRoYW5pX2tvcmVnYW9uX3BhcmtfcHVuZS8lMkZQUkoyMDE4OTclMkZzdHJ1Y3R1cmVzJTJGU1RSNTUwNzY4JTJGZGVzaWducyUyRkRTRzMwMjM4MyUyRmFkaGFuaV9jX2Jsb2NrLnJ2dA",
                                        "providerType": "external",
                                        "format": ".SVF2"
                                    }
                                ],
                                "createdAt": "2023-02-09T12:50:17.282Z",
                                "updatedAt": "2023-02-09T12:50:17.282Z",
                                "__v": 0
                            }
                        ]
                    }
                ],
                "location": [],
                "designs": [
                    {
                        "_id": "DSG302383",
                        "type": "BIM",
                        "name": "adhani_c_block.rvt",
                        "project": "PRJ201897",
                        "structure": "STR550768",
                        "storage": [
                            {
                                "provider": "constructn-oss",
                                "path": "PRJ201897/structures/STR550768/designs/DSG302383/adhani_c_block.rvt",
                                "providerType": "internal",
                                "format": ".RVT"
                            }
                        ],
                        "createdAt": "2023-02-10T06:09:42.783Z",
                        "updatedAt": "2023-02-10T06:09:42.783Z",
                        "__v": 0
                    }
                ]
            }
        ],
        "location": [],
        "designs": []
    }
]
beforeEach(() => {
    const container = render(
        <ProjectHierarchy
            handleSearch={(event: React.ChangeEvent<HTMLInputElement>) => {}}
            title={"Project Hierarchy"}
            onCloseHandler={() => {}}
            treeData={treeData}
            setHierarchy={() => {}}
            getStructureData={() => {}}
            handleNodeSelection={() => {}}
            selectedNodes={() => {}}
            handleNodeExpand={() => {}}
            expandedNodes={['STR468587']}
          />
      );  
});

it("renders component unchanged", () => {
  const { container } = 
    render(

        <ProjectHierarchy
            handleSearch={(event: React.ChangeEvent<HTMLInputElement>) => {}}
            title={"Project Hierarchy"}
            onCloseHandler={jest.fn()}
            treeData={treeData}
            setHierarchy={true}
            getStructureData={jest.fn()}
            handleNodeSelection={jest.fn()}
            selectedNodes={jest.fn()}
            handleNodeExpand={jest.fn()}
            expandedNodes={[]}
          />
      ); 
  expect(container).toMatchSnapshot();
});
it("should check search functionality", () => {
    const search = screen.getAllByPlaceholderText('Search');
    fireEvent.change(search[0],{target:{value:'A'}});
    expect(search[0]).toBeInTheDocument()
})
// it("should check expand functionality", () => {
//     const search = screen.getAllByTestId('treeItem');
//     fireEvent.click(search[0]);
//     expect(screen.getByText('Adani Koregaon Park')).toBeInTheDocument()
// })

it("should check expand functionality", () => { 
    const search = screen.getAllByTestId("addIcon")
    fireEvent.click(document.getElementsByClassName('MuiTreeItem-iconContainer')[0])
    expect(screen.getByText('A3_Block')).toBeInTheDocument()
})

it("should check getStructure functionality", () => { 
    const search = screen.getAllByTestId("addIcon")
    fireEvent.click(document.getElementsByClassName('MuiTreeItem-iconContainer')[0])
    fireEvent.click(screen.getByText('A3_Block'))
    expect(screen.getByText('A3_Block')).toBeInTheDocument()
})

