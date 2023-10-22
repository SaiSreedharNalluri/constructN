import React, { useEffect, useRef, useState } from "react";
import { TextField} from "@mui/material";
import { styled } from "@mui/system";
import Image from "next/image";
import ChevronLeftIcon from "../../../public/divami_icons/chevronLeft.svg";
import ChevronRightIcon from "../../../public/divami_icons/chevronRight.svg";
import CustomCalender from "../custom-datepicker/CustomCalender";
import LeftOverLay from "../../container/leftOverLay";
import { ChildrenEntity, IStructure } from "../../../models/IStructure";
import { getStructureList } from "../../../services/structure";
import { CustomToast } from "../custom-toaster/CustomToast"
import { useRouter } from "next/router";
import { getSectionsList } from "../../../services/sections";
import { AxiosResponse } from "axios";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const UploaderDateDetails = () => {
    const router = useRouter();
    const [structure, setStructure] = useState<IStructure>();
  const [selectedDate, setSelectedDate] = useState<any|null>(null);
  const [hierarchy, setHierarchy] = useState(true);
  const leftRefContainer: any = useRef();
  let [state, setState] = useState<ChildrenEntity[] | any[]>([]);
  const [structuresList, setStructuresList] = useState<IStructure[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<string[]>([]);
  const OpenMenuButton = styled("div")(({ onClick }: any) => ({
    position: "fixed",
    border: "1px solid #C4C4C4",
    height: "32px",
    width: "107px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    transform: "rotate(270deg)",
    left: "22px",
    bottom: "38px",
    cursor: "pointer",
    background: "#ffffff",
    fontFamily: "Open Sans",
    "&:hover": {
      background: "#EEEEEE",
    },
  })) as any;
  const handleDateChange = (date:any|null) => {
    setSelectedDate(date);
  };
  const handleNodeExpand = (data: any) => {
    setExpanded(data);
    window.localStorage.setItem("expandedNodes", JSON.stringify(data));
  };
  const CloseMenuButton = styled("div")(({ isFullScreen }: any) => ({
    height: "38px",
    width: "31px",
    // border: "1px solid #BDBDBD",
    position: "fixed",
    bottom: "0",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    zIndex: "99",
    backgroundColor: "#fffff !important",
    background: "rgb(255, 255, 255)",
    border: "1px solid rgb(189, 189, 189)",
    boxShadow: "rgb(200 200 200 / 10%) 5px 4px 8px",
    transform: "matrix(-1, 0, 0, 1, 0, 0)",
    marginLeft: isFullScreen ? 0 : "58px",
  })) as any;
 
  const createCancel = () =>{
    // if(highlightCreateIcon)
    //    {
    //     setHighlightCreateIcon(false)
    //     toolClicked({
    //       toolName: "issue",
    //         toolAction: "issueCreateFail"
    //        })
    //    }
    //     if(highlightCreateTaskIcon)
    //     { setHighlightCreateTaskIcon(false)
    //       toolClicked({
    //         toolName: "task",
    //           toolAction: "taskCreateFail"
    //          })
    //     } 
  }
  const handleNodeSelection = (nodeIds: any) => {
    setSelected(nodeIds);
   
  };
  
  const getNodeDataById = (id: string, list?: any) => {
   
    if (list?.length) {
      return list.find((e: any) => {
        if (e._id === id) {
          return e;
        }
      });
    } else {
      return structuresList.find((e) => {
        if (e._id === id) {
          return e;
        }
      });
    }
  };
  let [stateFilter, setStateFilter] = useState<ChildrenEntity[]>([]);
  useEffect(() => {
    if (router.isReady) {
      // if (router.query.structId !== undefined)
      // setSelector(router.query.structId.toString());
      getSectionsList(router.query.projectId as string)
        .then((response: AxiosResponse<any>) => {
          const result = response.data.result;
          const resultArray :any= Array.isArray(result) ? result : [result];
          setState([...resultArray]);
          setStateFilter([...response.data.result]);
          // if (selector.length < 1) setSelector(response.data.result[0]._id);
        })
        .catch((error) => {
          console.log("error", error);
        });
    }
  }, [router.isReady, router.query.projectId, router.query.structId]);

  const getStructureIds = (structure: any, list: any) => {
    console.log('getStructureIds',structure,list);
    const dataB: any[] = [];
    const getBreadCrumbs = (NodeData: any) => {
      dataB.unshift(NodeData?._id);

      const struct = NodeData.parent
        ? getNodeDataById(NodeData.parent, list)
        : null;
      if (struct) {
        getBreadCrumbs(struct);
      }
    };
    getBreadCrumbs(structure);
    return dataB;
  };
  useEffect(() => {
    if (router.isReady && router.query?.projectId) {
  getStructureList(router.query.projectId as string)
  .then((response) => {
    const list = response.data.result;
    console.log('apis',list);
    setStructuresList(list);
    let nodeData = localStorage.getItem("nodeData")
      ? JSON.parse(window.localStorage.getItem("nodeData") || "")
      : "";

    if (list.length > 0) {
      let structs: IStructure[] = list;

      if (router.query.structId !== undefined) {
        setStructure(
          structs.find((e) => {
            if (e._id === router.query.structId) {
              return e;
            }
          })
        );

        // setDefaultBreadcrumb()
      } else if (nodeData.project === router.query.projectId) {
        const selNode = structs.find((e) => {
          if (e._id === nodeData?._id) {
            return e;
          }
        });
        if (selNode) {
          setStructure(selNode);
          const nodes = getStructureIds(selNode, list);
          window.localStorage.setItem(
            "expandedNodes",
            JSON.stringify(nodes)
          );
          setExpanded(nodes);
        }
      } else {
        let index = response.data.result.findIndex(
          (structData: IStructure) => {
            return (
              structData.designs !== undefined &&
              structData.designs.length > 0
            );
          }
        );

        if (index > 0) {
          setStructure(response.data.result[index]);

          const nodes = getStructureIds(
            response.data.result[index],
            list
          );
          window.localStorage.setItem(
            "expandedNodes",
            JSON.stringify(nodes)
          );

          setExpanded(nodes);
        } else {
          setStructure(response.data.result[0]);
          const nodes = getStructureIds(response.data.result[0], list);
          window.localStorage.setItem(
            "expandedNodes",
            JSON.stringify(nodes)
          );

          setExpanded(nodes);
        }
      }
    }
  })
  .catch((error) => {
    CustomToast("failed to load data","error");
  });
}
}, [router.isReady, router.query.projectId]);
  const getCurrentStructureFromStructureList = (structure: ChildrenEntity) => {

    let currentStructure = structuresList.find((e) => {
      if (e._id === structure._id) {
        return e;
      }
    });
    return currentStructure;
  };
  const getStructureData = (structure: ChildrenEntity) => {
    console.log('getStructure',structure);
    setStructure(getCurrentStructureFromStructureList(structure));
    
  
  };
  return (
    <div className="">
    <div className="p-4 border border-white-500 bg-white-100 rounded-md shadow-md" style={{ borderLeft: "none", borderTop: "none", boxShadow: "0px 5px 5px rgba(0, 0, 0.1, 0.1)", maxWidth: "700px",margin: "0 60px"  }}>
    <p>Only images in .jpg, .jpeg with metadata info of GPS co-ordinates are accepted at the moment.</p>
  </div>
<p className="p-4">Choose the level for which you want to upload Drone capture data</p>
    <div style={{ display: "flex"}}>

      <div className="flex-1 pr-2">
        
   
      {hierarchy ? (
            <div  className="flex items-center justify-center h-full">
              <div>
                {
                  <LeftOverLay
                        handleNodeSelection={handleNodeSelection}
                        selectedNodes={structure?._id}
                        handleNodeExpand={handleNodeExpand}
                        expandedNodes={expanded}
                        getStructureData={getStructureData}
                        setHierarchy={setHierarchy}
                        getStructure={(structureData) => {
                          // if (structure === undefined) {
                          //   setStructure(
                          //     getCurrentStructureFromStructureList(structureData)
                          //   );
                          //   getIssues(structureData._id);
                          //   getTasks(structureData._id);
                          // }
                        }}
                        treeData={state}
                      ></LeftOverLay>
                   
                 
                }
              </div>
            </div>
          ) : (
            <div onClick={ createCancel}>
              {/* <OpenMenuButton
                onClick={() => {
                  setHierarchy(!hierarchy);
                }}
               
              >
                <Image
                  src={ChevronRightIcon}
                  alt="Arrow"
                  width={17}
                  height={17}
                  style={{ transform: "rotate(90deg)" }}
                />
                <div>Hierarchy</div>
              </OpenMenuButton> */}
              
            </div>
          )}
        
        </div>
       
<div className="flex-1 justify-end">
  
    <h2 className="text-sm mb-2">Enter Capture Date for {structure?.name}</h2>
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <DatePicker
        className="ml-2 border border-border-yellow border-solid focus:outline-yellow-500 w-22 p-1 rounded hover:border-yellow-500"
        placeholderText="Select Date"
        selected={selectedDate}
        onChange={(date) => handleDateChange(date)}
      />
   
  </div>
</div>


      </div>
    </div>
  );
};

export default UploaderDateDetails;
