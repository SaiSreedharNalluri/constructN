import _ from "lodash";

export const downloadMenuOptions = [
  {
    label: "Download as CSV",
    icon: null,
    method: "csv",
  },
  {
    label: "Download as PDF",
    icon: null,
    method: "pdf",
  },
];

export const getDownladableList = (downloadList: any) => {
  // getIssues(currentStructure._id, true);
  const issL = downloadList;
  let myL = issL.map((iss: any) => {
    let x = _.omit(iss, "progress", "context");
    let g = _.update(x, "owner", (ass) => {
      return ass.firstName;
    });
    let y = _.update(g, "assignees", (ass) => {
      let n = ass?.length
        ? ass.map((o: { firstName: any }) => {
            return o.firstName;
          })
        : "";
      return n;
    });
    let z = _.update(y, "attachments", (att) => {
      let n = att?.length
        ? att.map((o: { name: any }) => {
            return o.name;
          })
        : "";
      let u = att?.length
        ? att.map((o: { url: any }) => {
            return o.url;
          })
        : "";
      if (n.length) return n + " : " + u;
      return "";
    });
    return z;
  });

  return myL;
};
