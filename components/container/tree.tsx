import React, { useState } from 'react';
import { ChildrenEntity } from '../../models/IStructure';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretRight } from '@fortawesome/free-solid-svg-icons';
interface IProps {
  tree: ChildrenEntity[];
  getStructureData: (structure: ChildrenEntity) => void;
  depth: any;
}
const Tree: React.FC<IProps> = ({ tree, getStructureData, depth }) => {
  const Treenode = (structure: ChildrenEntity) => {
    const [visible, setVisible] = useState(false);
    const hasChild = structure.children?.length ? true : false;
    const [click, setClick] = useState(false);
    const getICon = () => {
      if (!hasChild) {
        return;
      } else {
        return visible ? (
          <FontAwesomeIcon size="1x" icon={faCaretDown} />
        ) : (
          <FontAwesomeIcon size="1x" icon={faCaretRight} />
        );
      }
    };
    return (
      <React.Fragment>
        <li key={structure._id} className=" flex-col  relative ">
          <div
            onClick={() => {
              getStructureData(structure);
              setVisible((vis) => !vis);
            }}
          >
            <div
              className={`flex justify-between border-b border-solid border-gray-400 p-1`}
              onClick={() => {
                if (click) {
                  setClick(false);
                } else {
                  setClick(true);
                }
              }}
            >
              <div>
                <p className={`margin${depth}  text-sm cursor-pointer `}>
                  {structure.name}{' '}
                </p>
              </div>
              <div>{getICon()}</div>
            </div>
          </div>
          {hasChild && visible && (
            <div className="flex-col  ">
              <div className="xyz">
                <li className="">
                  <Tree
                    tree={structure.children as Array<ChildrenEntity>}
                    getStructureData={getStructureData}
                    depth={depth + 1}
                  />
                </li>
              </div>
            </div>
          )}
        </li>
      </React.Fragment>
    );
  };
  return (
    <React.Fragment>
      <ul className="list-none   ">
        {tree.map((structure) => {
          return Treenode(structure);
        })}
      </ul>
    </React.Fragment>
  );
};

export default Tree;
