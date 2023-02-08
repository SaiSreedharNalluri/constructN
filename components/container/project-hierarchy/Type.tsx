import { ChildrenEntity } from "../../../models/IStructure";

export interface RenderTree {
  _id: string;
  name: string;
  children?: RenderTree[];
  isSelected: boolean;
}

export interface SelectLayerContainerProps {
  openSelectLayer: boolean;
}

export interface SelectLayerProps {
  title: string;
  openSelectLayer: boolean;
  onCloseHandler: () => void;
  treeData: any[];
  getStructureData?: (structure: ChildrenEntity) => void;
}
