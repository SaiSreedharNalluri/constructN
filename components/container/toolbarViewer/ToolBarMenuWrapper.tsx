import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle, Ref } from "react";
import Typebar from "./Typebar";
import Layers from "./Layers";
import Issues from "./Issues";
import Task from "./Task";

import { IToolResponse, IToolbarAction, ITools } from "../../../models/ITools";
import { SectionToolBar, ToolbarContainer } from "./ToolBarStyles";

import CompareView from "./CompareView";
import { IGenData } from "../../../models/IGenData";
import { ILayer } from "../../../models/IReality";
import { RenderTree } from "../selectLayer/Type";


interface toolProps {

  initData: IGenData | undefined;
  toolClicked: (toolAction: IToolbarAction) => void;
  toolUpdate: IToolbarAction | undefined;
}

export type toolBarHandle = {
  selectToolRef: (handleMenuInstance: any) => void;
  RouterIssueRef:(handleMenuInstance:any) => void;
 
};
export type IssueToolHandle = {
  handleIssueInstance: (IssuetoolInstance: any) => void;
  handleRouterIssueRef: (handleMenuInstance: any) => void;
};
export type taskToolHandle = {
  handleTaskInstance: (tasktoolInstance: any) => void;
  handleRouterTask:(handleMenuInstance:any)=> void;
};

export type designToolHandle = {
  handleDesignRef: (designInstance: any) => void;
}






function ToolBarMenuWrapper({ initData, toolClicked, toolUpdate }: toolProps, ref: Ref<toolBarHandle>) {
  const issueRef = React.useRef<IssueToolHandle>(null);
  const taskRef = React.useRef<taskToolHandle>(null);
  const designRef = React.useRef<any>(null);
  const routerIssueRef = React.useRef<any>(null)
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
  const [myLayersList, setMyLayersList] = useState<ILayer[]>();
  const [isCameraIconClicked, setCameraIconClicked] = useState(false);
  const [isClipboardIconClicked, setClipboardIconClicked] = useState(false);
  let IssuetoolInstance: IToolbarAction = { type: "showIssue", data: "" };
  // const handleIssueFunction = (IssuetoolInstance:any) => {
  //   console.log('Function called in Issue component');
  //   issueRef.current?.issueHandle(IssuetoolInstance) 
  // };
  useImperativeHandle(ref, () => {
    return {
      selectToolRef(handleMenuInstance: any) {
        if (handleMenuInstance.type === "createIssue" || handleMenuInstance.type === "selectIssue") {
          let IssuetoolInstance: IToolbarAction = { type: handleMenuInstance.type, data: handleMenuInstance.data }
          issueRef.current?.handleIssueInstance(IssuetoolInstance)
        }
        else if (handleMenuInstance.type === "createTask" || handleMenuInstance.type === "selectTask") {
          let tasktoolInstance: IToolbarAction = { type: handleMenuInstance.type, data: handleMenuInstance.data }
          taskRef.current?.handleTaskInstance(tasktoolInstance)
        }
      },
      RouterIssueRef(handleMenuInstance:any){
        console.log("handleMenuInstN",handleMenuInstance)
        if(handleMenuInstance.type === "selectIssue"){
          issueRef.current?.handleRouterIssueRef(handleMenuInstance)
        }
        else if(handleMenuInstance.type === "selectTask"){
          taskRef.current?.handleRouterTask(handleMenuInstance)
        }
        
      }

    };
  }, []);
  useEffect(() => {
    if (initData?.currentTypesList)
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

    if (initData?.currentViewType)
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
    if (initData?.structure) {
      console.log("passing str")
      designRef?.current?.handleDesignRef(initData?.structure)
    }

    if (initData?.currentLayersList) {
      setMyLayersList(initData.currentLayersList);
    }
  }, [initData]);

  const typeChange = (changeOb: any) => {
    setRighttNav(false);
    // toolInstance.toolName = "viewType";
    // toolInstance.toolAction = changeOb.target.value;
    let typeChangeToolAction: IToolbarAction = { type: "setViewType", data: changeOb.target.value };

    toolClicked(typeChangeToolAction);

  };
  const LayerChange = (changeOb: any, layerLabel: string, node: RenderTree) => {
    if (myLayersList) {
      let obj: ILayer[] = myLayersList;
      for (const key in obj) {
        if (obj[key]?.name == node.name) {
          obj[key] = {
            ...obj[key],
            isSelected: !obj[key].isSelected,
            children: obj[key].children?.length
              ? obj[key]?.children?.map((each: any) => {
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
            children: obj[key]?.children?.map((each: any) => {
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
      let typeChangeToolAction: IToolbarAction = { type: "setViewLayers", data: obj };
      toolClicked(typeChangeToolAction);
    }

    // setActiveRealityMap(obj);
    // setLayersUpdated(!layersUpdated);
  };


  const issueMenuClicked = (localTool: IToolbarAction) => {
    toolClicked(localTool);
    // if (
    //   localTool.toolAction === "issueCreateClose" ||
    //   localTool.toolAction === "issueViewClose" ||
    //   localTool.toolAction === "issueView"
    // )
    // setRighttNav(!rightNav);
  };
  const taskMenuClicked = (localTool: IToolbarAction) => {
    toolClicked(localTool);
  };
  const handleOnIssueSort = (sortMethod: string) => {

  }
  const handleOnTasksSort = (sortMethod: string) => {

  }

  const deleteTheIssue = (selectedIssue: any) => {
    let selectedIssueforDelete: IToolbarAction = { type: "removedIssue", data: selectedIssue };
    toolClicked(selectedIssueforDelete)
  }
  const deleteTheTask = (selectedTask: any) => {
    let selectedTaskforDelete: IToolbarAction = { type: "removedTask", data: selectedTask };
    toolClicked(selectedTaskforDelete)
  }
  return initData ? (
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
          deleteTheIssue={deleteTheIssue}
          isCameraIconClicked={isCameraIconClicked}
          setCameraIconClicked={setCameraIconClicked}
          isClipboardIconClicked={isClipboardIconClicked}
          setClipboardIconClicked={setClipboardIconClicked}
          setHighlightCreateIcon={setHighlightCreateIcon}
          highlightCreateIcon={highlightCreateIcon}
          handleOnIssueSort={handleOnIssueSort}
          issueMenuClicked={issueMenuClicked}
          ref={issueRef}
          toolClicked={toolClicked}
        />

        <Task
          tasksList={initData?.currentTaskList}
          taskMenuClicked={taskMenuClicked}
          deleteTheTask={deleteTheTask}
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
          ref={taskRef}
          toolClicked={toolClicked}

        />


        {(initData.currentViewType === "pointCloud" || initData.currentViewType === "orthoPhoto") ?
          <CompareView
            issueMenuClicked={issueMenuClicked}
            ref={designRef}

          /> : <></>
        }



        {/* <Hotspot /> */}
      </ToolbarContainer>
    </SectionToolBar>

  ) : <></>;
};

export default forwardRef(ToolBarMenuWrapper);
