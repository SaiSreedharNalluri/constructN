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
import SearchImg from "../../../public/images/search.svg";
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
  MessageContainer,
  // useStyles,
} from "./StyledComponents";
import type {
  ProjectHierarchyProps,
  RenderTree,
  SelectLayerProps,
} from "./Type";
import { getAllIds, getSelectedLayers } from "./Utils";
import Image from "next/image";

const ProjectHierarchy = ({
  title,
  openSelectLayer,
  onCloseHandler,
  treeData,
  getStructureData,
  handleSearch,
  handleNodeSelection,
  selectedNodes,
  handleNodeExpand,
  expandedNodes,
  setHierarchy,
}: ProjectHierarchyProps) => {
  const [treeViewData, setTreeViewData] = useState<ChildrenEntity[]>([]);
  const [selectedLayers, setSelectedLayers] = useState<string[] | null>(null);

  const handleExpand = () => {
    handleNodeExpand(getAllIds(treeViewData));
  };
  useEffect(() => {
    setTreeViewData(treeData);
  }, [treeData]);

  useEffect(() => {
    if (window.localStorage.getItem("nodeData")) {
      let nodeData = JSON.parse(window.localStorage.getItem("nodeData") || "");
      getStructureData(nodeData);
      handleNodeExpand([nodeData._id]);
      handleNodeSelection(nodeData._id);
    }
  }, [treeViewData]);

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
      onClick={(event: any) => {
        console.log("onclick");
        window.localStorage.setItem("nodeData", JSON.stringify(nodes));
        getStructureData ? getStructureData(nodes) : null;
        if (
          !(
            nodes.children &&
            Array.isArray(nodes.children) &&
            nodes.children.length
          )
        ) {
          setHierarchy(false);
        }
        //setCurrentClickedStruct(structure._id);
      }}
      style={{ borderBottom: "1px solid #D9D9D9" }}
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
    console.log(selectedNodes);
    search ? handleExpand() : null;
  }, [treeViewData]);

  const handleToggle = (event: React.SyntheticEvent, nodeIds: string[]) => {
    handleNodeExpand(nodeIds);
  };

  const handleSelect = (event: React.SyntheticEvent, nodeIds: string[]) => {
    handleNodeSelection(nodeIds);
  };
  return (
    <ProjectHierarchyContainer>
      <HeaderLabelContainer>
        <HeaderLabel style={{ color: "#101F4B", textAlign: "center" }}>
          {title}
        </HeaderLabel>
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
          // InputProps={{
          //   // ...params.InputProps,
          //   startAdornment: (
          //     <InputAdornment position="start">
          //       <SearchIcon src={SearchIcon} alt="search" />
          //     </InputAdornment>
          //   ),
          // }}
          InputProps={{
            startAdornment: <Image src={SearchImg} alt="search" />,
          }}
        />
      </SearchContainer>
      <TreeViewContainer style={{ overflow: "auto", height: "63vh" }}>
        {treeViewData.length === 0 ? (
          "No structures found for this project"
        ) : (
          <StyledTreeView
            aria-label="rich object"
            defaultCollapseIcon={<RemoveIcon />}
            defaultExpandIcon={<AddIcon />}
            expanded={expandedNodes}
            selected={selectedNodes}
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
