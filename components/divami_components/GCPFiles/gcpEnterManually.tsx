import React, { useEffect, useState } from "react";
import { useUploaderContext } from "../../../state/uploaderState/context";
import { Label, TabelHeading } from "./GCPStyledComponents";
import { getInitialGCPList } from "../../../utils/utils";
import { GCPType, IGCP } from "../../../models/IGCP";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { location, utmLocation } from "../../../models/IRawImages";

const GcpEnterManually: React.FC<any> = () => {
  const { state: uploaderState, uploaderContextAction } = useUploaderContext();
  const { uploaderAction } = uploaderContextAction;
  const [isVaild, setIsVaild]=useState<boolean>(false)
  var isValid = true;
  const addRow = () => {
    const newGcp: utmLocation = {
      easting: 0,
      northing: 0,
      elevation: 0,
      zone: ""
    };

    const newLatLngGcp: location = {
      coordinates: [0, 0],
      type: "point",
      elevation: 0,
    };

    let gcpList: IGCP = {};
    if (uploaderState.gcpType === GCPType.UTM) {
      let location = uploaderState.gcpList.utmLocation ? [...uploaderState.gcpList.utmLocation] : []
      gcpList.utmLocation = [...location, newGcp]
    } else {
      let location = uploaderState.gcpList.location ? [...uploaderState.gcpList.location] : []
      gcpList.location = [...location, newLatLngGcp]
    }
    uploaderAction.setGCPList(gcpList, uploaderState.gcpType);
  };
  const handleDeleteRow = (index: number) => {
    const updatedGCPList = uploaderState.gcpType === GCPType.UTM
      ? [...uploaderState.gcpList.utmLocation as utmLocation[]]
      : [...uploaderState.gcpList.location as location[]];
  
    updatedGCPList.splice(index, 1);
  
    uploaderAction.setGCPList({
      utmLocation: uploaderState.gcpType === GCPType.UTM ? updatedGCPList as utmLocation[] : undefined,
      location: uploaderState.gcpType === GCPType.LONGLAT ? updatedGCPList as location[] : undefined,
    }, uploaderState.gcpType);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number, heading: string) => {
    const value = e.target.value;
    
    const updatedGCPList = uploaderState.gcpType === GCPType.UTM
      ? [...uploaderState.gcpList.utmLocation as utmLocation[]]
      : [...uploaderState.gcpList.location as location[]];
  
    const selectedItem: any = updatedGCPList[index];
 
   
    if (!/^\d*\.?\d*$/.test(value)) {
    
      setIsVaild(true);
    } else {
      if (uploaderState.gcpType === GCPType.UTM) {
        if (heading === "Zone Identifier") {
          (selectedItem as utmLocation).zone = value;
        } else {
         
          (selectedItem as any)[heading.toLowerCase() as keyof utmLocation] = value;
        }
      } else {
        if (heading === "Longitude") {
          const parsedValue = value;
         
          if ( Number(parsedValue) >= -180 && Number(parsedValue) <= 180) {
            
            (selectedItem as location).coordinates[0] = Number(parsedValue);
          } else {
            
            setIsVaild(false);
          }
        } else if (heading === "Latitude") {
          const parsedValue = value;
          if (Number(parsedValue) >= -90 && Number(parsedValue) <= 90) {
            (selectedItem as location).coordinates[1] = Number(parsedValue);
          } else {
            setIsVaild(false);
          }
        } else if (heading === "Altitude") {
          (selectedItem as any).elevation = value;
        } else {
          
          setIsVaild(false),
          (selectedItem as any)[heading.toLowerCase() as keyof location] = value;
        }
      }
      setIsVaild(false);
    }

    const inputElement = document.getElementById(`${heading}-${index}`);
    if (inputElement) {
      
      inputElement.style.borderColor = isValid ? 'initial' : 'box-orange';
    }
  
    uploaderAction.setGCPList({
      utmLocation: uploaderState.gcpType === GCPType.UTM ? updatedGCPList as utmLocation[] : undefined,
      location: uploaderState.gcpType === GCPType.LONGLAT ? updatedGCPList as location[] : undefined,
    }, uploaderState.gcpType);
  
   
    
  };
  
  

  

  const renderTable = (data: any, headings: any) => (
    <div >
    <table >
       <thead className=" sticky top-0 bg-white ">
       <tr className=" text-justify">
     <th></th>
          {headings.map((heading: any, index: any) => (
            <th key={index}>
              <TabelHeading>{heading}</TabelHeading>
            </th>
            
          ))}
           <th><TabelHeading>Action</TabelHeading></th> 
        </tr>
      </thead>
      <tbody>
        {data.map((item: any, index: any) => (
          <tr key={index}>
            <td>
              <Label>{`Point ${index + 1}`}</Label>
            </td>
            {headings.map((heading: any, subIndex: any) => (
              <td key={subIndex} >
                <div >
                <input
                id={`${subIndex}`}
                  type="text"
                  placeholder={heading.toLowerCase()}
                  className={`mt-1 ml-2 border`}
                  value={
                    item[heading.toLowerCase()] ||
                    (heading === "Longitude" && item.coordinates[0]) ||
                    (heading === "Latitude" && item.coordinates[1]) ||
                    (heading === "Altitude" && item.elevation) ||
                    ""
                  }
                  onChange={(e) => handleInputChange(e, index, heading)}
                
                />
                </div>
              </td>
            ))}
             <td>
            <button onClick={() => handleDeleteRow(index)}><FontAwesomeIcon icon={faTimes} /></button>
          </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );

  return (
    <div>
      <div style={{ margin: "0 60px", width: "997px" }}>
        <div className="w-full grid grid-cols-2 gap-4">
          <div>
            <label>
              <input
                type="radio"
                name="secondOption"
                value={GCPType.UTM}
                className="h-[20px] relative top-[2px] w-[20px] my-[4px] accent-orange-600"
                checked={uploaderState.gcpType === GCPType.UTM}
                onChange={(e) => {
                  if(e.currentTarget.checked) { 
                    uploaderAction.setGCPType(GCPType.UTM)
                  }
                }}
              />
              &nbsp; {GCPType.UTM}
            </label>
          </div>
          <div>
            <label>
              <input
                type="radio"
                name="secondOption"
                value={GCPType.LONGLAT}
                className="h-[20px] relative top-[2px] w-[20px] my-[4px] accent-orange-600"
                checked={uploaderState.gcpType === GCPType.LONGLAT}
                onChange={(e) => {
                  if(e.currentTarget.checked) { 
                    uploaderAction.setGCPType(GCPType.LONGLAT)
                  }
                }}
              />
              &nbsp; {GCPType.LONGLAT}
            </label>
          </div>
        </div>
      </div>
      <div style={{ margin: "0 0 0 60px", marginTop: "8px" }}>
        <div
          style={{ maxHeight: "150px", maxWidth: "750px", overflowY: "auto",
        }}
         className="isScroll"
        >
          {uploaderState.gcpType === GCPType.UTM ?
            renderTable(uploaderState.gcpList.utmLocation, [
              "Easting",
              "Northing",
              "Zone",
              "Elevation",
            ]) : renderTable(uploaderState.gcpList.location, ["Longitude", "Latitude", "Altitude"])}
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <p style={{margin: "0 0 0 60px",fontSize: "small",fontStyle: "italic" }} >
            At least 4 GCPs needed
          </p>
          <button onClick={addRow}>
            <span className="plus-symbol" style={{ margin: "0 0 0 170px",color: "#F1742E",fontStyle: "italic",}}>
              + Add
            </span>
          </button>
        </div>
        <hr />
      </div>
    </div>
  );
};

export default GcpEnterManually;
