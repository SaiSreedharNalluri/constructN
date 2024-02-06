//import { useRouter } from "next/router";
import { NextRouter } from "next/router";
import { MqttConnector } from "../../utils/MqttConnector";
import { IStructure } from "../../models/IStructure";
import { MULTIVERSE } from "../../config/config";
interface IProps {
  isFullScreen:boolean
}
const Iframe:React.FC<IProps>=({
  isFullScreen
}) =>{
  
    return(
      MqttConnector.topicHash ?(
      <div>
        <iframe className={` ${isFullScreen?"h-screen w-screen":"calc-h calc-w60 ml-[59px]"} `}
        //src={`https://qa.multiverse.constructn.ai/web?topicKey=${MqttConnector.topicHash}`}
        src={`${MULTIVERSE.ORIGIN_URL}/web?topicKey=${MqttConnector.topicHash}`}
        //src={`https://qa.multiverse.constructn.ai/projects/${structureData.project}/structure/${structureData._id}/web?topicKey=${MqttConnector.topicHash}`}
            //src={`http://localhost:3001/projects/${structureData.project}/structure/${structureData._id}/web?topicKey=${MqttConnector.topicHash}`}
            // src={"http://localhost:3001/projects/PRJ201897/structure/STR996375"}
              // width={1120}
              // height={470}
              title="Snapshot iframe"
              // style={{height:"calc-h"}}
              
            />
    

            </div>
      ):(<></>)
    )

}

export default Iframe;