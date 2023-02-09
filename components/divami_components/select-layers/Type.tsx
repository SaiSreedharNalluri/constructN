export interface RenderTree {
  id: string
  name: string
  children?: RenderTree[]
  isSelected: boolean
}

export interface SelectLayerContainerProps {
  openSelectLayer: boolean
}

export interface SelectLayerProps {
  title: string
  openSelectLayer: boolean
  onCloseHandler: () => void
}
