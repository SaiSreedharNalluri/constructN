import React, { useEffect, useState } from 'react';
import { ChildrenEntity } from '../../models/IStructure';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretRight } from '@fortawesome/free-solid-svg-icons';
interface IProps {
  tree: ChildrenEntity[];
  getStructureData: (structure: ChildrenEntity) => void;
  depth: any;
  currentClickedStruct: string;
}
const Tree: React.FC<IProps> = ({
  tree,
  getStructureData,
  depth,
  currentClickedStruct,
}) => {
  const [visibility, setVisibility] = useState<any>({});
  const [clickedStruct, setClickedStruct] = useState(currentClickedStruct);

  useEffect(() => {
    setClickedStruct(currentClickedStruct);
  }, [currentClickedStruct]);

  const Treenode = (structure: ChildrenEntity) => {
    const hasChild = structure.children?.length ? true : false;
    const getICon = () => {
      if (!hasChild) {
        return;
      } else {
        return visibility[structure._id] ? (
          <FontAwesomeIcon size="1x" icon={faCaretDown} />
        ) : (
          <FontAwesomeIcon size="1x" icon={faCaretRight} />
        );
      }
    };

    return (
      <li key={structure._id} className="flex-col relative">
        <div>
          <div
            className={`flex ${
              structure._id === clickedStruct ? 'bg-white' : ''
            } justify-between border-b border-solid border-gray-400 p-1`}
          >
            <div
              className={`flex margin${depth}`}
             
            >
              <div
                className="hover:bg-gray-300 px-2 hover:rounded-full"
                onClick={() => {
                  setVisibility({
                    ...visibility,
                    [structure._id]: !visibility[structure._id],
                  });
                }}
              >
                {getICon()}
              </div>
              <div  onClick={() => {
                getStructureData(structure);
              }}>
              <p className={`text-sm cursor-pointer `}>{structure.name} </p>
              </div>
            </div>
          </div>
        </div>
        {hasChild && visibility[structure._id] && (
          <div className="flex-col">
            <div className="xyz">
              <Tree
                currentClickedStruct={clickedStruct}
                tree={structure.children as Array<ChildrenEntity>}
                getStructureData={getStructureData}
                depth={depth + 1}
              />
            </div>
          </div>
        )}
      </li>
    );
  };

  return (
    <React.Fragment>
      <ul className="list-none">
        {tree.map((structure) => {
          return Treenode(structure);
        })}
      </ul>
    </React.Fragment>
  );
};

export default Tree;
