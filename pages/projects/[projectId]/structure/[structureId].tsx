import React, { useEffect, useMemo, useState } from "react";
import Header from "../../../../components/divami_components/header/Header";
import SidePanelMenu from "../../../../components/divami_components/side-panel/SidePanel";
import NewGenViewer from "../../../../components/container/NewGenViewer";
import { IGenData } from "../../../../models/IGenData";
import { sampleGenData } from "../../../../utils/constants";
import { IDesign } from "../../../../models/IDesign";
import { getDesignTM } from "../../../../services/design";
import { getDesignPath } from "../../../../utils/S3Utils";
const StructPage: React.FC = () => {
    //const [initData,setInintData] = useState<IGenData>(sampleGenData);
    let temp_list:IDesign[] ;
    sampleGenData.structure.designs&& (temp_list= sampleGenData.structure.designs);
    const fetchTM = //useMemo(
      async ()=>{
      if(temp_list!==undefined)
       for (let design of temp_list) {
      if (!design.tm) {
        let response :any= await getDesignTM(
          getDesignPath(design.project, design.structure, design._id)
        );
        design.tm = response.data;
        
      }

    }
    sampleGenData.structure.designs=temp_list;
    console.log('My Comp Parent Refetch')
    
  };
  //,[sampleGenData]);
  fetchTM();//useMemo
  const updateData= (newData:IGenData)=>{
    console.log('My comp updated',newData);
    setInintData(newData);
  }
  //console.log("OVERHERE",sampleGenData.structure.designs);
  const [initData,setInintData] = useState<IGenData>(sampleGenData);
  useEffect(()=>{
    console.log('My comp useEffect');
setInintData(sampleGenData);
  },[sampleGenData]);
  return (
    <React.Fragment>
      <div className="h-screen flex flex-col">
        <div>
          <Header />
        </div>
        <div className="flex flex-row left-0">
          {/* <CollapsableMenu onChangeData={() => {}} /> */}
          <div><SidePanelMenu onChangeData={() => {}} /></div>
          <div><NewGenViewer data={initData} updateData={updateData}/> </div>
        </div>
        
      </div>
    </React.Fragment>
  );
};
export default StructPage;