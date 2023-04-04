import React, { useState } from "react";
// import { createGlobalStyle } from "styled-components";
import { Link } from "react-router-dom";
import { createPdfFromHtml } from "./DownloadComp";

// const Global = createGlobalStyle`
//   /* paper.css */
//   https://github.com/cognitom/paper-css

//   /* @page { margin: 0 } */
//   #print {
//     margin: 0;
//     font-family: "IPAexGothic", sans-serif;
//   }
//   .sheet {
//     margin: 0;
//     overflow: hidden;
//     position: relative;
//     box-sizing: border-box;
//     page-break-after: always;
//   }

//   /** Paper sizes **/
//   #print.A3               .sheet { width: 297mm; height: 419mm }
//   #print.A3.landscape     .sheet { width: 420mm; height: 296mm }
//   #print.A4               .sheet { width: 210mm; height: 296mm }
//   #print.A4.landscape     .sheet { width: 297mm; height: 209mm }
//   #print.A5               .sheet { width: 148mm; height: 209mm }
//   #print.A5.landscape     .sheet { width: 210mm; height: 147mm }
//   #print.letter           .sheet { width: 216mm; height: 279mm }
//   #print.letter.landscape .sheet { width: 280mm; height: 215mm }
//   #print.legal            .sheet { width: 216mm; height: 356mm }
//   #print.legal.landscape  .sheet { width: 357mm; height: 215mm }

//   /** Padding area **/
//   .sheet.padding-10mm { padding: 10mm }
//   .sheet.padding-15mm { padding: 15mm }
//   .sheet.padding-20mm { padding: 20mm }
//   .sheet.padding-25mm { padding: 25mm }

//   /** For screen preview **/
//   @media screen {
//     body {
//       background: #E0E0E0;
//       height: 100%;
//     }
//     .sheet {
//       background: #FFFFFF;
//       /* margin: 5mm auto; */
//       padding: 5mm 0;
//     }
//   }

//   /** Fix for Chrome issue #273306 **/
//   @media print {
//     #print.A3.landscape            { width: 420mm }
//     #print.A3, #print.A4.landscape { width: 297mm }
//     #print.A4, #print.A5.landscape { width: 210mm }
//     #print.A5                      { width: 148mm }
//     #print.letter, #print.legal    { width: 216mm }
//     #print.letter.landscape        { width: 280mm }
//     #print.legal.landscape         { width: 357mm }
//   }
// `;

const list = [
  {
    id: 1,
  },
  {
    id: 2,
  },
  {
    id: 3,
  },
  {
    id: 4,
  },
  {
    id: 5,
  },
  {
    id: 6,
  },
  {
    id: 7,
  },
  {
    id: 8,
  },
  {
    id: 9,
  },
  {
    id: 10,
  },
  {
    id: 11,
  },
  {
    id: 12,
  },
];

var externalDataRetrievedFromServer = [
  { name: "Bartek", age: 34 },
  { name: "John", age: 27 },
  { name: "Elizabeth", age: 30 },
];

const buildTableBody = (data, columns) => {
  var body = [];

  body.push(columns);

  data.forEach(function (row) {
    var dataRow = [];

    columns.forEach(function (column) {
      dataRow.push(row[column].toString());
    });

    body.push(dataRow);
  });

  return body;
};

const tablegen = (data, columns) => {
  return {
    table: {
      headerRows: 1,
      body: buildTableBody(data, columns),
    },
  };
};

export const PrintPage = () => {
  const [printContent, setPrintContent] = useState();
  const handleClick = () => {
    createPdfFromHtml(
      printContent,
      tablegen(externalDataRetrievedFromServer, ["name", "age"])
    );
  };
  return (
    <>
      {/* <Global /> */}
      <button onClick={handleClick}>print</button>
      <div id="print" className="A4">
        <Sheet />
        <div>
          <div
            ref={(el: any) => {
              // printContent = el;
              setPrintContent(el);
            }}
          >
            <Sheet />
          </div>
        </div>
      </div>
    </>
  );
};

const Sheet = () => {
  return (
    <div style={{ height: "400px", overflow: "auto" }}>
      {/* {
      tablegen(externalDataRetrievedFromServer, ["name", "age"])
        
      } */}
      {/* {list.map((each) => {
        return <div style={{ width: "100px", height: "100px" }}>{each.id}</div>;
      })} */}
    </div>
  );
};
