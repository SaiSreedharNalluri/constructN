import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Checkbox from "@mui/material/Checkbox";
import { useEffect, useState } from "react";
import closeIcon from "../../../public/divami_icons/closeIcon.svg";
import CustomSearch from "../customSearch";
import { CheckBox, CheckBoxChecked } from "./IconStore";
import { mockData } from "./mockData";
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
import { getSelectedLayers, handleSelection } from "./Utils";

const SelectLayer = ({
  title,
  openselectlayer,
  onCloseHandler,
  optionsList,
  onSelect,
}: SelectLayerProps) => {
  const [treeViewData, setTreeViewData] = useState<RenderTree[]>(mockData);
  const [selectedLayers, setSelectedLayers] = useState<any>(null);

  const renderTreeNode = (node: RenderTree) => (
    <div>
      <Checkbox
        icon={<CheckBoxChecked />}
        checkedIcon={<CheckBox />}
        size="small"
        onChange={() => {
          const arr = handleSelection(treeViewData, node.id);
          setTreeViewData([...arr]);
        }}
        checked={node.isSelected}
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
    const layersSelected = getSelectedLayers(treeViewData);
    setSelectedLayers(layersSelected);
    console.log([...layersSelected], "selectedLayers");
  }, [treeViewData]);

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
        <CustomSearch data={mockData} setSearchResult={setTreeViewData} />
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
    </SelectLayerContainer>
  );
};

export default SelectLayer;
