import React, { useEffect, useState } from "react";
import { showObservationDetails, showRfiDetails, showSubmittalDetails } from "../../../services/procore";
interface ProcoreExistProps {
  selected: any;
  onCloseProcore: () => void;
}

const ProcoreExist: React.FC<ProcoreExistProps> = ({
  selected,
  onCloseProcore,
}) => {
  const { type, id } = selected.integration.procore;
  const [details, setDetails] = useState<any>(null);

  useEffect(() => {
    if (type === "rfi") {
      showRfiDetails(id).then((response) => {
        if (response) {
          setDetails(response);
        }
      });
    } else if (type === "observation") {
      showObservationDetails(id).then((response)=>{
        
        if(response){
          setDetails(response);
        }
      })
    }else if ( type === "submittal"){
      showSubmittalDetails(id).then((response)=>{
        
        if(response){
          setDetails(response);
        }
      })
    }else{
      console.log('error in type and id ')
    }
  }, []);

  return (
    <div className="bg-white p-4 w-[438px] rounded shadow-lg">
    <button className=" text-border-yellow absolute top-4 right-4" onClick={onCloseProcore}>
      Close
    </button>
    {details && (
      <>
        <div className="flex flex-col items-start mt-4">
        <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'black' }}>
            Type: {type}
          </div>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'black' }}>
            Title: {details.title || details.name}
          </div>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'black' }}>
          Status: {type === 'submittal' ? details.status.name : details.status}

          </div>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'black' }}>
            ID: {details.id}
          </div>
        </div>
        <a href={details.link} target="_blank" rel="noopener noreferrer" className="block mt-4 text-border-yellow hover:underline">
          View {type} in Procore
        </a>
      </>
    )}
  </div>
  
  );
};

export default ProcoreExist;
