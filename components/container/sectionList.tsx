import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { getAllIds, getSelectedLayers } from "../divami_components/project-hierarchy/Utils";
import { LabelIcon, StyledSpan, StyledTreeItem} from "../divami_components/project-hierarchy/StyledComponents";
import { TooltipText } from "../divami_components/side-panel/SidePanelStyles";
import { UploaderStyledTreeView,TreeViewContainer,LabelText,LabelContainer } from "../divami_components/uploader_details/uploaderStyles";
import { useUploaderContext } from "../../state/uploaderState/context";

interface IProps{
  handleNodeExpand: any;
  expandedNodes: any;
 
  getStructureData:any;

}
const SectionList: React.FC<IProps>=({
    
    getStructureData,
  handleNodeExpand,
  expandedNodes,
})=>{
  const { state: uploaderState, uploaderContextAction } = useUploaderContext();
    const [treeViewData, setTreeViewData] = useState<any>(uploaderState.sectionDetails);
    const [selectedLayers, setSelectedLayers] = useState<string[] | null>(null);
    useEffect(() => {
        setTreeViewData(uploaderState.sectionDetails);
      }, [uploaderState.sectionDetails.length]);
      useEffect(() => {
        const layersSelected = getSelectedLayers(treeViewData);
        setSelectedLayers(layersSelected);
       }, [treeViewData]);
      const handleToggle = (event: React.SyntheticEvent, nodeIds: string[]) => {
        handleNodeExpand(nodeIds);
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
      const onLabelClick = (event: any, nodes: any) => {
        {
            getStructureData ? getStructureData(nodes) : null;
          if (
            !(
              nodes.children &&
              Array.isArray(nodes.children) &&
              nodes.children.length
            )
          ) {
            // setHierarchy(false);
          }
        }
      };
      const renderTreeNode = (node: any, onLabelClick: any) => (
        <LabelContainer data-testid="label" className="">
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
                  onLabelClick(e, node)
                }}>
               <TooltipText title={node?.name?.length > 20 ? node?.name : ""} placement="right">
            <div>
            <TruncatedString text={node?.name} maxLength={20}
                    suffixLength={0} ></TruncatedString> 
              </div> 
              </TooltipText>
      
            </LabelText>
          </div>
        
      
        <div>
        
      </div>
           
      
          </LabelContainer>
        );
      
      const renderTree = (nodes: any, onLabelClick: any) => (
        <>
          <StyledTreeItem
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
    return(
        
        <div className="">
            <TreeViewContainer
        style={{
          overflow: "auto",
          height: `calc(100vh - 350px)`,
        }}
      >
              
          <UploaderStyledTreeView
            aria-label="rich object"
            defaultCollapseIcon={<></>}
            defaultExpandIcon={<></>}
            expanded={expandedNodes}
            onNodeToggle={handleToggle}
          >
            {treeViewData.map((eachNode:any) => renderTree(eachNode, onLabelClick))}
          </UploaderStyledTreeView>
        </TreeViewContainer>
        </div>
    )

} 

export default SectionList;