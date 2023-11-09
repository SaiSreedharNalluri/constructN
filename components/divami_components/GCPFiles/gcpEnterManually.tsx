import React, { useEffect, useState } from "react";
import { useUploaderContext } from "../../../state/uploaderState/context";
import { Label, TabelHeading } from "./GCPStyledComponents";
import { getInitialGCPList } from "../../../utils/utils";

const GcpEnterManually: React.FC<any> = () => {
  const { state: uploaderState, uploaderContextAction } = useUploaderContext();
  const [locationType, setlocationType] = useState("LatLng");
  const { uploaderAction } = uploaderContextAction;
  const utmLocation = uploaderState?.gcpList?.utmLocation;
  const location = uploaderState?.gcpList?.location;
  const handleLocationTypeChange = (event: any) => {
    setlocationType(event.target.value);
  };
  useEffect(() => {
    if (uploaderState.gcpList) {
      if (
        uploaderState.gcpList.utmLocation &&
        uploaderState.gcpList.utmLocation.length > 0
      ) {
        setlocationType("UTM");
      } else {
        setlocationType("LatLng");
      }
    }
  }, [uploaderState.gcpList]);
  useEffect(() => {
    const getGcpData = () => {
      if (!utmLocation && !location) {
        console.log("checking gcp", locationType);
        const initialGcp = getInitialGCPList(locationType === "UTM");

        // uploaderAction.setGCPList(initialGcp)
      }
    };

    getGcpData();
  }, [utmLocation, location, locationType]);
  const addRow = () => {
    const newGcp: any = {
      Easting: 0,
      Northing: 0,
      Zone: 0,
      Elevation: 0,
    };

    const newLatLngGcp: any = {
      coordinates: [0, 0],
      type: "point",
      elevation: 0,
    };

    if (locationType === "UTM") {
      const updatedUtmLocation = [...(utmLocation || []), newGcp] as any;
      uploaderAction.setGCPList({ utmLocation: updatedUtmLocation });
    } else {
      const updatedLocation = [...(location || []), newLatLngGcp] as any;
      uploaderAction.setGCPList({ location: updatedLocation });
    }
  };
  const renderTable = (data: any, headings: any) => (
    <table>
      <thead>
        <tr>
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
                    (heading === "Zone Identifier" && item.zone)||
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
    <div>
      <div style={{ margin: "0 60px", width: "997px" }}>
        <div className="w-full grid grid-cols-2 gap-4">
          <div>
            <label>
              <input
                type="radio"
                name="secondOption"
                value="UTM"
                className="appearance-none h-2 w-2 border-8  rounded-full checked:bg-orange-500 checked:border-orange-500 focus:ring-2"
                checked={locationType === "UTM"}
                onChange={handleLocationTypeChange}
              />
              &nbsp; UTM
            </label>
          </div>
          <div>
            <label>
              <input
                type="radio"
                name="secondOption"
                value="LatLng"
                className="appearance-none h-2 w-2 border-8  rounded-full checked:bg-orange-500 checked:border-orange-500 focus:ring-2"
                checked={locationType === "LatLng"}
                onChange={handleLocationTypeChange}
              />
              &nbsp; LatLng
            </label>
          </div>
        </div>
      </div>
      <div style={{ margin: "0 0 0 60px", marginTop: "8px" }}>
        <div
          style={{ maxHeight: "130px", maxWidth: "750px", overflowY: "auto" }}
        >
          {utmLocation &&
            renderTable(utmLocation, [
              "Zone Identifier",
              "Easting",
              "Northing",
              "Elevation",
            ])}
          {location &&
            renderTable(location, ["Longitude", "Latitude", "Altitude"])}
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
