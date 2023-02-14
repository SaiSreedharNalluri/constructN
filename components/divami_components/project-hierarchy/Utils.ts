import { ChildrenEntity } from '../../../models/IStructure'
import type { RenderTree } from './Type'

export const getSelectedLayers = (
  data: ChildrenEntity[],
  itemsChecked: string[] = [],
) => {
  for (let i = 0; i < data.length; i++) {
    // if (data[i].isSelected) {
    //   itemsChecked.push(data[i].name)
    // }
    if (data[i].children) {
      getSelectedLayers(data[i].children as ChildrenEntity[], itemsChecked)
    }
  }
  return itemsChecked
}
export const getAllIds = (data: any, nodes: string[] = []) => {
  for (let i = 0; i < data.length; i++) {
    nodes.push(data[i]._id)
    if (data[i].children) {
      getAllIds(data[i].children as ChildrenEntity[], nodes)
    }
  }
  return nodes
}
export const handleSelection = (data: RenderTree[], id: string) => {
  for (let i = 0; i < data.length; i++) {
    if (data[i]._id === id && data[i]) {
      data[i].isSelected = !data[i].isSelected
      return data
    }
    if (data[i].children) {
      data[i].children = handleSelection(data[i].children as RenderTree[], id)
    }
  }
  return data
}
