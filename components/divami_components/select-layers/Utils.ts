import type { RenderTree } from "./Type";

export const getSelectedLayers = (
  data: RenderTree[],
  itemsChecked: string[] = []
) => {
  for (let i = 0; i < data.length; i++) {
    if (data?.length && data[i].isSelected) {
      itemsChecked.push(data[i].name);
    }
    if (data?.length && data[i].children) {
      getSelectedLayers(data[i].children, itemsChecked);
    }
  }
  return itemsChecked;
};

export const handleSelection = (data: RenderTree[], id: string) => {
  for (let i = 0; i < data.length; i++) {
    if (data[i].id === id && data[i]) {
      data[i].isSelected = !data[i].isSelected;
      return data;
    }
    if (data[i].children) {
      data[i].children = handleSelection(data[i].children, id);
    }
  }
  return data;
};
