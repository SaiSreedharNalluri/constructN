import { UploaderPopups } from "../state/uploaderState/state"

export interface showPopup<T> {
    isShowPopup: true,
    popupType: T,
    message?: string
}
  
export interface hidePopup {
    isShowPopup: false,
}

export interface PopupData {
    type: PopupType
    modalTitle: string,
    modalMessage: string,
    primaryButtonLabel: string,
    secondaryButtonlabel: string,
    third?:string
} 

export type PopupVisibility = showPopup<PopupType> | hidePopup

export type PopupType = UploaderPopups