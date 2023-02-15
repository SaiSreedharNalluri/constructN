import React, { useState } from "react";
import { ChildrenEntity } from "../../models/IStructure";
import Tree from "./tree";
interface IProps {
  treeList: ChildrenEntity[];
  getStructureData: (structure: ChildrenEntity) => void;
  initialSelector?: string;
}
const TreeList: React.FC<IProps> = ({
  treeList,
  getStructureData,
  initialSelector,
}) => {
  const [currentClickedStruct, setCurrentClickedStruct] =
    useState(initialSelector);
  //console.log("default selection",initialSelector);

  const getStructData = (structure: ChildrenEntity) => {
    setCurrentClickedStruct(structure._id);
    getStructureData(structure);
  };
  return (
    <div>
      <Tree
        currentClickedStruct={currentClickedStruct}
        tree={treeList}
        getStructureData={getStructData}
        depth={1}
      />
    </div>
  );
};

export default TreeList;
