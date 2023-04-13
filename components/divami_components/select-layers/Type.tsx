import { ShowImageDisplay } from "../toolbar/Layers";

export interface RenderTree {
  id: string;
  name: string;
  children?: RenderTree[];
  isSelected: boolean;
}

export interface SelectLayerContainerProps {
  openSelectLayer: boolean;
}

export interface SelectLayerProps {
  title: string;
  openselectlayer: boolean;
  onCloseHandler: () => void;
  optionsList: any;
  onSelect: any;
  selectedLayersList?: string[];
  setActiveRealityMap?: any;
  layersUpdated?: boolean;

  showImageDisplay?: ShowImageDisplay;
}
