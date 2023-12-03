import React, { useEffect, useRef, useState } from "react";
import Typebar from "./Typebar";
import Layers from "./Layers";
import Issues from "./Issues";
import Task from "./Task";
import { IDesignMap } from "../../../models/IDesign";
import { IActiveRealityMap } from "../../../models/IReality";
import { ISnapshot } from "../../../models/ISnapshot";
import { IStructure } from "../../../models/IStructure";
import { IToolResponse, IToolbarAction, ITools } from "../../../models/ITools";
import { SectionToolBar, ToolbarContainer } from "./ToolBarStyles";
import { Issue } from "../../../models/Issue";
import { ITasks } from "../../../models/Itask";
import CompareView from "./CompareView";
import { IGenData } from "../../../models/IGenData";


interface IProps {
 
initData:IGenData;
toolClicked:(toolAction:IToolbarAction)=>{};
toolUpdate:IToolbarAction;
}

const ToolBarMenuWrapper: React.FC<any> = ({
  toolClicked,
  toolUpdate,
  initData
}) => {
  const [rightNav, setRighttNav] = useState(false);
  // const [isCompareDesign, setIsCompareDesign] = useState(false);
  // const [isCompareReality, setIsCompareReality] = useState(false);
  // const [iViewMode, setIViewMode] = useState(viewMode);
  // const rightOverlayRef: any = useRef();
  // const rightOverlayRefs: any = useRef();
  // const [active, setActive] = useState("hideCompare");
  // const [myProject, setMyProject] = useState(currentProject);
  const [selectedTypeVal, setSelectedTypeVal] = useState<string>();
  const [openSelectTypes, setOpenSelectTypes] = useState(false);
  const [myTypesList, setMyTypesList] = useState<string[]>();


  const [selectedLayer, setSelectedLayer] = useState("");
  
  const [openSelectLayer, setOpenSelectLayer] = useState(false);

 
  const [highlightCreateIcon, setHighlightCreateIcon] = useState(false);
  const [highlightCreateTaskIcon, setHighlightCreateTaskIcon] = useState(false);

  const [myLayersList, setMyLayersList] = useState<IActiveRealityMap>();
    const [isCameraIconClicked, setCameraIconClicked] = useState(false);
    const [isClipboardIconClicked, setClipboardIconClicked] = useState(false);
  let toolInstance: ITools = { toolName: "", toolAction: "" };

  useEffect(() => {
    if(initData?.currentTypesList)
    switch (initData.currentTypesList?.constructor.name) {
      case "Array":
        setMyTypesList(
          initData.currentTypesList.map((typeData: string) => {
            switch (typeData) {
              case "pointCloud":
                return "Reality";
              case "orthoPhoto":
                return "Map";
              default:
                return typeData;
            }
          })
        );
        break;
    }

    if(initData?.currentLayersList)
    setMyLayersList(initData.currentLayersList);

    if(initData?.currentViewType)
    switch (initData.currentViewType) {
      case "pointCloud":
        setSelectedTypeVal("Reality");
        break;
      case "orthoPhoto":
        setSelectedTypeVal("Map");
        break;
      default:
        setSelectedTypeVal(initData.currentViewType);
    }

  }, [initData]);
 
  const typeChange = (changeOb: any) => {
    setRighttNav(false);
    // toolInstance.toolName = "viewType";
    // toolInstance.toolAction = changeOb.target.value;
    let typeChangeToolAction: IToolbarAction = {type:"setViewType", data:changeOb.target.value};

    toolClicked(typeChangeToolAction);
    
  };
  const LayerChange = (changeOb: any, layerLabel: string, node: any) => {
    let obj: any = myLayersList;
    for (const key in obj) {
      if (obj[key]?.name == node.name) {
        obj[key] = {
          ...obj[key],
          isSelected: !obj[key].isSelected,
          children: obj[key].children?.length
            ? obj[key]?.children.map((each: any) => {
                return {
                  ...each,
                  isSelected: !obj[key].isSelected,
                };
              })
            : [],
        };
      } else if (obj[key].children?.length) {
        obj[key] = {
          ...obj[key],
          children: obj[key]?.children.map((each: any) => {
            if (each.name === node.name) {
              return {
                ...each,
                isSelected: !each.isSelected,
              };
            } else {
              return each;
            }
          }),
        };
      }
    }

    // setActiveRealityMap(obj);
    // setLayersUpdated(!layersUpdated);
  };


  const issueMenuClicked = (localTool: ITools) => {
    toolClicked(localTool);
    if (
      localTool.toolAction === "issueCreateClose" ||
      localTool.toolAction === "issueViewClose" ||
      localTool.toolAction === "issueView"
    )
      setRighttNav(!rightNav);
  };
  const taskMenuClicked = (localTool: ITools) => {
    toolClicked(localTool);
    if (
      localTool.toolAction === "taskCreateClose" ||
      localTool.toolAction === "taskViewClose"
    )
      setRighttNav(!rightNav);
  };
  // const hotspotMenuClicked = (localTool: ITools) => {
  //   toolClicked(localTool);
  //   if (
  //     localTool.toolAction === "hotspotCreateClose" ||
  //     localTool.toolAction === "hotspotViewClose" ||
  //     localTool.toolAction === "hotspotView"
  //   )
  //     setRighttNav(!rightNav);
  // };
  const handleOnIssueSort = (sortMethod: string) => {

  }
  const handleOnTasksSort = (sortMethod: string) => {

  }
  return initData?(
     <SectionToolBar>
      <ToolbarContainer>
         
          <Typebar
            // rightMenuClickHandler={rightMenuClickHandler}
            myTypesList={initData.currentTypesList}
            typeChange={typeChange}
            selectedValue={initData.currentViewType}
            openList={openSelectTypes}
            setOpenList={setOpenSelectTypes}
            initData={initData}
            onListClick={() => {
              setOpenSelectLayer(false);
              setOpenSelectTypes(!openSelectTypes);
            }}
          />
     
    
       
        {/* {viewMode !== "Reality" ? ( */}
          <Layers
            // rightMenuClickHandler={rightMenuClickHandler}
            myLayersList={myLayersList}
            LayerChange={LayerChange}
            selectedValue={selectedLayer}
            openList={openSelectLayer}
            setOpenList={setOpenSelectLayer}
            initData={initData}
            onListClick={() => {
              setOpenSelectTypes(false);
              setOpenSelectLayer(!openSelectLayer);
            }}
            selectedLayersList={initData.currentLayersList}
          />
        {/* ) : (
          <></>
        )}  */}
        {/* <Typebar
        initData={initData}
          
         
        /> */}
        <Issues
         initData={initData}
         isCameraIconClicked={isCameraIconClicked} 
          setCameraIconClicked={setCameraIconClicked}
          isClipboardIconClicked={isClipboardIconClicked} 
          setClipboardIconClicked={setClipboardIconClicked}
          setHighlightCreateIcon={setHighlightCreateIcon}
          highlightCreateIcon={highlightCreateIcon}
          handleOnIssueSort={handleOnIssueSort}
          issueMenuClicked={issueMenuClicked}
        />

        <Task
         tasksList={initData?.currentTaskList}
         taskMenuClicked={taskMenuClicked}
          highlightCreateTaskIcon={highlightCreateTaskIcon}
          setHighlightCreateTaskIcon={setHighlightCreateTaskIcon}
          setHighlightCreateIcon={setHighlightCreateIcon}
          isCameraIconClicked={isCameraIconClicked} 
          setCameraIconClicked={setCameraIconClicked}
          isClipboardIconClicked={isClipboardIconClicked} 
          setClipboardIconClicked={setClipboardIconClicked}
          // openTaskDetails={openTaskDetails}
          // closeTaskDetails={closeTaskDetails}
          // taskFilterState={taskFilterState}
          handleOnTasksSort={handleOnTasksSort}
         
        />

        
          {(initData.currentViewType==="pointCloud"|| initData.currentViewType==="orthoPhoto")?
          <CompareView
  
          />:<></>}
       

        {/* <Hotspot /> */}
      </ToolbarContainer>
    </SectionToolBar>
  
  ):<></>;
};

export default ToolBarMenuWrapper;
