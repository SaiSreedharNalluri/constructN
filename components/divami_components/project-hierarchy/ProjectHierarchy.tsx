import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { TreeItem, TreeView } from "@mui/lab";
import { useEffect, useState } from "react";
import { ChildrenEntity } from "../../../models/IStructure";
import closeIcon from "../../../public/images/closeIcon.svg";
import CustomSearch from "../customSearch";
// import CustomSearch from '../Common/custom-search/CustomSearch'
// import CustomSearch from '../common/custom-search/CustomSearch'
import { mockData } from "./mockData";
import {
  CloseIcon,
  HeaderLabel,
  HeaderLabelContainer,
  ProjectHierarchyContainer,
  SearchContainer,
  StyledTreeItem,
  TreeViewContainer,
  StyledTreeView,
  // useStyles,
} from "./StyledComponents";
import type { RenderTree, SelectLayerProps } from "./Type";
import { getSelectedLayers } from "./Utils";

const ProjectHierarchy = ({
  title,
  openSelectLayer,
  onCloseHandler,
  treeData,
  getStructureData,
}: SelectLayerProps) => {
  const [treeViewData, setTreeViewData] = useState<ChildrenEntity[]>(treeData);
  const [selectedLayers, setSelectedLayers] = useState<string[] | null>(null);
  console.log(treeData);
  const classes = {};
  const renderTreeNode = (node: ChildrenEntity) => (
    <div>
      <span>{node.name}</span>
    </div>
  );

  const handleSearchResult = (e: any, value: any) => {
    console.log(e, value);
  };
  const renderTree = (nodes: ChildrenEntity) => (
    <TreeItem
      key={nodes._id}
      nodeId={nodes._id}
      label={renderTreeNode(nodes)}
      onClick={() => {
        getStructureData ? getStructureData(nodes) : null;
        //setCurrentClickedStruct(structure._id);
      }}
    >
      {Array.isArray(nodes.children) && nodes.children.length
        ? nodes.children.map((node) => renderTree(node))
        : null}
    </TreeItem>
  );

  useEffect(() => {
    const layersSelected = getSelectedLayers(treeViewData);
    setSelectedLayers(layersSelected);
    console.log([...layersSelected], "selectedLayers");
  }, [treeViewData]);

  return (
    <ProjectHierarchyContainer>
      {/* <HeaderLabelContainer>
        <HeaderLabel>{title}</HeaderLabel>
        <CloseIcon
          src={closeIcon}
          onClick={onCloseHandler}
          alt={"close Icon"}
        />
      </HeaderLabelContainer> */}
      <SearchContainer>
        <CustomSearch
          data={treeViewData ?? []}
          handleSearchResult={handleSearchResult}
          setSearchResult={setTreeViewData}
        />
      </SearchContainer>
      <TreeViewContainer>
        <StyledTreeView
          aria-label="rich object"
          defaultCollapseIcon={<RemoveIcon />}
          defaultExpandIcon={<AddIcon />}
        >
          {treeViewData.map((eachNode) => renderTree(eachNode))}
        </StyledTreeView>
      </TreeViewContainer>
    </ProjectHierarchyContainer>
  );
};

export default ProjectHierarchy;
