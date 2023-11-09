import React, { useState } from "react";
import { useUploaderContext } from "../../../state/uploaderState/context";
import { Label, TabelHeading } from "./GCPStyledComponents";
import { getInitialGCPList } from "../../../utils/utils";

interface Iprops {
  selectOption: string;
}

const GcpEnterManually: React.FC<Iprops> = ({selectOption}) => {
  const { state: uploaderState } = useUploaderContext();
  const utmLocation:any = uploaderState?.gcpList?.utmLocation;
  const location = uploaderState?.gcpList?.location;

  const getData = () => {
    if (utmLocation) {
      return utmLocation;
    } else if (location) {
      return location;
    } else {
      
      return getInitialGCPList(selectOption==="UTM");
    }
  };

  
  const data = getData();
  const renderTable = (data:any, headings:any) => (
    <table>
      <thead>
        <tr>
          <th></th>
          {headings.map((heading:any, index:any) => (
            <th key={index}>
              <TabelHeading>{heading}</TabelHeading>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item:any, index:any) => (
          <tr key={index}>
            <td><Label>{`Point ${index + 1}`}</Label></td>
            {headings.map((heading:any, subIndex:any) => (
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
  );

  return (
    <div style={{ margin: "0 0 0 60px", marginTop: "8px" }}>
      <div style={{ maxHeight: "130px", maxWidth: "750px", overflowY: "auto" }}>
        {utmLocation && renderTable(utmLocation, ["Easting", "Northing", "Zone", "Elevation"])}
        {location && renderTable(location, ["Longitude", "Latitude", "Elevation"])}
      </div>
      
      <div style={{ display: "flex", alignItems: "center" }}>
        <p style={{ margin: '0 0 0 60px', fontSize: 'small', fontStyle: 'italic' }}>At least 4 GCPs needed</p>
        <button>
          <span className="plus-symbol" style={{ margin: '0 0 0 170px', color: '#F1742E', fontStyle: 'italic' }}>+ Add</span>
        </button>
      </div>
      <hr />
    </div>
  );
};

export default GcpEnterManually;
