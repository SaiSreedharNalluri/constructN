import React, { useEffect, useState } from "react";
import { useUploaderContext } from "../../../state/uploaderState/context";
import { Label, TabelHeading } from "./GCPStyledComponents";
import { getInitialGCPList } from "../../../utils/utils";
import { GCPType, IGCP } from "../../../models/IGCP";
import { location, utmLocation } from "../../../models/IRawImages";
import Delete from "../../../public/divami_icons/delete.svg";
import Image from "next/image";

const GcpEnterManually: React.FC<any> = () => {
  const { state: uploaderState, uploaderContextAction } = useUploaderContext();
  const { uploaderAction } = uploaderContextAction;
  const [errorMessages, setErrorMessages] = useState<{ [key: string]: string }>({});

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
    if (uploaderState.gcpType === GCPType.UTM && gcpList.utmLocation) {
      const headingMappings: { [key: string]: string } = {
        easting: "Easting",
        northing: "Northing",
        zone: "Zone",
        elevation: "Elevation",
      };
      gcpList?.utmLocation.forEach(
        (item: utmLocation, index: number) => {
          console.log("checking initial item", item);
          Object.keys(item).forEach((rawHeading: string) => {
            const heading: any = headingMappings[rawHeading] || rawHeading;
            const value: any =
              heading === "Northing"
                ? item.northing
                : heading === "Easting"
                ? item.easting
                : heading === "Zone"
                ? item.zone
                : heading === "Elevation"
                ? item.elevation
                : undefined;
            console.log("Extracted value:", value, heading);
            const isValid = validateInput(value, heading, index);
            const identifier = `${index}-${heading}`;
            
            updateErrorMessages(identifier, isValid);
          });
        }
      );
    } else if (uploaderState.gcpType === GCPType.LONGLAT && gcpList.location) {
      gcpList.location.forEach(
        (item: location, index: number) => {
          Object.keys(item).forEach((rawHeading: string) => {
            const { coordinates, elevation } = item;
  const isValidLongitude = validateInput(coordinates[0], "Longitude", index);
  const isValidLatitude = validateInput(coordinates[1], "Latitude", index);
  const isValidAltitude = validateInput(elevation !== undefined ? elevation : 0, "Altitude", index);

  const identifierLongitude = `${index}-Longitude`;
  const identifierLatitude = `${index}-Latitude`;
  const identifierAltitude = `${index}-Altitude`;

  updateErrorMessages(identifierLongitude, isValidLongitude);
  updateErrorMessages(identifierLatitude, isValidLatitude);
  updateErrorMessages(identifierAltitude, isValidAltitude);});
        }
      );
    }
    
  };
  const handleDeleteRow = (index: number) => {
    const updatedGCPList =
      uploaderState.gcpType === GCPType.UTM
        ? [...(uploaderState.gcpList.utmLocation as utmLocation[])]
        : [...(uploaderState.gcpList.location as location[])];

        const deletedItemErrors = Object.keys(errorMessages).filter(
          (key) => key.startsWith(`${index}-`)
        );
      let errorsToReduce = 0;
      console.log('deletedItemErrors',deletedItemErrors)
      deletedItemErrors.forEach((key) => {
          if (errorMessages[key]) {
            errorsToReduce += 1;
          }
        });
      const newErrorCount = uploaderState.errorCount - errorsToReduce;
        uploaderAction.setErrorCount(newErrorCount);

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

  
 
  const updateErrorMessages = (identifier: string, isValid: boolean) => {
    setErrorMessages((prevErrors) => {
      const newErrors = {
        ...prevErrors,
        [identifier]: isValid ? "" : `${identifier} is invalid`,
      };

      // Update error count
      const newErrorCount = Object.values(newErrors).filter((error) => error !== "").length;
      console.log("gcp error",newErrorCount);
      uploaderAction.setErrorCount(newErrorCount);

      return newErrors;
    });
  };
  const validateLatitude = (latitude: number, index: any) => {
    return latitude >= -90 && latitude <= 90 && latitude !== 0;
  };
  const validateLongitude = (longitude: number, Index: any) => {
    return longitude >= -180 && longitude <= 180 && longitude !== 0;
  };
  const validateAltitude = (altitude: number, Index: any) => {
    return altitude !== 0 && Number(altitude) > 0;
  };
  const validateEasting = (easting: number, Index: any) => {
    return easting >= 100000 && easting <= 1000000 && Number(easting) > 0;
  };
  const validatingNorthing = (northing: number, Index: any) => {
    return northing >= 0 && northing <= 10000000 && Number(northing) > 0;
  };
  const validateInput = (
    value: number | string,
    heading: string,
    index: any
  ) => {
    switch (heading) {
      case "Latitude":
        return validateLatitude(Number(value), index);
      case "Longitude":
        return validateLongitude(Number(value), index);
      case "Altitude":
        return validateAltitude(Number(value), index);
      case "Easting":
        return validateEasting(Number(value), index);
      case "Northing":
        return validatingNorthing(Number(value), index);
      case "Zone":
        return typeof value === "string" && value.trim() !== "";
      case "Elevation":
        return Number(value) > 0;
      default:
       const isValid = true; // Modify this line based on your validation logic
        if (!isValid) {
          const errorCountReduced = uploaderState.errorCount - 1;
          uploaderAction.setErrorCount(errorCountReduced);
        }
        return isValid;
    
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    heading: string
  ) => {
    const value = e.target.value;
    const identifier = `${index}-${heading}`;
    const updatedGCPList =
      uploaderState.gcpType === GCPType.UTM
        ? [...(uploaderState.gcpList.utmLocation as utmLocation[])]
        : [...(uploaderState.gcpList.location as location[])];
    const selectedItem: any = updatedGCPList[index];

    if (uploaderState.gcpType === GCPType.UTM) {
      if (heading === "Zone") {
        (selectedItem as utmLocation).zone = value;
      } else {
        (selectedItem as any)[heading.toLowerCase() as keyof utmLocation] =
          Number(value);
      }
    } else {
      if (heading === "Longitude") {
        const parsedValue = value;
        (selectedItem as location).coordinates[0] = Number(parsedValue);
      } else if (heading === "Latitude") {
        const parsedValue = value;
        (selectedItem as location).coordinates[1] = Number(parsedValue);
      } else if (heading === "Altitude") {
        const parsedValue = value;
        (selectedItem as location).elevation = Number(parsedValue);
      } else {
        (selectedItem as any)[heading.toLowerCase() as keyof location] = value;
      }
    }
    const isValid = validateInput(e.target.value, heading, index);
    updateErrorMessages(identifier, isValid);

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
  useEffect(() => {
    console.log('checking useeffect');
    validateInitialValues();
  }, []);
  const validateInitialValues = () => {
    console.log("checking validateinitialvalues");
    if (uploaderState.gcpType === GCPType.UTM && uploaderState.gcpList.utmLocation)
     {
      const headingMappings: { [key: string]: string } = {
        easting: "Easting",
        northing: "Northing",
        zone: "Zone",
        elevation: "Elevation",
      };
      uploaderState?.gcpList?.utmLocation.forEach(
        (item: utmLocation, index: number) => {
          console.log("checking initial item", item);
          Object.keys(item).forEach((rawHeading: string) => {
            const heading: any = headingMappings[rawHeading] || rawHeading;
            const value: any =
              heading === "Northing"
                ? item.northing
                : heading === "Easting"
                ? item.easting
                : heading === "Zone"
                ? item.zone
                : heading === "Elevation"
                ? item.elevation
                : undefined;
            console.log("Extracted value:", value, heading);
            const isValid = validateInput(value, heading, index);
            const identifier = `${index}-${heading}`;
            
            updateErrorMessages(identifier, isValid);
          });
        }
      );
    } else if ( uploaderState.gcpType === GCPType.LONGLAT && uploaderState.gcpList.location) 
    {
      const headingMappings: { [key: string]: string } = {
        "coordinates[0]": "Longitude",
        "coordinates[1]": "Latitude",
        elevation: "Altitude",
      };

      uploaderState.gcpList.location.forEach(
        (item: location, index: number) => {
          Object.keys(item).forEach((rawHeading: string) => {
            const { coordinates, elevation } = item;
  const isValidLongitude = validateInput(coordinates[0], "Longitude", index);
  const isValidLatitude = validateInput(coordinates[1], "Latitude", index);
  const isValidAltitude = validateInput(elevation !== undefined ? elevation : 0, "Altitude", index);

  const identifierLongitude = `${index}-Longitude`;
  const identifierLatitude = `${index}-Latitude`;
  const identifierAltitude = `${index}-Altitude`;

  updateErrorMessages(identifierLongitude, isValidLongitude);
  updateErrorMessages(identifierLatitude, isValidLatitude);
  updateErrorMessages(identifierAltitude, isValidAltitude);});
        }
      );
    }
  };

  const renderTable = (data: any, headings: any) => (
    <div>
      <table>
        <thead className=" sticky top-0 bg-white ">
          <tr>
            <th></th>
            {headings.map((heading: any, index: any) => (
              <th key={index}>
                <TabelHeading>{heading}</TabelHeading>
              </th>
            ))}
            <th>
              <TabelHeading>Delete</TabelHeading>
            </th>
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
                  <div>
                    <input
                      id={`${subIndex}`}
                      type={heading === "Zone" ? "text" : "number"}
                      placeholder={heading.toLowerCase()}
                      className={`mt-1 ml-2 border ${
                        !validateInput(
                          item[heading.toLowerCase()] ||
                            (heading === "Longitude" && item.coordinates[0]) ||
                            (heading === "Latitude" && item.coordinates[1]) ||
                            (heading === "Altitude" && item.elevation),
                          heading,
                          index
                        )
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
                    {errorMessages[`${heading}`] && (
                      <div className="text-red-500 text-xs mt-1">
                        {errorMessages[`${index}-${heading}`]}
                      </div>
                    )}
                  </div>
                </td>
              ))}
              <td>
                <button onClick={() => handleDeleteRow(index)}>
                  <Image src={Delete} alt="" className="mt-[3px] ml-[10px]" />
                </button>
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
        <div className="mr-[50px]">
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
          style={{
            maxHeight: "150px",
            width: "fit-content",
            overflowY: "auto",
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

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "33.3%",
          }}
        >
          <p style={{ fontSize: "small", fontStyle: "italic" }}>
            At least 4 GCPs needed
          </p>
          <p style={{ fontSize: "small", fontStyle: "italic" }}>
            {uploaderState.errorCount}{" "}
            {uploaderState.errorCount === 1 ? "error" : "errors"} found
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
        <hr className="mt-[10px]" />
      </div>
    </div>
  );
};

export default GcpEnterManually;
