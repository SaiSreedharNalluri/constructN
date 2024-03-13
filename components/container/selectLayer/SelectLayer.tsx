import { InputAdornment } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import { useEffect, useState } from "react";
import closeIcon from "../../../public/divami_icons/closeIcon.svg";
import { CustomSearchField } from "../selectType/StyledComponents";
import {
  CloseIcon,
  HeaderLabel,
  HeaderLabelContainer,
  SearchContainer,
  SelectLayerContainer,
  StyledMenu,
  StyledTreeItem,
  StyledTreeView,
  TreeItemLabelContainer,
  TreeLabelContainer,
  TreeViewContainer,
} from "./StyledComponents";
import {
  getSelectedLayers,
  getTreeViewDataForLayers,
  handleSelection,
} from "./Utils";
import Image from "next/image";
import CheckedIcon from "../../../public/divami_icons/checked.svg";
import UnCheckedIcon from "../../../public/divami_icons/unchecked.svg";
import SearchBoxIcon from "../../../public/divami_icons/search.svg";
import { ILayer } from "../../../models/IReality";

const SelectLayer = ({
  title,
  optionsList,
  onSelect,
  initData,
  layersUpdated,
  anchorEl,
  open,
  handleClose,
}: any) => {
  const [treeViewData, setTreeViewData] = useState(
    getTreeViewDataForLayers(optionsList)
  );
  const [checked,setChecked] = useState(true)
  const [filtedTreeViewData, setFilteredTreeViewData] = useState(optionsList);
  const [filtedViewData, setFilteredViewData] = useState(initData.currentLayersList);
  const [selectedLayers, setSelectedLayers] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const onselecting =(e:any, name:any, node:any)=>{
    const setValue=filtedViewData.find((item:any)=>{
      if(item.name===name){
        if(item.isSelected === false){
          return item.isSelected = true
        }
        else{
          return item.isSelected = false
        }
      } 
    }) 
  }
  useEffect(() => {
    setFilteredTreeViewData(treeViewData);
    setFilteredViewData(optionsList);
  }, [treeViewData]);
  useEffect(() => {
    setTreeViewData(getTreeViewDataForLayers(optionsList));
  }, [optionsList, layersUpdated]);
  const renderTreeNode = (node: ILayer) => (
    <TreeItemLabelContainer>
      <Checkbox
        icon={<Image src={UnCheckedIcon} alt="" />}
        checkedIcon={<Image src={CheckedIcon} alt="" />}
        size="small"
        onClick={(e)=>e.stopPropagation()}
        onChange={(e) => {
        onSelect(e, node.name, node);
        onselecting(e,node.name,node);
        setChecked(!checked)
        }}
        checked={
          node.isSelected
        }
        
        
      />
      <TreeLabelContainer>{node.name}</TreeLabelContainer>
    </TreeItemLabelContainer>
  );
  const renderTree = (nodes: ILayer,index:number) => {
    return (
      <StyledTreeItem
        key={index+nodes.name}
        nodeId={nodes.name}
        label={renderTreeNode(nodes)}
      >
        {Array.isArray(nodes.children)
          ? nodes.children.map((node,index) => renderTree(node,index))
          : null}
      </StyledTreeItem>
    );
  };

  useEffect(() => {
    const layersSelected = treeViewData ? getSelectedLayers(treeViewData) : [];
    setSelectedLayers(layersSelected);
  }, [treeViewData]);

  useEffect(() => {
    const layersListData = getTreeViewDataForLayers(optionsList);
    setTreeViewData(layersListData);
    setFilteredTreeViewData(layersListData);
  }, [optionsList]);

  const handleSearch = (event: any) => {
    setSearchTerm(event.target.value);
    const searchResult = initData.currentLayersList.filter((eachNode:any) =>
      eachNode.name.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setFilteredViewData(searchResult)
    setFilteredTreeViewData(searchResult);
  };

  return (
    <StyledMenu
    id="demo-customized-menu"
    anchorEl={anchorEl}
    open={open}
    onClose={handleClose}
  >
      <HeaderLabelContainer>
        <HeaderLabel>{title}</HeaderLabel>
        <CloseIcon
          src={closeIcon}
          onClick={handleClose}
          alt={"close Icon"}
        />
      </HeaderLabelContainer>
      <SearchContainer>
        <CustomSearchField
          placeholder="Search"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearch}
          onClick={(e)=>e.stopPropagation()}
          InputLabelProps={{ shrink: false }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Image src={SearchBoxIcon} alt="" />
              </InputAdornment>
            ),
          }}
        />
      </SearchContainer>
      <TreeViewContainer>
        <StyledTreeView
          aria-label="rich object"
        >
        {filtedViewData?.map((eachNode:ILayer,index:number) => {
            return renderTree(eachNode,index)})}
        </StyledTreeView>
      </TreeViewContainer>
      </StyledMenu>
  );
};

export default SelectLayer;
