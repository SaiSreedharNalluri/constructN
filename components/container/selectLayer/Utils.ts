import type { RenderTree } from "./Type";

export const getTreeViewDataForLayers = (optionsList: any) => {
  // if (optionsList) {
  //   const treeViewData = Object.keys(optionsList).map((key, index) => {
  //     console.log(key, 'key', optionsList[key], 'optionsList[key]');
  //     return {
  //       id: key + index,
  //       name: key,
  //       isSelected: true,
  //     };
  //   });
  //   return treeViewData;
  // }
  let arr = [];
  let index = 0;

  for (const key in optionsList) {
    arr.push({
      id: `p${index}`,
      name: key,
      isSelected: optionsList[key]?.isSelected,
      children: [],
    });
    index = index + 1;
    if (
      optionsList[key].hasOwnProperty("children") &&
      optionsList[key]["children"]?.length
    ) {
      arr[arr.length - 1].children = optionsList[key].children.map(
        (each: any, childIndex: number) => {
          return {
            ...each,
            id: `p${index}ch${childIndex}`,
            name: each.name,
            isSelected: each.isSelected,
            children: [],
          };
        }
      );
    }
  }
  return arr;
};

export const getSelectedLayers = (
  data: RenderTree[] | any,
  itemsChecked: any = []
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

export const handleSelection = (data: RenderTree[] | any, id: string) => {
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
