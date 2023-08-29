import { useState } from "react";


const Index: React.FC<any> = () => {
  const breadCrumbsData = [{ name: "Manage Users" }];
  const [isFullScreen, setIsFullScreen] = useState(false);

  return (
    <div className=" w-full  h-full">
     <h1>Test Events</h1>
     <button onClick={(e)=>{
      console.log("... clicked");
      window.dispatchEvent(new CustomEvent('notifyApp',{detail:{action:{type:'getGenData',data:'BIM'}}}));
      let y = window.document.getElementById('f2') as HTMLIFrameElement ;
      y.contentWindow?.dispatchEvent(new CustomEvent('notifyApp',{detail:{action:{type:'getGenData',data:'BIM'}}}));
      let x = window.document.getElementById('f1') as HTMLIFrameElement ;
      x.contentWindow?.dispatchEvent(new CustomEvent('notifyApp',{detail:{action:{type:'getGenData',data:'BIM'}}}));
      //window.document.getElementById('f1')?.dispatchEvent(new CustomEvent('notifyApp',{detail:{action:{type:'getGenData',data:'BIM'}}}));
     // window?.document?.getElementById('f2').dispatchEvent(new CustomEvent('notifyApp',{detail:{action:{type:'getGenData',data:'BIM'}}}));
     }}>LoadViewer</button>
     <iframe id="f1" className="iframe w-full h-145"  src ="https://staging.app.constructn.ai/projects/PRJ201897/structure/STR996375"></iframe>
     <iframe  id="f2" className="w-full h-145"  src ="http://localhost:3000/projects/PRJ201897/structure/STR996375"></iframe>
        
    </div>
  );
};
export default Index;
