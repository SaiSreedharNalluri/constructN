import React, { useEffect, useState } from "react";
import { Label, TabelHeading } from "./GCPStyledComponents";
import GcpManualFile from "./gcpManualFile";
import { useUploaderContext } from "../../../state/uploaderState/context";
import { getInitialGCPList } from "../../../utils/utils";

interface Iprops {
  selectOption: string;
}

const GcpEnterManually: React.FC<Iprops> = ({ selectOption }) => {
  const { state: uploaderState } = useUploaderContext();
 
  const initialRows = uploaderState.extractedFileValue.map((item: any, index: any) => ({
    value1: `Point ${index + 1}`,
    value2: item[0] || "",
    value3: item[1] || "",
    value4: item[2] || "",
  }));

  const [rows, setRows] = useState(initialRows);

  const addRow = () => {
    setRows([...rows, { value1: "", value2: "", value3: "", value4: "" }]);
  };

  useEffect(() => {
    const updatedRows = uploaderState.extractedFileValue.map((item: any, index: any) => ({
      value1: item[0] || "",
      value2: item[1] || "",
      value3: item[2] || "",
      value4: selectOption === "UTM" ? item[3] || "" : "",
    }));

    setRows(updatedRows);
  }, [uploaderState.extractedFileValue, selectOption]);

  const isUtm = selectOption === "UTM";

  return (
    <div style={{ margin: "0 0 0 60px", marginTop: "8px" }}>
      <div style={{ maxHeight: "130px", maxWidth: isUtm ? "750px" : "700px", overflowY: "auto" }}>
        <table className="">
          <thead className="sticky top-0 bg-white">
            <tr>
              <th></th>
              <th>
                <TabelHeading>{isUtm ? "Zone Identifier" : "Latitude"}</TabelHeading>
              </th>
              <th>
                <TabelHeading>{isUtm ? "Easting" : "Longitude"}</TabelHeading>
              </th>
              <th>
                <TabelHeading>{isUtm ? "Northing" : "Altitude"}</TabelHeading>
              </th>
              {isUtm && <th><TabelHeading>Elevation</TabelHeading></th>}
            </tr>
          </thead>
          <tbody>
          {rows?.length > 0 ? (
  rows.map((row: any, index: any) => (
    <tr key={index}>
      <td>
        <Label>{`Point ${index + 1}`}</Label>
      </td>
      <td>
        <input
          type="text"
          placeholder={isUtm ? "Zone Identifier" : "Latitude"}
          className="mt-1 ml-1 border border-solid border-black"
          value={row.value1}
          onChange={(e) => {
            const updatedRows = [...rows];
            updatedRows[index].value1 = e.target.value;
            setRows(updatedRows);
          }}
        />
      </td>
      <td>
        <input
          type="text"
          placeholder={isUtm ? "Easting" : "Longitude"}
          className="mt-1 ml-1 border border-solid border-black"
          value={row.value2}
          onChange={(e) => {
            const updatedRows = [...rows];
            updatedRows[index].value2 = e.target.value;
            setRows(updatedRows);
          }}
        />
      </td>
      <td>
        <input
          type="text"
          placeholder={isUtm ? "Northing" : "Altitude"}
          className="mt-1 ml-1 border border-solid border-black"
          value={row.value3}
          onChange={(e) => {
            const updatedRows = [...rows];
            updatedRows[index].value3 = e.target.value;
            setRows(updatedRows);
          }}
        />
      </td>
      {isUtm && (
        <td>
          <input
            type="text"
            placeholder="Elevation"
            className="mt-1 ml-1 border border-solid border-black"
            value={row.value4}
            onChange={(e) => {
              const updatedRows = [...rows];
              updatedRows[index].value4 = e.target.value;
              setRows(updatedRows);
            }}
          />
        </td>
      )}
    </tr>
  ))
) : (
  Array.from({ length: 4 }).map((_, Index) => (
    <tr key={Index}>
      <td>
        <Label>{`Point ${Index + 1}`}</Label>
      </td>
      <td>
        <input
          type="text"
          placeholder={isUtm ? "Zone Identifier" : "Latitude"}
          className="mt-1 ml-1 border border-solid border-black"
          value={rows.value1} 
          onChange={(e) => {
            const updatedRows = [...rows];
            updatedRows[Index].value1 = e.target.value; 
            setRows(updatedRows);
          }}
        />
      </td>
      <td>
          <input
            type="text"
            placeholder={isUtm ? "Easting" : "Longitude"}
            className="mt-1 ml-1 border border-solid border-black"
            value={rows.value2}
             onChange={(e) => {
            const updatedRows = [...rows];
            updatedRows[Index].value2 = e.target.value;
            setRows(updatedRows);
          }}
              
          />
        </td>
        <td>
          <input
            type="text"
            placeholder={isUtm ? "Northing" : "Altitude"}
            className="mt-1 ml-1 border border-solid border-black"
            value={rows.value3}
            onChange={(e) => {
            const updatedRows = [...rows];
            updatedRows[Index].value3 = e.target.value;
            setRows(updatedRows);
          }}
          />
        </td>
        {isUtm && (
        <td>
          <input
            type="text"
            placeholder="Elevation"
            className="mt-1 ml-1 border border-solid border-black"
            value={rows.value4}
            onChange={(e) => {
              const updatedRows = [...rows];
              updatedRows[Index].value4 = e.target.value;
              setRows(updatedRows);
            }}
          />
        </td>
      )}
    </tr>
  ))
)}

          </tbody>
        </table>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <p style={{ margin: '0 0 0 60px', fontSize: 'small', fontStyle: 'italic' }}>At least 4 GCPs needed</p>
        <button onClick={addRow}>
          <span className="plus-symbol" style={{ margin: '0 0 0 170px', color: '#F1742E', fontStyle: 'italic' }}>+ Add</span>
        </button>
      </div>
      <hr></hr>
      <GcpManualFile />
    </div>
  );
};

export default GcpEnterManually;
