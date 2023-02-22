
const av = Autodesk.Viewing;

export default function PointTool(extension) {

    av.ToolInterface.call(this);
    this.names = ['pointTool'];
    this.extension = extension;
    this.viewer = extension.viewer;

    this.handleSingleClick = function(event, button) {
        console.log(`Inside Tool handleSingleClick: `)
        // Process only primary button
        if (button !== 0)
            return false;

        var canvasX = event.canvasX;
        var canvasY = event.canvasY;
        console.log(`canvas points: X: ${canvasX} Y: ${canvasY}`)
        var res = this.viewer.clientToWorld(canvasX, canvasY, true, true);
        console.log(`Client to world: X: ${res.point.x} Y: ${res.point.y}`)
        
        if (!res)
            return false;

        // this.extension.pushPoint(res);
        return true;
    };

    this.activate = function(name, viewerApi) {
        console.log(`Inside Tool activate: `)
        this.viewer.impl.pauseHighlight(true);
        this.viewer.clearSelection();
    };

    this.deactivate = function() {
        console.log(`Inside Tool deActivate: `)
        this.viewer.impl.pauseHighlight(false);
    };

    this.destroy = function() {
        this.viewer = null;
    };

}