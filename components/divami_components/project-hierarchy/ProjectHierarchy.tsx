import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { TreeItem, TreeView } from "@mui/lab";
import { useEffect, useState } from "react";
import { ChildrenEntity } from "../../../models/IStructure";
import closeIcon from "../../../public/images/closeIcon.svg";
import SearchImg from "../../../public/images/search.svg";
import projectHierIcon from "../../../public/divami_icons/projectHierIcon.svg";
import { useRouter } from 'next/router';
import info from "../../../public/divami_icons/infoIcon.svg"
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
import PopupComponent from "../../popupComponent/PopupComponent";
import Chips from "../sectionsList/Chip";
import { TooltipText } from "../side-panel/SidePanelStyles";
import CustomLoggerClass from "../../divami_components/custom_logger/CustomLoggerClass";
import { getNewChipData, removeChip } from "../../../services/sections";
const ProjectHierarchy = ({
  title,
  openselectlayer,
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
  const [treeViewData, setTreeViewData] = useState<any>(treeData);
  const router = useRouter();
  const [block, setBlock] = useState(treeData);

  const [selectedLayers, setSelectedLayers] = useState<string[] | null>(null);
  const[id,setId]=useState("");
  const[isCaptureAvailable,setCaptureAvailable]=useState(false);
  const[isProcessing,setProcessing]=useState(false);
  const[newchipData,setNewchipData]:any=useState([]);
  const customLogger = new CustomLoggerClass();
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
  useEffect(() => {
    if (router.isReady) {
      const type = "newSnapshot";
      const projectId = router?.query?.projectId as string;
        getNewChipData(projectId, type)
            .then((response: any) => {
              setNewchipData([...response.data.result]);
            })
            .catch((error) => {
              console.error("Error fetching data:", error);
            });
        
    }
  }, [router.query.projectId]);
  const handleDeleteNewChip = (chipIds:any,structureId:any) => {
    const projectId = router?.query?.projectId as string;
    removeChip(projectId,chipIds,structureId).then((res:any)=>{    
      if(res.data.success===true){
        const newData = newchipData.filter((chip:any) => chip._id !== chipIds);
      setNewchipData([...newData])   
      }
    })
  };
  const onLabelClick = (event: any, nodes: any) => {
    {
      window.localStorage.setItem("nodeData", JSON.stringify(nodes));
      getStructureData ? getStructureData(nodes) : null;
      const { pathname, query } = router
      delete query.paramName;
      const newQueryParamValue =  nodes._id // Specify the new value for the query parameter
      router.push({
        pathname: pathname,
        query: { ...router.query, structId: newQueryParamValue },
      });
      
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

  const TruncatedString = ({ text, maxLength, suffixLength }: any) => {
    let truncatedText = text;

    if (text.length > maxLength) {
      const prefix = text.substring(0, maxLength - suffixLength);
      const suffix = text.substring(text.length - suffixLength);
      truncatedText = prefix + "..." + suffix;
    }

    return truncatedText;
  };

  const renderTreeNode = (node: any, onLabelClick: any) => (
  <LabelContainer data-testid="label" className={node?.snapshots && node?.designs?.length>0 && Object.keys(node?.snapshots?.latestSnapshot).length <= 0 || Object.keys(node?.snapshots?.latestSnapshot).length >=0 && node?.snapshots?.snapshotActiveCount <1 ?"bg-[#E7E7E7] ":""} >
    <div className="flex items-center">
    {node.children?.length ? (
        expandedNodes.includes(node._id) ? (
          <LabelIcon
            onClick={(e: any) => {
              handleNodeExpand(getAllIds(node));
            }}
          >
            <RemoveIcon
              style={{ cursor: "pointer", fontSize: "14px",marginLeft:"7px" }}
              data-testid={"addIcon"}
            />
          </LabelIcon>
        ) : (
          <StyledSpan onClick={(e) => handleNodeExpand(getAllIds(node))}>
            <AddIcon
              style={{ cursor: "pointer", fontSize: "14px",marginLeft:"7px" }}
              data-testid={"addIcon"}
            />
          </StyledSpan>
        )
      ) : (
        <></>
      )}
      <LabelText onClick={(e: any) =>{ 
              newchipData.map((chipData:any)=>{
                      if(node._id===chipData.structure){

                        handleDeleteNewChip(chipData._id,chipData.structure)
                        }
                    })
          if(node?.designs.length>0 && Object.keys(node.snapshots?.latestSnapshot).length <= 0) {
            setCaptureAvailable(true)
            setId(node)
           }
           else if(node?.designs.length!==0&&Object.keys(node.snapshots?.latestSnapshot).length >0 && node.snapshots?.snapshotActiveCount<1) {
            setProcessing(true)
            setId(node)
           }
         else if (Object.keys(node.snapshots?.latestSnapshot).length >= 0 && node.snapshots?.snapshotActiveCount>0 ) {
            onLabelClick(e, node)
            setCaptureAvailable(false)
            setProcessing(false)
          }
          customLogger.logInfo("Hierarchy Menu - Change Structure");
      }} >
         <TooltipText title={node?.name?.length > 20 ? node?.name : ""} placement="right">
      <div>
      <TruncatedString text={node?.name} maxLength={20}
              suffixLength={0} ></TruncatedString> 
        </div> 
        </TooltipText>

      </LabelText>
    </div>
  

<div>
{node?.designs.length<1
    ? 
    <TooltipText title="No Design" placement="right">
      <div>
      <Chips title="ND" bgColor="#F67C74" isChip={false}></Chips>
      </div>
  
    </TooltipText>
    :node.snapshots && node?.designs.length>0 && Object.keys(node.snapshots?.latestSnapshot).length < 1
    ? 
    <TooltipText title="No Reality" placement="right">
    <div>
    <Chips title="NR" bgColor="#C24200" isChip={false}></Chips>  
    </div>
    </TooltipText>
    :  node?.designs.length>0&&Object.keys(node.snapshots?.latestSnapshot).length > 0 && node.snapshots?.latestSnapshot?node.snapshots?.latestSnapshot?.state !== "Active"
    ? 
    // title={ moment(node.snapshots.latestSnapshot.captureDateTime).format("DD MMM")}
    <TooltipText title="Processing" placement="right">
    <div>
    <Chips title="P" bgColor="#006CD0" isChip={false} captureTime={true} ></Chips>
    </div>
    </TooltipText>  
   : newchipData.map((structureId:any) => {
    if (node._id === structureId.structure) {
      return <div key={node._id}>
    <TooltipText title="New" placement="right">
<div>
        <Chips isChip={false} title="N" bgColor="#8BD97F" />
        </div>
        </TooltipText>
      </div> ;
    }
    return null;
  })
:""}
</div>
     

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

  const renderTree = (nodes: any, onLabelClick: any) => (
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
          ? nodes.children.map((node:any) => renderTree(node, onLabelClick))
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
            {treeViewData.map((eachNode:any) => renderTree(eachNode, onLabelClick))}
          </StyledTreeView>
        )}
              {
isCaptureAvailable || isProcessing ?(
          <PopupComponent
          open={isCaptureAvailable?isCaptureAvailable:isProcessing}
          setShowPopUp={isCaptureAvailable?setCaptureAvailable:setProcessing}
          modalTitle={isCaptureAvailable?"No Reality Available":"Processing"}
          modalmessage={isCaptureAvailable?`Do you want to view the design?`: `Do you want to view the design?`}
          primaryButtonLabel={isCaptureAvailable?"View Design":"View Design"}
          imageSrc={info}
          isImageThere={true}
          SecondaryButtonlabel={"No"}
          callBackvalue={isCaptureAvailable?(e:any) => {onLabelClick(e, id);setCaptureAvailable(false)}:(e:any) => {onLabelClick(e, id)}}
        />
        )
      :""}
      </TreeViewContainer>
    </ProjectHierarchyContainer>
  );
};

export default ProjectHierarchy;
