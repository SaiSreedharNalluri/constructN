export default function PointTool(viewer,_zoomOutLimit) {

    const av = Autodesk.Viewing;
    av.ToolInterface.call(this);
    this.names = ['mobileTool'];
    this.viewer = viewer;
    this.handleSingleTap = function(ev) {
        const doc = document.getElementById(viewer.canvasId)
        const rect = doc.getBoundingClientRect();
        const result = this.viewer.clientToWorld(ev.clientX - rect.left, ev.clientY - rect.top);
        if (result) {
          const state = this.viewer.getState({ viewport: true }).viewport;
          if ( 3 < state.eye[2] && state.eye[2] > 6)
          {
            let position = {x: result.point.x, y:result.point.y, z:3}
            this.viewer.navigation.setPosition(position);
            this.viewer.navigation.setTarget(result.point);
          }
         
        }
    };
}