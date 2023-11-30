import { useEffect, useRef, useState } from "react";
import { getDesignMap,getRealityMap } from "../../utils/ViewerDataUtils";
import { getDesignTM } from "../../services/design";
import { getDesignPath } from "../../utils/S3Utils";
import structure from "../../pages/projects/[projectId]/structure";
import { getSnapshotsList } from '../../services/snapshot';
import TimeLineComponent from "../divami_components/timeline-container/TimeLineComponent";
import { MqttConnector } from "../../utils/MqttConnector";
function Iframe(props:any) {
    let [designList, setDesignList] = useState([]);
    let [designMap, setDesignMap] = useState({});
    let updateDesignMap = props.updateDesignMap;
    let pushToolResponse = props.toolRes;
    let viewMode = props.viewMode;
    let currentViewMode = useRef(viewMode);
    let [viewerType, setViewerType] = useState('Forge');
    let currentViewerType = useRef(viewerType);
    let currentStructure = useRef();
     let forgeUtils = useRef();
     let currentContext = useRef();
     let viewType = (props.viewType);
     let currentViewType = useRef(viewType);
     let updateSnapshot = props.updateSnapshot;
     let [snapshot, setSnapshot] = useState({});
     let [realityList, setRealityList] = useState([]);
     let [realityMap, setRealityMap] = useState({});
     let updateRealityMap = props.updateRealityMap;
     let [snapshotList, setSnapshotList] = useState([]);
  let [snapshotCompareList, setSnapshotCompareList] = useState([]);
  let [snapshotListCal, setSnapshotListCal] = useState([]);
  let [compareSnapshot, setCompareSnapshot] = useState({});
  let [compareRealityList, setCompareRealityList] = useState([]);
  let [compareRealityMap, setCompareRealityMap] = useState({});
  const [totalSnaphotsCount,setTotalSnaphotsCount] = useState(0)
  let [isLoading,setIsLoading]=useState(false)
  


    // setDesignMap(getDesignMap(designList));
    // updateDesignMap(getDesignMap(designList));
    const modifyDesignList = async (designList:any) => {
        setDesignList(designList);
        // if(designList.length===0)
        // {
        //   setIsLoading(true)
        // }
        
        //Set current design type and pass it to structure page.
        setDesignMap(getDesignMap(designList));
        updateDesignMap(getDesignMap(designList));  
        return designList;
      };

      useEffect(()=>{
        modifyDesignList(props.structure?.designs);
      })
      useEffect(() => {
        // console.log("Generic Viewer Structure UseEffect:");
        if (currentStructure.current != props.structure) {
          currentStructure.current = props.structure;
          if (props.structure?.designs.length > 0) {
            modifyDesignList(props.structure?.designs);
          } else {
            setDesignList([]);
            setIsLoading(true)
            setDesignMap(getDesignMap([]));
            updateDesignMap(getDesignMap([]));
          }
        //   getSnapshotList(props.structure.project, props.structure._id);
          // console.log("Generic Viewer load: Structure Changed", structure);
        }
        // animationRequestId = requestAnimationFrame(animationNow);
        // return cleanUpOnStructureChange;
      }, [structure]);
      
      const getViewerTypeFromViewType = (myViewType=viewType) => {
        switch (myViewType) {
          case 'pointCloud':
            if (currentViewMode.current == 'Design') {
              currentViewMode.current = 'Reality'
              pushToolResponse({
                toolName: 'viewMode',
                toolAction: 'Reality',
              });
            }
            return 'Potree';
            break;
          case 'orthoPhoto':
            if (currentViewMode.current == 'Design') {
              currentViewMode.current = 'Reality'
              pushToolResponse({
                toolName: 'viewMode',
                toolAction: 'Reality',
              });
            }
            return 'Mapbox';
            break;
          default:
            if (currentViewMode.current == 'Reality') {
              currentViewMode.current = 'Design'
              pushToolResponse({
                toolName: 'viewMode',
                toolAction: 'Design',
              });
            } else {
              handleDesignTypeChange();
            }
            return 'Forge';
        }
      }
      function handleDesignTypeChange() {

        switch (currentViewerType.current) {
          case 'Forge':
            if (forgeUtils.current) {
            //   forgeUtils.current.setType(currentViewType.current);
            //   forgeUtils.current.refreshData(currentContext.current);
            }
            break;
        }
        currentContext.current = undefined;


    //     const getSnapshotList = async (projectId:any, structurId:any,offset:any,limit:any,snap="") => {
    //         let list = await getSnapshotsList(projectId, structurId,offset||1,limit||10);
    //         setTotalSnaphotsCount(list.data?.result?.totalSnapshots)
    //         setSnapshotListCal(list.data?.result?.calendarSnapshots)
    //         list = list.data.result.mSnapshots.sort(
    //           (a:any, b:any) => new Date(a.date).getTime() - new Date(b.date).getTime()
    //         );
    //         if (list.length>0 && snap!==""){
    //           let mySnap=list.find((s)=>{if(s._id==snap)return s;})
        
    //           setSnapshotCompareList(list);
    //           setSnapshotList(list);
    //           if (mySnap){
    //             setCurrentSnapshot(mySnap);
    //             setCurrentCompareSnapshot(list[list.length - 1]); 
    //           }
    //           else {
    //           setCurrentSnapshot(list[list.length - 1]);
    //           if (list.length > 1) {
    //             setCurrentCompareSnapshot(list[list.length - 2]);
    //           } 
    //           else {
    //             setCurrentCompareSnapshot(list[list.length - 1]);
    //           }
    //         }
    //         }
    //         else if(list.length>0 && router.query.snap!=null){
    //           let mySnap=list.find((s)=>{if(s._id==router.query.snap)return s;})
              
    //           setSnapshotCompareList(list);
    //           setSnapshotList(list);
    //           if (mySnap)
    //           setCurrentSnapshot(mySnap);
    //           else 
    //           setCurrentSnapshot(list[list.length - 1]);
    //           if (list.length > 1) {
    //             setCurrentCompareSnapshot(list[list.length - 2]);
    //           } 
    //           else {
    //             setCurrentCompareSnapshot(list[list.length - 1]);
    //           }
    //         }
    //         else if (list.length > 0) {
              
    //           setSnapshotCompareList(list);
    //           setSnapshotList(list);
    //           setCurrentSnapshot(list[list.length - 1]);
    //           if (list.length > 1) {
    //             setCurrentCompareSnapshot(list[list.length - 2]);
    //           } else {
    //             setCurrentCompareSnapshot(list[list.length - 1]);
    //           }
    //         } else {
              
    //           setSnapshotCompareList([]);
    //           setSnapshotList([]);
        
    //           setCurrentSnapshot({});
    //           setCurrentCompareSnapshot({});
    //         }
    //         //initial compare setting
    //         if(snapshotCompareList.length<1 && list.length>0){
    //           setSnapshotCompareList(list);
        
    //         }
    //       };
        
      
    //   }
      }
      const setCurrentSnapshot = async (snapshot:any) => {
        if (snapshot && Object.keys(snapshot).length > 0) {
          setSnapshot(snapshot);
          updateSnapshot(snapshot);
          const map = await getRealityMap(snapshot);
          setRealityList(snapshot.reality);
          setRealityMap(map);
          updateRealityMap(map);
        } else {
          setSnapshot({});
          updateSnapshot({});
          const map = await getRealityMap({});
          setRealityList([]);
          setRealityMap(map);
          updateRealityMap(map);
        }
    
      };

    return(
        <div>
        <iframe className=""
            src={`http://localhost:3001/projects/${props.projectId}/structure/${props.structureId}/web?topicKey=${MqttConnector.topicHash}`}
            // src={"http://localhost:3001/projects/PRJ201897/structure/STR996375"}
              width={1120}
              height={470}
              title="Snapshot iframe"
            />

            </div>
            
    )

}

export default Iframe;