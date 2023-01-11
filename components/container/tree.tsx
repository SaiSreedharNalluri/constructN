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
    const [click, setClick] = useState(false);
    return (
      <div key={structure._id} >
        <li className=' flex-col bg-white p-1'>
          <div
            className=""
            onClick={() => {
              getStructureData(structure);
              setVisible((vis) => !vis);
            }}
          >
            <div>
              <div className={`flex ${click ? "bg-black" : ""}`} onClick={() => setClick(!click)}>
                <div >
                  <p>
                    {visible ? (
                      <FontAwesomeIcon size="1x" icon={faAngleDown} />
                    ) : (
                      <FontAwesomeIcon size="1x" icon={faAngleRight} />
                    )}
                  </p>
                </div>
                <button className="">
                  <p className=" text-gray-700  text-sm ">{structure.name}</p>
                </button>
              </div>
            </div>
          </div>
          {hasChild && visible && (
            <div className="flex-col">
              <ul className='pl-4'>
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
