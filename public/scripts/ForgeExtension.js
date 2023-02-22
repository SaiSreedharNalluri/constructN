// import { PointTool } from './Tool';
import PointTool from './Tool.js';

function ConstructNTools(viewer, options) {
  Autodesk.Viewing.Extension.call(this, viewer, options);
}

ConstructNTools.prototype = Object.create(Autodesk.Viewing.Extension.prototype);
ConstructNTools.prototype.constructor = ConstructNTools;

ConstructNTools.prototype.load = function () {
  console.log("ConstructNTools is loaded!");
  this.tool = new PointTool(this);
  this.viewer.toolController.registerTool(this.tool);
  return true;
};

ConstructNTools.prototype.unload = function () {
  console.log("ConstructNTools is now unloaded!");

  this.deactivate();

  if (this.tool) {
    this.viewer.toolController.deregisterTool(this.tool);
    this.tool.destroy();
    this.tool = null;
  }
  return true;
};

ConstructNTools.prototype.activate = function () {
  if (!this.viewer.model) return false;
  if (this.isActive()) return true;

  this.viewer.toolController.activateTool(this.tool.getName());
  if (this.viewer.model.is3d()) {
    this.viewer.getExtension("Autodesk.ViewCubeUi", function (ext) {
      ext.showTriad(true);
    });
  }

  return true;
};

ConstructNTools.prototype.deactivate = function() {
  if (!this.isActive())
      return true;
  this.ui.deactivate();
  this.viewer.toolController.deactivateTool(this.tool.getName());
  if (this.viewer.model && this.viewer.model.is3d()) {
      this.viewer.getExtension('Autodesk.ViewCubeUi', function(ext) {
          ext.showTriad(false);
      });
  }
  return true;
}

ConstructNTools.prototype.isActive = function() {
  var toolActive = this.viewer.toolController.isToolActivated(this.tool.getName());
  return toolActive;
}

Autodesk.Viewing.theExtensionManager.registerExtension(
  "ConstructNTools",
  ConstructNTools
);
