import React, { useEffect, useRef, useState } from "react";
import { styled } from "@mui/system";
import { ChildrenEntity, IStructure } from "../../../models/IStructure";
import { getStructureList } from "../../../services/structure";
import { CustomToast } from "../custom-toaster/CustomToast"
import { useRouter } from "next/router";
import { getSectionsList } from "../../../services/sections";
import { AxiosResponse } from "axios";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import SectionList from "../../container/sectionList";


interface UploaderDateDetailsProps {
  onDateSelected: () => void;
}
const UploaderDateDetails : React.FC<UploaderDateDetailsProps> = ({ onDateSelected }) => {
    const router = useRouter();
    const [structure, setStructure] = useState<IStructure>();
  const [selectedDate, setSelectedDate] = useState<any|null>(null);
  let [state, setState] = useState<ChildrenEntity[] | any[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [structuresList, setStructuresList] = useState<IStructure[]>([]);
  const [showMessage, setShowMessage] = useState(true);
  const handleDateChange = (date: any | null) => {
    if (date !== null) {
    setSelectedDate(date);
    setShowMessage(false);
    onDateSelected(); 
  } else {
    setSelectedDate(null);
    setShowMessage(true);
  }
   
  };
  
  const handleNodeExpand = (data: any) => {
    setExpanded(data);
    window.localStorage.setItem("expandedNodes", JSON.stringify(data));
  };
 

  const handleNodeSelection = (nodeIds: any) => {
    setSelected(nodeIds);
   
  };
  useEffect(() => {
    if (router.isReady && router.query?.projectId) {
    getStructureList(router.query.projectId as string)
        .then((response) => {
          const list = response.data.result;
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
  const getNodeDataById = (id: string, list?: any) => {
   
    if (list?.length) {
      return list.find((e: any) => {
        if (e._id === id) {
          return e;
        }
      });
    } else {
    
    }
  };
  const getCurrentStructureFromStructureList = (structure: ChildrenEntity) => {
    let currentStructure = structuresList.find((e) => {
      if (e._id === structure._id) {
        return e;
      }
    });
    return currentStructure;
  };
  const getStructureData = (structure: ChildrenEntity) => {
    setStructure(getCurrentStructureFromStructureList(structure));}
  useEffect(() => {
    if (router.isReady) {
      getSectionsList(router.query.projectId as string)
        .then((response: AxiosResponse<any>) => {
          const result = response.data.result;
          const resultArray :any= Array.isArray(result) ? result : [result];
          setState([...resultArray]);
        })
        .catch((error) => {
          console.log("error", error);
        });
    }
  }, [router.isReady, router.query.projectId, router.query.structId]);

  const getStructureIds = (structure: any, list: any) => {
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
  console.log(structure?.name)
  return (
    <div className="">
   {showMessage && (
        <div className="p-4 border border-white-500 bg-white-100 rounded-md shadow-md" style={{ borderLeft: "none", borderTop: "none", boxShadow: "0px 5px 5px rgba(0, 0, 0.1, 0.1)", maxWidth: "700px", margin: "0 60px" }}>
          <p className="w-997px h-24px font-sans font-semibold not-italic text-base line-height-150%">Only images in .jpg, .jpeg with metadata info of GPS co-ordinates are accepted at the moment.</p>
        </div>
      )}
      <p className="p-2 w-997px h-24px font-sans font-normal  not-italic text-lg line-height-150%"style={{ margin: "0 60px" }}>Choose the level for which you want to upload Drone capture data.</p>
    <div style={{ display: "flex"}}>

      <div className="flex-1 pr-2"style={{ margin: "0 60px" }}>
        <p className="pt-2 pr-2 pl-2 pb-0 w-94px,h-20px,font-sans not-italic font-semibold text-sm">Section Name</p>
        <div className="w-full border-t border-solid border-border-yellow" style={{ height: "1px" }}></div>
            <div  className=" pt-4 flex items-center justify-left h-[calc(100vh-350px)]">
              <div>
                {
                  <SectionList
                  getStructureData={getStructureData}
                  handleNodeSelection={handleNodeSelection}
                  selectedNodes={structure?._id}
                  handleNodeExpand={handleNodeExpand}
                  expandedNodes={expanded}
                  treeData={state}                    
                   ></SectionList>
                   
                 
                }
              </div>
            </div>
          
        
        </div>
       
<div className="flex-1/3 justify-end">
  
    <h2 className="pt-2 pr-2 pl-2 pb-0 w-94px,h-20px,font-sans not-italic font-semibold text-sm">Enter Capture Date for {structure?.name}</h2>
    <div className="w-full border-t border-solid border-border-yellow" style={{ height: "1px" }}></div>
    <div className="pt-2" style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <DatePicker
        className="ml-2 border border-border-yellow border-solid focus:outline-yellow-500 w-22 p-1 rounded hover:border-yellow-500"
        placeholderText="MM/DD/YYYY"
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
