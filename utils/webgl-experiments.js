export default function webgl_experiments(){

}
export function getGLCanvas(ViewerId){
    let viewer_element=document.getElementById(ViewerId);
    console.log(viewer_element,"Here is the WEBGL viewer")
    if(viewer_element!==null)
switch(ViewerId){
    case 'potreeViewer_1':
    case 'potreeViewer_2':
        console.log("Found Canvas in Potree");
        return viewer_element.getElementsByTagName('canvas')[0];//.getContext("webgl");

    case 'forgeViewer_1':
    case 'forgeViewer_2':
        console.log("Found Canvas in Forge");
        return viewer_element.getElementsByTagName('canvas')[0]||HTMLCanvasElement;
    case 'mapboxViewer_1':
    case 'mapboxViewer_2':
        console.log("Found Canvas in Mapbox");
        return viewer_element.getElementsByTagName('canvas')[0]||HTMLCanvasElement;
    case 'minimapViewer':
        console.log("Found Canvas in Minimap");
        return viewer_element.getElementsByTagName('canvas')[0]||HTMLCanvasElement;
    default:
        console.log("Base Viewer Not Found");
        return viewer_element.getElementsByTagName('canvas')[0]||HTMLCanvasElement;

}

}