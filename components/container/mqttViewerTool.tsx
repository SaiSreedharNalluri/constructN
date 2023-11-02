import React, { useEffect, useState } from "react";
import { styled } from "@mui/system";
import { useRouter } from "next/router";
import { MqttConnector } from "../../utils/MqttConnector";




interface IProps {


}
export const LeftOverLay: React.FC<IProps> = ({
 
}) => {
  let router = useRouter();
  const [selector, setSelector] = useState("");
  const [conn,setConn]=useState<MqttConnector>(MqttConnector.getConnection())
  //let conn:MqttConnector;



  return (
    <React.Fragment>
      

      <div
        style={{
          overflow: "hidden",
          height: "100%",
          width: "100%",
        }}
      >
        {
          
          <ul className="">
          <li><u><b className="text-lg">Command List</b></u></li>
          <li onClick={(e:any)=>{conn?.publishMessage("abc", '{"type":"getGenData","data":"Plan Drawings"}')}}>LoadGen Viewer</li>
          <li onClick={(e:any)=>{conn?.publishMessage("abc", '{"type":"setViewType","data":"Plan Drawings"}')}}>setViewType Plan Drawings</li>
          <li onClick={(e:any)=>{conn?.publishMessage("abc", '{"type":"setViewType","data":"BIM"}')}}>setViewType BIM</li>
          <li onClick={(e:any)=>{conn?.publishMessage("abc", '{"type":"setViewType","data":"pointCloud"}')}}>setViewType Reality</li>
          <li onClick={(e:any)=>{conn?.publishMessage("abc", '{"type":"setViewType","data":"orthoPhoto"}')}}>setViewType Map</li>
          <li><button onClick={(e:any)=>{conn?.publishMessage("abc", '{"type":"showIssue","data":" "}')}}>Show Issue</button>/ <button onClick={(e:any)=>{conn?.publishMessage("abc", '{"type":"hideIssue","data":" "}')}}>Hide Issue</button></li>
          <li><button onClick={(e:any)=>{conn?.publishMessage("abc", '{"type":"showTask","data":" "}')}}>Show Task</button>/ <button onClick={(e:any)=>{conn?.publishMessage("abc", '{"type":"hideTask","data":" "}')}}>Hide Task</button></li>
          <li><button onClick={(e:any)=>{conn?.publishMessage("abc", '{"type":"setCompareMode","data":"noCompare"}')}}>No CMP</button>/ <button onClick={(e:any)=>{conn?.publishMessage("abc", '{"type":"setCompareMode","data":"compareDesign"}')}}>CMP Des</button>/ <button onClick={(e:any)=>{conn?.publishMessage("abc", '{"type":"setCompareMode","data":"compareReality"}')}}>CMP Real</button></li>
          
          </ul>
        }
      </div>
    </React.Fragment>
  );
};
export const LeftOverLayContainer = styled("div")(({  }: any) => ({
  marginLeft: "0px",
  zIndex: "99",
}));


export const OpenMenuButton = styled("div")(({ onClick }: any) => ({
  position: "fixed",
  border: "1px solid #C4C4C4",
  height: "32px",
  width: "130px",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-evenly",
  alignItems: "center",
  transform: "rotate(0deg)",
  left:  "0px",
  bottom: "10px",
  cursor: "pointer",
  zIndex: "99",
  background: "#ffffff",
  fontFamily: "Open Sans",
  "&:hover": {
    background: "#EEEEEE",
  },
})) as any;

export const CloseMenuButton = styled("div")(({  }: any) => ({
  height: "38px",
  width: "30px",
  // border: "1px solid #BDBDBD",
  position: "fixed",
  bottom: "0",
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
  zIndex: "99",
  backgroundColor: "#fffff !important",
  background: "rgb(255, 255, 255)",
  border: "1px solid rgb(189, 189, 189)",
  boxShadow: "rgb(200 200 200 / 10%) 5px 4px 8px",
  transform: "matrix(-1, 0, 0, 1, 0, 0)",
  marginLeft:  "0px" ,
})) as any;
