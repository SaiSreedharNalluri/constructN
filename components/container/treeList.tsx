import React from 'react';
import { ChildrenEntity } from '../../models/IStrature';
import Tree from './tree';
interface IProps {
  treeList: ChildrenEntity[];
  getStructureData: (strature: ChildrenEntity) => void;
}
const TreeList: React.FC<IProps> = ({ treeList, getStructureData }) => {
  return (
    <div>
      <Tree tree={treeList} getStructureData={getStructureData} depth={1} />
    </div>
  );
};

export default TreeList;
