import React, { useState } from 'react';
import { ChildrenEntity } from '../../models/IStrature';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleRight } from '@fortawesome/free-solid-svg-icons';
interface IProps {
  tree: ChildrenEntity[];
  getStructureData: (strature: ChildrenEntity) => void;
}
const Tree: React.FC<IProps> = ({ tree, getStructureData }) => {
  const Treenode = (structure: ChildrenEntity) => {
    const [visible, setVisible] = useState(false);
    const hasChild = structure.children ? true : false;
    return (
      <div key={structure._id}>
        <li>
          <div
            className=""
            onClick={() => {
              getStructureData(structure);
              setVisible((vis) => !vis);
            }}
          >
            <div className="flex p-2 bg-gray-300 mt-1 hover:bg-gray-400">
              <div className="flex ">
                <div className="">
                  <p>
                    {visible ? (
                      <FontAwesomeIcon size="1x" icon={faAngleDown} />
                    ) : (
                      <FontAwesomeIcon size="1x" icon={faAngleRight} />
                    )}
                  </p>
                </div>
                <button className="ml-2">
                  <p className=" text-gray-700  text-sm ">{structure.name}</p>
                </button>
              </div>
            </div>
          </div>
          {hasChild && visible && (
            <div className="ml-4">
              <ul>
                <Tree
                  tree={structure.children as Array<ChildrenEntity>}
                  getStructureData={getStructureData}
                />
              </ul>
            </div>
          )}
        </li>
      </div>
    );
  };
  return (
    <React.Fragment>
      <ul className="list-none   ">
        {tree.map((strature) => {
          return Treenode(strature);
        })}
      </ul>
    </React.Fragment>
  );
};

export default Tree;
