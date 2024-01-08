import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { InputAdornment } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import { SetStateAction, useEffect, useState } from "react";
import closeIcon from "../../../public/divami_icons/closeIcon.svg";
import { CustomSearchField } from "../selectType/StyledComponents";
import { CheckBox, CheckBoxChecked } from "./IconStore";
import {
  CloseIcon,
  HeaderLabel,
  HeaderLabelContainer,
  SearchContainer,
  SelectLayerContainer,
  StyledTreeItem,
  StyledTreeView,
  TreeItemLabelContainer,
  TreeLabelContainer,
  TreeViewContainer,
} from "./StyledComponents";
import type { RenderTree, SelectLayerProps } from "./Type";
import {
  getSelectedLayers,
  getTreeViewDataForLayers,
  handleSelection,
} from "./Utils";
import Image from "next/image";
import CheckedIcon from "../../../public/divami_icons/checked.svg";
import UnCheckedIcon from "../../../public/divami_icons/unchecked.svg";
import SearchBoxIcon from "../../../public/divami_icons/search.svg";
import { MqttConnector } from "../../../utils/MqttConnector";
import { ILayer } from "../../../models/IReality";

const SelectLayer = ({
  title,
  openselectlayer,
  onCloseHandler,
  optionsList,
  onSelect,
  initData,
  layersUpdated,
}: any) => {
  const [treeViewData, setTreeViewData] = useState(
    getTreeViewDataForLayers(optionsList)
  );
  const [checked,setChecked] = useState(true)
  const [filtedTreeViewData, setFilteredTreeViewData] = useState(optionsList);
  const [filtedViewData, setFilteredViewData] = useState(initData.currentLayersList);
  const [selectedLayers, setSelectedLayers] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [conn, setConn] = useState<MqttConnector>(MqttConnector.getConnection());
  // const LayerUpdate=(currentLayersList:any)=>{
    
  //     console.log("node_name",JSON.stringify(initData.currentLayersList))
  //     const timeoutId = setTimeout(() => {
  //     conn?.publishMessage("abc", `{"type": "setViewLayers", "data": ${JSON.stringify(initData.currentLayersList)}}`);
  //     },4000)
  // }
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
        onChange={(e) => {
          // const arr = handleSelection(treeViewData, node.id);
          // setTreeViewData([...arr]);
          // let obj: any = {};
          // for (const key in optionsList) { 
          //   obj = optionsList;
          //   if (optionsList[key]?.name == node.name) {
          //     obj[key] = {
          //       ...obj[key],
          //       isSelected: !obj[key].isSelected,
          //       children: obj[key].children?.length
          //         ? obj[key]?.children.map((each: any) => {
          //             return {
          //               ...each,
          //               isSelected: !obj[key].isSelected,
          //             };
          //           })
          //         : [],
          //     };
          //   } else if (optionsList[key].children?.length) {
          //     obj[key] = {
          //       ...obj[key],
          //       children: obj[key]?.children.map((each: any) => {
          //         if (each.name === node.name) {
          //           return {
          //             ...each,
          //             isSelected: !each.isSelected,
          //           };
          //         } else {
          //           return each;
          //         }
          //       }),
          //     };
          //   }
          // }
          // console.log(obj, "dfsfdsactiveRealityMap");
          // setActiveRealityMap({});
          // setTreeViewData((prev: any) => {
          //   const newTreeViewData = prev.map((item: any) => {
          //     console.log(node, "kjlkjk", item);

          //     if (item.id == node.id) {
          //       return {
          //         ...item,
          //         isSelected: !item.isSelected,
          //         children: item.children?.length
          //           ? item.children.map((each: any) => {
          //               return {
          //                 ...each,
          //                 isSelected: !item.isSelected,
          //               };
          //             })
          //           : [],
          //       };
          //     } else if (item.children?.length) {
          //       return {
          //         ...item,
          //         children: item.children.map((each: any) => {
          //           console.log(each.id == node.id, "boolval");
          //           if (each.id == node.id) {
          //             return {
          //               ...each,
          //               isSelected: !each.isSelected,
          //             };
          //           } else {
          //             return each;
          //           }
          //         }),
          //       };
          //     } else {
          //       return item;
          //     }
          //   });
          //   console.log(newTreeViewData, "newtrrreeview");
          //   return newTreeViewData;
          // });
        onSelect(e, node.name, node);
        onselecting(e,node.name,node);
         
          // LayerUpdate(initData.currentLayersList)
         
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
    //console.log("nodes",nodes);
    
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
    <SelectLayerContainer openselectlayer={openselectlayer}>
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
                <Image src={SearchBoxIcon} alt="" />
              </InputAdornment>
            ),
          }}
        />
      </SearchContainer>
     
      <TreeViewContainer>
        <StyledTreeView
          aria-label="rich object"
          //defaultCollapseIcon={<RemoveIcon />}
          //defaultExpandIcon={<AddIcon />}
        >

          {filtedViewData.map((eachNode:ILayer,index:number) => {
            return renderTree(eachNode,index)})}
        </StyledTreeView>
      </TreeViewContainer>
    </SelectLayerContainer>
  );
};

export default SelectLayer;
