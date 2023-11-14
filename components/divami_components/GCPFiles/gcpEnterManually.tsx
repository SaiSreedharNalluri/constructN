import React, { useEffect, useState } from "react";
import { useUploaderContext } from "../../../state/uploaderState/context";
import { Label, TabelHeading } from "./GCPStyledComponents";
import { getInitialGCPList } from "../../../utils/utils";
import { GCPType, IGCP } from "../../../models/IGCP";
import { location, utmLocation } from "../../../models/IRawImages";

const GcpEnterManually: React.FC<any> = () => {
  const { state: uploaderState, uploaderContextAction } = useUploaderContext();
  const { uploaderAction } = uploaderContextAction;
  
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
        </tr>
      </thead>
      <tbody>
        {data.map((item: any, index: any) => (
          <tr key={index}>
            <td>
              <Label>{`Point ${index + 1}`}</Label>
            </td>
            {headings.map((heading: any, subIndex: any) => (
              <td key={subIndex}>
                <input
                  type="text"
                  placeholder={heading.toLowerCase()}
                  className="mt-1 ml-1 border border-solid border-black"
                  value={
                    item[heading.toLowerCase()] ||
                    (heading === "Longitude" && item.coordinates[0]) ||
                    (heading === "Latitude" && item.coordinates[1]) ||
                    (heading === "Altitude" && item.elevation) ||
                    ""
                  }
                />
              </td>
            ))}
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
