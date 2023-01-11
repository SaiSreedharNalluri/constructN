import React from 'react';
import { ChildrenEntity } from '../../models/IStrature';
import Tree from './tree';
interface IProps {
  treeList: ChildrenEntity[];
  getStructureData: (strature: ChildrenEntity) => void;
}
const TreeList: React.FC<IProps> = ({ treeList, getStructureData }) => {
  console.log(treeList)
  return (
    <div>
      <Tree tree={treeList} getStructureData={getStructureData} />
    </div>
  );
};

export default TreeList;
