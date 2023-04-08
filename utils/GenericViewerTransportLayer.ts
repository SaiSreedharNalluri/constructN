//import { IGenPayload } from "../models/IGenPayload";

import ForgeViewer from "../components/container/forgeViewer";
import { IGenData } from "../models/IGenData";
import { IGenPayload } from "../models/IGenPayload";
import { ForgeViewerUtils } from "./ForgeWrapper2";
import { PotreeViewerUtils } from "./PotreeWrapper";


//var myPayload :IGenPayload;
//const notifyViewerEvent = new CustomEvent("notify-viewer", myPayload);
//export function subscribeViewer(){
// globalThis.addEventListener('notify-viewer', (payload)=>{
//     console.log(
//       `start event triggered on platform :
//       ${payload}`
//       );
// });
//}
//Event
let forgeUtil =ForgeViewerUtils ;
let potreeUtil : PotreeViewerUtils;
let viewerId :string;
let payload : IGenPayload;
export function notifyViewerEvent(e:any){
  
    let cusEve: CustomEvent =e
    payload =  cusEve.detail;
    console.log(
      'custom event triggered on platform :',
      payload
      );

      switch (payload.action.type)
      {
        case 'loadGenViewer':
          loadGenViewer(viewerId,payload.data)
        case 'syncGenViewer':
          break;
        case 'setViewMode':
          break;
        case 'issueCreate':
          addTag('Issue');
          break;
        case 'issueCreateFail':
          cancelAddTag('Issue');
          break;
        case 'issueShow':
          showTag('Issue',true);
          break;
        case 'issueHide':
          showTag('Issue',false);
          break;
        case 'issueRemoved':
          cancelAddTag('Issue');
          break;



      }

}
function loadGenViewer(viewerId:string,viewerData:IGenData){
  if(viewerData.currentViewMode==='Design')
    if(forgeUtil===undefined){
      forgeUtil= ForgeViewerUtils;
      forgeUtil.initializeViewer(viewerId, viewerEventHandler);
      forgeUtil.setType(viewerData.currentViewType);
    }
  if(viewerData.currentViewMode==='Reality')
    if(potreeUtil===undefined){
      potreeUtil= new PotreeViewerUtils(viewerId,
              viewerEventHandler
            );
      if (!potreeUtil.isViewerLoaded()) {
        potreeUtil.initialize();
            }
      }

}

const viewerEventHandler = (viewerId:string, event:Event) => {
  // console.log("Inside generic viewer: ", event, );
  if (event) {
    switch (event.type) {
      case '360 Video':
        // currentContext.current = event;
        // if (currentViewMode.current == 'Design') {
        //   pushToolResponse({
        //     toolName: 'viewMode',
        //     toolAction: 'Reality',
        //   });
        //   setViewMode('Reality');
        // } else {
        //   pushToolResponse({
        //     toolName: 'viewMode',
        //     toolAction: 'Design',
        //   });
        //   setViewMode('Design');
        // }
        break;
      case 'Reality':
        break;
      case 'Task':
      case 'Issue':
        // if (!activeTool.current) {
        //   activeTool.current = {};
        // }
        // activeTool.current.toolName = event.type;
        // activeTool.current.toolAction = event.id.includes('Temp')
        //   ? `create${event.type}`
        //   : `select${event.type}`;
        // activeTool.current.response = event;
        // pushToolResponse(activeTool.current);
        // console.log('Marked Point========', event);
        // break;
      case '3d':
      case 'panorama':
      case 'image':
        // if (currentIsCompare.current == true) {
        //   if (isCompareViewer(viewerId)) {
        //     potreeUtils.current.updateContext(event, false);
        //   } else {
        //     if (currentCompareViewMode.current === 'Reality') {
        //       potreeCompareUtils.current.updateContext(event, false);
        //     } else {
        //       forgeCompareUtils.current.updateContext(event, false);
        //     }
        //   }
        // }
        // break;
      case 'sync':
        // console.log("Inside sync event: ", currentIsCompare.current, isRealityViewer(viewerId))
        // if (currentIsCompare.current == true) {
        //   if (isRealityViewer(viewerId)) {
        //     syncPotreeEvent.current = true;
        //   } else {
        //     syncForgeEvent.current = true;
        //   }
        // }
        break;
      case 'zoom':
        // console.log("Sync event handler: ", viewerId);
        // if (currentIsCompare.current === true) {
        //   syncViewer(viewerId);
        // }
        break;
      case 'mouse':
        // if (currentIsCompare.current === true) {
        //   if (isCompareViewer(viewerId)) {
        //     isMouseOnMainViewer.current = false;
        //   } else {
        //     isMouseOnMainViewer.current = true;
        //   }
        // }
        break;
    }
  }
};

const addTag = (type:string) => {
  switch (payload.data.currentViewMode) {
    case 'Design':
      if (forgeUtil) {
        forgeUtil.initiateAddTag(type);
      }
      break;
    case 'Reality':
      if (potreeUtil) {
        potreeUtil.initiateAddTag(type);
      }
      break;
  }
};

const cancelAddTag = (type:string) => {
  switch (payload.data.currentViewMode) {
    case 'Design':
      if (forgeUtil) {
        forgeUtil.cancelAddTag();
      }
      break;
    case 'Reality':
      if (potreeUtil) {
        potreeUtil.cancelAddTag();
      }
      break;
  }
};

const selectTag = (tag : string) => {
  switch (payload.data.currentViewMode) {
    case 'Design':
      if (forgeUtil) {
        forgeUtil.selectTag(tag);
      }
      break;
    case 'Reality':
      if(potreeUtil) {
        potreeUtil.selectTag(tag);
      }
      break;
  }
};

const showTag = (tag:string, show:boolean) => {
  switch (payload.data.currentViewMode) {
    case 'Design':
      if (forgeUtil) {
        forgeUtil.showTag(tag, show);
      }
      break;
    case 'Reality':
      if (potreeUtil) {
        potreeUtil.showTag(tag, show);
      }
      break;
  }
};


