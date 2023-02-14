import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { TreeItem, TreeView } from "@mui/lab";
import { useEffect, useState } from "react";
import { ChildrenEntity } from "../../../models/IStructure";
import closeIcon from "../../../public/images/closeIcon.svg";
import { CustomTextField } from "../custom-textfield/CustomTextField";
import TextField from "@mui/material/TextField";
import CustomSearch from "../customSearch";
// import CustomSearch from '../Common/custom-search/CustomSearch'
// import CustomSearch from '../common/custom-search/CustomSearch'
import { mockData } from "./mockData";
import { InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {
  CloseIcon,
  HeaderLabel,
  HeaderLabelContainer,
  ProjectHierarchyContainer,
  SearchContainer,
  StyledTreeItem,
  TreeViewContainer,
  StyledTreeView,
  CustomInputField,
  // useStyles,
} from "./StyledComponents";
import type { RenderTree, SelectLayerProps } from "./Type";
import { getAllIds, getSelectedLayers } from "./Utils";

const ProjectHierarchy = ({
  title,
  openSelectLayer,
  onCloseHandler,
  treeData,
  getStructureData,
  handleSearch,
}: SelectLayerProps) => {
  const [treeViewData, setTreeViewData] = useState<ChildrenEntity[]>([]);
  const [selectedLayers, setSelectedLayers] = useState<string[] | null>(null);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  const handleExpand = () => {
    console.log(getAllIds(treeViewData));
    setExpanded(getAllIds(treeViewData));
  };
  useEffect(() => {
    setTreeViewData(treeData);
  }, [treeData]);
  const classes = {};
  const renderTreeNode = (node: ChildrenEntity) => (
    <div>
      <span>{node.name}</span>
    </div>
  );
  const [search, setSearch] = useState(false);
  const handleSearchResult = (e: any) => {
    console.log(e);
    handleSearch(e);
    setSearch(true);
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
    console.log(search);
    search ? handleExpand() : null;
  }, [treeViewData]);

  const handleToggle = (event: React.SyntheticEvent, nodeIds: string[]) => {
    setExpanded(nodeIds);
  };

  const handleSelect = (event: React.SyntheticEvent, nodeIds: string[]) => {
    setSelected(nodeIds);
  };
  return (
    <ProjectHierarchyContainer>
      <HeaderLabelContainer>
        <HeaderLabel>{title}</HeaderLabel>
        <CloseIcon
          src={closeIcon}
          onClick={onCloseHandler}
          alt={"close Icon"}
        />
      </HeaderLabelContainer>
      <SearchContainer>
        <CustomInputField
          id={"search"}
          variant="outlined"
          placeholder={"Search"}
          onChange={(e: any) => {
            handleSearchResult(e);
          }}
          InputProps={{
            // ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </SearchContainer>
      <TreeViewContainer>
        {treeViewData.length === 0 ? (
          "no structures found for this project"
        ) : (
          <StyledTreeView
            aria-label="rich object"
            defaultCollapseIcon={<RemoveIcon />}
            defaultExpandIcon={<AddIcon />}
            expanded={expanded}
            selected={selected}
            onNodeToggle={handleToggle}
            onNodeSelect={handleSelect}
          >
            {treeViewData.map((eachNode) => renderTree(eachNode))}
          </StyledTreeView>
        )}
      </TreeViewContainer>
    </ProjectHierarchyContainer>
  );
};

export default ProjectHierarchy;
