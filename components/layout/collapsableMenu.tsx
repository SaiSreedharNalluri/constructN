import React, { useState, useRef } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGreaterThan } from "@fortawesome/free-solid-svg-icons";
import Pagination from '../container/pagination';
import RightOverLay from '../container/RightOverLay';
import LeftOverLay from '../container/leftOverLay';
import { IStrature, ChildrenEntity } from '../../models/IStrature';
import MapLoading from '../container/mapLoading';
import TreeView from '@mui/lab/TreeView';
interface IProps {
    structures: IStrature[];
    getStructureData: (strature: ChildrenEntity) => void;
    getStractureHierarchy: (e: string) => void
}
const CollapsableMenu: React.FC<IProps> = ({ structures, getStructureData, getStractureHierarchy }) => {
    const [leftNav, setLeftNav] = useState(false);
    const [rightNav, setRightNav] = useState(false);
    const [bottomNav, setBottomNav] = useState(false);

    const leftOverlayRef: any = useRef();
    const rightOverlayRef: any = useRef();
    const BottomOverlayRef: any = useRef();
    const leftNavCollapse = () => {
        if (!leftNav) {
            leftOverlayRef.current.style.width = '25%';
        } else {
            leftOverlayRef.current.style.width = '0%';
        }
        setLeftNav(!leftNav)
    };
    const rightNavCollapse = () => {
        if (!rightNav) {
            rightOverlayRef.current.style.width = '3%';
            rightOverlayRef.current.style.height = '65%';
        } else {
            rightOverlayRef.current.style.width = '0%';
            rightOverlayRef.current.style.height = '0%';
        }
        setRightNav(!rightNav)
    }
    const bottomOverLay = () => {
        if (!bottomNav) {
            BottomOverlayRef.current.style.width = '45%';

        } else {
            BottomOverlayRef.current.style.width = '0%';
        }
        setBottomNav(!bottomNav)
    }
    return (
        <div className="h-full relative ">
            <div className={` w-full relative`}>
                {/* <img src="https://wallpaperaccess.com/full/4723253.jpg" className="h-91 w-screen" /> */}
                <MapLoading></MapLoading>
                <FontAwesomeIcon className={`absolute  ${!leftNav && "rotate-180"} text-2xl text-blue-300 top-2/4  ${leftNav ? "left-1/4" : ""} cursor-pointer border-none rounded ml-2 p-2 bg-gray-600 text-white`} onClick={leftNavCollapse} icon={faGreaterThan}></FontAwesomeIcon>
                <FontAwesomeIcon className={`absolute  ${rightNav && "rotate-180"} text-2xl text-blue-300 top-2/4 ${rightNav ? "right-5" : "right-0"}  cursor-pointer border-none rounded ml-2 p-2 bg-gray-600 text-white`} onClick={rightNavCollapse} icon={faGreaterThan}></FontAwesomeIcon>
                <p className={`left-2/4  bg-gray-300 rounded absolute duration-300 cursor-pointer ${bottomNav ? "bottom-11" : "bottom-0"} `} onClick={bottomOverLay}>10-01-2022</p>
                <div ref={leftOverlayRef} className={`h-full bg-white bg-opacity-60 w-0 absolute  z-10 top-0 -left-0 duration-300 overflow-x-hidden`}>
                    <LeftOverLay getStractureHierarchy={getStractureHierarchy} getStructureData={getStructureData} structures={structures}></LeftOverLay>
                </div>
                <div ref={BottomOverlayRef} className="w-0  bg-gray-600 bg-opacity-60 rounded absolute left-35 bottom-1  overflow-x-hidden z-10">
                    <Pagination></Pagination>
                </div>
                <div ref={rightOverlayRef} id="bg-color" className={`absolute w-0  bg-gray-600 bg-opacity-60 top-1/4 rounded z-10 right-0 duration-300 overflow-x-hidden`}>
                    <RightOverLay></RightOverLay>
                </div>
            </div>
        </div>

    )
}

export default CollapsableMenu