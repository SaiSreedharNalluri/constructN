import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { useEffect } from "react";
import { renderToString } from "react-dom/server";

const styles = {
  fontFamily: "sans-serif",
  textAlign: "center",
};
const colstyle = {
  width: "30%",
};
const tableStyle = {
  width: "100%",
};

export const DownloadTable = ({ data, label, filename, onClick }: any) => {
  const convert = () => {
    console.log(data, "jkjko");
    var doc: any = new jsPDF();
    var col = data.length ? Object.keys(data[0]) : [];
    var rows: any = [];

    data.forEach((element: any) => {
      let temp: any = [];

      for (const property in element) {
        temp.push(element[property]);
      }
      console.log(temp, "temmp");
      rows.push(temp);
    });

    // styles: { overflow: 'linebreak', cellWidth: 'wrap', cellPadding: 1, fontSize: 6 },
    // columnStyles: { text: { cellWidth: 'auto' } }
    doc.autoTable(col, rows, {
      // startY: 100,
      margin: {
        right: 20,
        left: 20,
      },
      // tableWidth: 700,
      // overflowColumns: col,
      styles: {
        overflow: "linebreak",
        cellWidth: "wrap",
        cellPadding: 1,
        fontSize: 8,
      },
      columnStyles: { text: { cellWidth: "auto" } },
      // styles: {
      //   overflow: "linebreak",
      //   columnWidth: "wrap",
      //   // rowHeight: "wra",
      //   // lineWidth: 1,
      // },
      // columnStyles: {
      //   // 0: {
      //   //   columnWidth: 20,
      //   // },
      //   // 1: {
      //   //   columnWidth: 20,
      //   // },
      //   columnWidth: "wrap",
      // },
      // rowStyles: {
      //   0: { rowHeight: 150 },
      // },

      // rowHeight: "wra",
    });

    doc.save(filename);
    onClick();
  };

  return (
    <div>
      <div onClick={convert}>{label}</div>
    </div>
  );
};
