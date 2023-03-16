
import TimeLineComponent from "../components/divami_components/timeline-container/TimeLineComponent";
import { fireEvent, render, screen } from "@testing-library/react";
import ProjectHierarchy from "../components/divami_components/project-hierarchy/ProjectHierarchy";
import '@testing-library/jest-dom';
import { getAllIds, getSelectedLayers, handleSelection } from "../components/divami_components/project-hierarchy/Utils";
import { ChildrenEntity } from "../models/IStructure";
import { RenderTree } from "../components/divami_components/project-hierarchy/Type";
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
                "children": [{
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
                },],
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
                "children": [{
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
                },],
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

it("should check expand functionality", () => { 
    const search = screen.getAllByTestId("addIcon")
    fireEvent.click(document.getElementsByClassName('MuiTreeItem-iconContainer')[0])
    expect(screen.getByText('A3_Block')).toBeInTheDocument()
})

it("should check getStructure functionality", () => { 
    fireEvent.click(document.getElementsByClassName('MuiTreeItem-iconContainer')[0])
    fireEvent.click(screen.getByText('A3_Block'))
    expect(screen.getByText('A3_Block')).toBeInTheDocument()
})

it("should check the getAllId's function", () => {
    const allIds = getAllIds(treeData)
    expect(allIds).toEqual(["STR468587","STR536138","STR511876","STR780049","STR550768","STR132657",])
})

it("should check getSelectedLayers function", () => {
    const selected = getSelectedLayers(treeData as unknown as ChildrenEntity[])
    expect(selected).toEqual([])
})

it("should check handleSelection function",() => {
    const selected = handleSelection(treeData as unknown as RenderTree[],'STR132657')
    expect(selected).not.toBeNull()
})
