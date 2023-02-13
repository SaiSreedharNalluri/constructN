import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import { SetStateAction, useEffect, useState } from "react";
import closeIcon from "../../../public/divami_icons/closeIcon.svg";
import { CustomSearchField } from "../select-types/StyledComponents";
import { CheckBox, CheckBoxChecked } from "./IconStore";
import {
  CloseIcon,
  HeaderLabel,
  HeaderLabelContainer,
  SearchContainer,
  SelectLayerContainer,
  StyledTreeItem,
  StyledTreeView,
  TreeViewContainer,
} from "./StyledComponents";
import type { RenderTree, SelectLayerProps } from "./Type";
import {
  getSelectedLayers,
  getTreeViewDataForLayers,
  handleSelection,
} from "./Utils";

const SelectLayer = ({
  title,
  openselectlayer,
  onCloseHandler,
  optionsList,
  onSelect,
  selectedLayersList,
}: SelectLayerProps) => {
  const [treeViewData, setTreeViewData] = useState(
    getTreeViewDataForLayers(optionsList)
  );
  const [filtedTreeViewData, setFilteredTreeViewData] = useState(treeViewData);
  const [selectedLayers, setSelectedLayers] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const renderTreeNode = (node: RenderTree) => (
    <div>
      <Checkbox
        icon={<CheckBoxChecked />}
        checkedIcon={<CheckBox />}
        size="small"
        onChange={(e) => {
          const arr = handleSelection(treeViewData, node.id);
          setTreeViewData([...arr]);
          onSelect(e, node.name);
        }}
        checked={
          selectedLayersList?.length && selectedLayersList.includes(node.name)
            ? true
            : false
        }
      />
      <span>{node.name}</span>
    </div>
  );

  const renderTree = (nodes: RenderTree) => (
    <StyledTreeItem
      key={nodes.id}
      nodeId={nodes.id}
      label={renderTreeNode(nodes)}
    >
      {Array.isArray(nodes.children)
        ? nodes.children.map((node) => renderTree(node))
        : null}
    </StyledTreeItem>
  );

  useEffect(() => {
    const layersSelected = treeViewData ? getSelectedLayers(treeViewData) : [];
    setSelectedLayers(layersSelected);
    console.log([...layersSelected], "selectedLayers");
  }, [treeViewData]);

  useEffect(() => {
    const layersListData = getTreeViewDataForLayers(optionsList);
    setTreeViewData(layersListData);
    setFilteredTreeViewData(layersListData);
  }, [optionsList]);

  const handleSearch = (event: any) => {
    setSearchTerm(event.target.value);
    const searchResult = treeViewData?.filter((eachNode) =>
      eachNode.name.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setFilteredTreeViewData(searchResult);
  };

  return (
    <SelectLayerContainer openSelectLayer={openselectlayer}>
      <HeaderLabelContainer>
        <HeaderLabel>{title}</HeaderLabel>
        <CloseIcon
          src={closeIcon}
          onClick={onCloseHandler}
          alt={"close Icon"}
        />
      </HeaderLabelContainer>
      <SearchContainer>
        {/* <CustomSearch data={treeViewData} handleSearchResult={handleSearchResult} /> */}
        <CustomSearchField
          placeholder="Search"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearch}
          InputLabelProps={{ shrink: false }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </SearchContainer>
      <TreeViewContainer>
        <StyledTreeView
          aria-label="rich object"
          defaultCollapseIcon={<RemoveIcon />}
          defaultExpandIcon={<AddIcon />}
        >
          {filtedTreeViewData?.map((eachNode) => renderTree(eachNode))}
        </StyledTreeView>
      </TreeViewContainer>
    </SelectLayerContainer>
  );
};

export default SelectLayer;
