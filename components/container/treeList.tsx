import React from 'react';
import { ChildrenEntity } from '../../models/IStructure';
import Tree from './tree';
interface IProps {
  treeList: ChildrenEntity[];
  getStructureData: (structure: ChildrenEntity) => void;
}
const TreeList: React.FC<IProps> = ({ treeList, getStructureData }) => {
  return (
    <div>
      <Tree tree={treeList} getStructureData={getStructureData} depth={1} />
    </div>
  );
};

export default TreeList;
