import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { useEffect } from "react";

export const DownloadTable = ({ data }: any) => {
  const convert = () => {
    var doc: any = new jsPDF();
    var col = ["Sr. No.", "Details"];
    var rows: any = [];

    /* The following array of object as response from the API req  */

    var itemNew = [
      { index: "1", id: "Case Number", name: "101111111" },
      { index: "2", id: "Patient Name", name: "UAT DR" },
      { index: "3", id: "Hospital Name", name: "Dr Abcd" },
    ];

    data.forEach((element: any) => {
      var temp = [element.priority, element.title];
      rows.push(temp);
    });

    doc.autoTable(col, rows);

    doc.save("Test.pdf");
  };

  return <div onClick={convert}>download json</div>;
};
