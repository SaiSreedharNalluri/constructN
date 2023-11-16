import React, { useEffect, useState } from "react";
import { useUploaderContext } from "../../../state/uploaderState/context";
import { Label, TabelHeading } from "./GCPStyledComponents";
import { getInitialGCPList } from "../../../utils/utils";
import { GCPType, IGCP } from "../../../models/IGCP";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { location, utmLocation } from "../../../models/IRawImages";
import Delete from "../../../public/divami_icons/delete.svg";
import Image from "next/image";

const GcpEnterManually: React.FC<any> = () => {
  const { state: uploaderState, uploaderContextAction } = useUploaderContext();
  const { uploaderAction } = uploaderContextAction;
  
 
  const addRow = () => {
    const newGcp: utmLocation = {
      easting: 0,
      northing: 0,
      elevation: 0,
      zone: "",
    };

    const newLatLngGcp: location = {
      coordinates: [0, 0],
      type: "point",
      elevation: 0,
    };

    let gcpList: IGCP = {};
    if (uploaderState.gcpType === GCPType.UTM) {
      let location = uploaderState.gcpList.utmLocation
        ? [...uploaderState.gcpList.utmLocation]
        : [];
      gcpList.utmLocation = [...location, newGcp];
    } else {
      let location = uploaderState.gcpList.location
        ? [...uploaderState.gcpList.location]
        : [];
      gcpList.location = [...location, newLatLngGcp];
    }
    uploaderAction.setGCPList(gcpList, uploaderState.gcpType);
  };
  const handleDeleteRow = (index: number) => {
    const updatedGCPList =
      uploaderState.gcpType === GCPType.UTM
        ? [...(uploaderState.gcpList.utmLocation as utmLocation[])]
        : [...(uploaderState.gcpList.location as location[])];

    updatedGCPList.splice(index, 1);

    uploaderAction.setGCPList(
      {
        utmLocation:
          uploaderState.gcpType === GCPType.UTM
            ? (updatedGCPList as utmLocation[])
            : undefined,
        location:
          uploaderState.gcpType === GCPType.LONGLAT
            ? (updatedGCPList as location[])
            : undefined,
      },
      uploaderState.gcpType
    );
  };
  const validateLatitude = (latitude: number, index: any) => {
  
    return latitude >= -90 && latitude <= 90 && latitude !== 0;
  };
  
  const validateLongitude = (longitude: number, Index: any) => {

    return  longitude >= -180 && longitude <= 180 && longitude !== 0;
    
    } 
  
    
    const validateInput = (value: number | undefined, heading: string) => {
      if (heading === "Easting" || heading === "Northing" || heading === "Zone" || heading === "Elevation") {
        
        return value !== undefined && value !== 0;
      } 
    
      return true;
    };
    const handleInputChange = ( e: React.ChangeEvent<HTMLInputElement>, index: number, heading: string) => {
      const value = e.target.value;
  
      const updatedGCPList =uploaderState.gcpType === GCPType.UTM ? [...(uploaderState.gcpList.utmLocation as utmLocation[])] : [...(uploaderState.gcpList.location as location[])];
      const selectedItem: any = updatedGCPList[index];
  
      if (!/^\d*\.?\d*$/.test(value)) {
        console.log("alphabets not allowed");
      } else {
        if (uploaderState.gcpType === GCPType.UTM) {
          if (heading === "Zone Identifier") {
            (selectedItem as utmLocation).zone = value as string;
          } else {
            (selectedItem as any)[heading.toLowerCase() as keyof utmLocation] =
              value;
          }
        } else {
          if (heading === "Longitude") {
            const parsedValue = value;
            (selectedItem as location).coordinates[0] = Number(parsedValue);
          } else if (heading === "Latitude") {
            const parsedValue = value;
            (selectedItem as location).coordinates[1] = Number(parsedValue);
          } else if (heading === "Altitude") {
            (selectedItem as any).elevation = value;
          } else {
            (selectedItem as any)[heading.toLowerCase() as keyof location] =
              value;
          }
        }
      }
  
      uploaderAction.setGCPList(
        {
          utmLocation:
            uploaderState.gcpType === GCPType.UTM
              ? (updatedGCPList as utmLocation[])
              : undefined,
          location:
            uploaderState.gcpType === GCPType.LONGLAT
              ? (updatedGCPList as location[])
              : undefined,
        },
        uploaderState.gcpType
      );
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
           <th><TabelHeading>Delete</TabelHeading></th> 
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
                  className={`mt-1 ml-2 border ${
                    (heading === "Longitude" &&
                      !validateLongitude(item.coordinates[0], index)) ||
                    (heading === "Latitude" &&
                      !validateLatitude(item.coordinates[1], index)) ||
                      !validateInput(item[heading.toLowerCase()], heading)
                      ? "border-red-500"
                      : ""
                  }`}
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
            <button onClick={() => handleDeleteRow(index)}><Image src={Delete} alt="" className="mt-[3px] ml-[10px]"/></button>
          </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );

  return (
    <div>
    <div className="flex w-1/3 justify-between">
          <div>
            <label>
              <input
                type="radio"
                name="secondOption"
                value={GCPType.UTM}
                className="h-[20px] w-[20px] mt-[20px] accent-orange-600"
                checked={uploaderState.gcpType === GCPType.UTM}
                onChange={(e) => {
                  if (e.currentTarget.checked) {
                    uploaderAction.setGCPType(GCPType.UTM);
                  }
                }}
              />
              &nbsp; {GCPType.UTM}
            </label>
          </div>
          <div className="mr-[42px]">
            <label>
              <input
                type="radio"
                name="secondOption"
                value={GCPType.LONGLAT}
                className="h-[20px] relative top-[2px] w-[20px] mt-[20px] accent-orange-600"
                checked={uploaderState.gcpType === GCPType.LONGLAT}
                onChange={(e) => {
                  if (e.currentTarget.checked) {
                    uploaderAction.setGCPType(GCPType.LONGLAT);
                  }
                }}
              />
              &nbsp; {GCPType.LONGLAT}
            </label>
          </div>
        </div>
      <div style={{ marginTop: "8px" }}>
        <div
          style={{ maxHeight: "150px",  width:"fit-content",overflowY: "auto",
        }}
         className="isScroll"
        >
          {uploaderState.gcpType === GCPType.UTM
            ? renderTable(uploaderState.gcpList.utmLocation, [
                "Easting",
                "Northing",
                "Zone",
                "Elevation",
              ])
            : renderTable(uploaderState.gcpList.location, [
                "Longitude",
                "Latitude",
                "Altitude",
              ])}
        </div>

        <div style={{ display: "flex", justifyContent:"space-between",width:"33.3%" }}>
          <p style={{fontSize: "small",fontStyle: "italic" }} >
            At least 4 GCPs needed
            
          </p>
          <button onClick={addRow}>
            <span
              className="plus-symbol"
              style={{ margin: "0 0 0 170px", color: "#F1742E" }}
            >
              + Add
            </span>
          </button>
        </div>
        <hr className="mt-[10px]"/>
      </div>
    </div>
  );
};

export default GcpEnterManually;
