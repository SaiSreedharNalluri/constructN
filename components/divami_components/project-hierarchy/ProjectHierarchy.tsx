import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { TreeItem, TreeView } from "@mui/lab";
import { useEffect, useState } from "react";
import { ChildrenEntity } from "../../../models/IStructure";
import closeIcon from "../../../public/images/closeIcon.svg";
import SearchImg from "../../../public/images/search.svg";
import projectHierIcon from "../../../public/divami_icons/projectHierIcon.svg";
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
  ErrorImageDiv,
  ImageErrorIcon,
  MessageDivShowErr,
  LabelContainer,
  // useStyles,
  StyledSpan,
  LabelIcon,
  LabelText,
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
  const [treeViewData, setTreeViewData] = useState<ChildrenEntity[]>(treeData);

  const [block, setBlock] = useState(treeData);

  const [selectedLayers, setSelectedLayers] = useState<string[] | null>(null);

  const handleExpand = () => {
    handleNodeExpand(getAllIds(treeViewData));
  };
  useEffect(() => {
    setTreeViewData(treeData);
  }, [treeData.length]);

  // useEffect(() => {
  //   if (window.localStorage.getItem("nodeData") && getStructureData) {
  //     let nodeData = JSON.parse(window.localStorage.getItem("nodeData") || "");
  //     console.log("nodeData", nodeData);
  //     // if (nodeData && getStructureData) {
  //     //   getStructureData(nodeData);
  //     // }
  //   }
  // }, [treeViewData]);

  // useEffect(() => {
  //   if (window.localStorage.getItem("nodeData")) {
  //     let nodeData = JSON.parse(window.localStorage.getItem("nodeData") || "");
  //     if (nodeData && getStructureData) {
  //       getStructureData(nodeData);
  //     }
  //   }
  // }, [treeViewData]);

  const onLabelClick = (event: any, nodes: any) => {
    {
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
    }
  };

  const renderTreeNode = (node: ChildrenEntity, onLabelClick: any) => (
    <LabelContainer data-testid="label">
      <LabelText onClick={(e: any) => onLabelClick(e, node)}>
        {node.name}
      </LabelText>
      {node.children?.length ? (
        expandedNodes.includes(node._id) ? (
          <LabelIcon
            onClick={(e: any) => {
              handleNodeExpand(getAllIds(node));
            }}
          >
            <RemoveIcon
              style={{ cursor: "pointer", fontSize: "14px" }}
              data-testid={"addIcon"}
            />
          </LabelIcon>
        ) : (
          <StyledSpan onClick={(e) => handleNodeExpand(getAllIds(node))}>
            <AddIcon
              style={{ cursor: "pointer", fontSize: "14px" }}
              data-testid={"addIcon"}
            />
          </StyledSpan>
        )
      ) : (
        <></>
      )}
    </LabelContainer>
  );

  const [search, setSearch] = useState(false);
  const [searchField, setSearchField] = useState("");
  // const [filterBlock, setFilterBlock] = useState<any>(block);

  const handleSearchResult = (e: any) => {
    let returnedTree = handleSearch(e);
    // console.log("robn", returnedTree)
    setSearch(true);
    setTreeViewData(returnedTree);
  };

  const renderTree = (nodes: ChildrenEntity, onLabelClick: any) => (
    <>
      <StyledTreeItem
        // needClick={nodes?.children && nodes?.children?.length > 0 ? false : true}
        key={nodes._id}
        nodeId={nodes._id}
        label={renderTreeNode(nodes, onLabelClick)}
        data-testid={"treeItem"}
        style={{ borderBottom: "1px solid #D9D9D9" }}
      >
        {Array.isArray(nodes.children) && nodes.children.length
          ? nodes.children.map((node) => renderTree(node, onLabelClick))
          : null}
      </StyledTreeItem>
    </>
  );

  useEffect(() => {
    const layersSelected = getSelectedLayers(treeViewData);
    setSelectedLayers(layersSelected);

    search ? handleExpand() : null;
  }, [treeViewData]);

  // useEffect(() => {
  //   const newFilteredBlocklist = block[0]?.children?.filter((val: any) => {
  //     // return val;
  //     // console.log(val.name.toLocaleLowerCase());
  //     return val?.name?.toLocaleLowerCase().includes(searchField);

  //     console.log("effect firingn");
  //   });
  //   setFilterBlock(newFilteredBlocklist);
  // }, [block, searchField]);

  const handleToggle = (event: React.SyntheticEvent, nodeIds: string[]) => {
    handleNodeExpand(nodeIds);
  };

  const handleSelect = (event: React.SyntheticEvent, nodeIds: string[]) => {
    handleNodeSelection(nodeIds);
  };

  const onSearchChange = (event: any) => {
    let parentArr = [...treeData];
    const searchFieldString = event.target.value.toLocaleLowerCase();
    let newObj = [
      ...parentArr[0]?.children?.filter(
        (item: any, index: number) =>
          item.name.toLocaleLowerCase().includes(searchFieldString)
        //     || item.name.children.filter((item:any,index:number) =>)
      ),
    ];
    parentArr = [{ ...parentArr[0], children: [...newObj] }];
    //  parentObj[0].children = newObj
    setTreeViewData([...parentArr]);
  };

  // console.log("hiiii", treeViewData, filterBlock);

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
          sx={{
            "& .MuiInputBase-input": {
              fontSize: "14px",
              lineHeight: "20px",
              fontFamily: "Open Sans",
              color: "#101F4C",
              fontWeight: "400",
              "&::placeholder": {
                color: "#787878",

                fontFamily: "Open Sans",
                fontSize: "14px",
                lineHeight: "20px",
                fontWeight: "400",
              },
            },
          }}
          id={"search"}
          variant="outlined"
          autoComplete="off"
          placeholder={"Search"}
          // onChange={(e: any) => {
          //   onSearchChange(e);
          // }}

          onChange={(e: any) => {
            handleSearchResult(e);
          }}
          data-testid={"search"}
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
            // ariaLabel:{"search-input"}
          }}
        />
      </SearchContainer>
      <TreeViewContainer
        style={{
          overflow: "auto",
          height: `calc(100vh - 300px)`,
        }}
      >
        {treeViewData.length === 0 ? (
          <ErrorImageDiv>
            <ImageErrorIcon src={projectHierIcon} alt="Error Image" />
            <MessageDivShowErr>No result found</MessageDivShowErr>
          </ErrorImageDiv>
        ) : (
          <StyledTreeView
            aria-label="rich object"
            defaultCollapseIcon={<></>}
            defaultExpandIcon={<></>}
            expanded={expandedNodes}
            selected={selectedNodes}
            onNodeToggle={handleToggle}
            onNodeSelect={handleSelect}
          >
            {treeViewData.map((eachNode) => renderTree(eachNode, onLabelClick))}
          </StyledTreeView>
        )}
      </TreeViewContainer>
    </ProjectHierarchyContainer>
  );
};

export default ProjectHierarchy;
