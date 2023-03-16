import { ChildrenEntity } from "../../../models/IStructure";

export interface RenderTree {
  _id: string;
  name: string;
  children?: RenderTree[];
  isSelected: boolean;
}

export interface SelectLayerContainerProps {
  openselectlayer?: boolean;
}

export interface SelectLayerProps {
  title: string;
  openSelectLayer?: boolean;
  onCloseHandler: () => void;
  treeData: any[];
  getStructureData?: (structure: ChildrenEntity) => void;
  handleSearch: any;
  handleNodeSelection?: any;
  selectedNodes?: any;
  handleNodeExpand?: any;
  expandedNodes?: any;
}

export interface ProjectHierarchyProps extends SelectLayerProps {
  setHierarchy: any;
  updateBreadcrumbData?: any;
}
