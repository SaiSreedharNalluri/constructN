//import { useRouter } from "next/router";
import { NextRouter } from "next/router";
import { MqttConnector } from "../../utils/MqttConnector";
import { IStructure } from "../../models/IStructure";
interface IProps {
  structureData:IStructure
}
const Iframe:React.FC<IProps>=({structureData}) =>{
  
    return(
      structureData ?(
      <div>
        <iframe className="calc-w60 calc-h ml-[59px]"
            src={`http://localhost:3001/projects/${structureData.project}/structure/${structureData._id}/web?topicKey=${MqttConnector.topicHash}`}
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