import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faGreaterThan, faGripHorizontal, faUsers } from '@fortawesome/free-solid-svg-icons';
import RightOverLay from '../container/rightOverLay';
import LeftOverLay from '../container/leftOverLay';
import { IStrature, ChildrenEntity } from '../../models/IStrature';
import MapLoading from '../container/mapLoading';
import DatePicker from '../container/datePicker';
import Pagination from '../container/pagination';
interface IProps {
    structures: IStrature[];
    getStructureData: (strature: ChildrenEntity) => void;
    getStractureHierarchy: (e: string) => void;
}
const CollapsableMenu: React.FC<IProps> = ({
    structures,
    getStructureData,
    getStractureHierarchy,
}) => {
    const [leftNav, setLeftNav] = useState(false);
    const [rightNav, setRightNav] = useState(false);
    const [active, setActive] = useState("");
    const leftOverlayRef: any = useRef();
    const rightOverlayRef: any = useRef();
    const [bottomNav, setBottomNav] = useState(false);
    const BottomOverlayRef: any = useRef();
    const leftIconsContainerRef: any = useRef();
    const leftNavCollapse = (e: any) => {
        setLeftNav(!leftNav);
        leftClickHandler(e);
    };
    useEffect(() => {
        if (leftNav) {
            leftOverlayRef.current.style.width = '18vw';
        } else {
            leftOverlayRef.current.style.width = '0%';
        }
    }, [leftNav]);
    const rightNavCollapse = () => {
        if (!rightNav) {
            rightOverlayRef.current.style.width = '3%';
            rightOverlayRef.current.style.height = '65%';
        } else {
            rightOverlayRef.current.style.width = '0%';
            rightOverlayRef.current.style.height = '0%';
        }
        setRightNav(!rightNav);
    };
    const leftClickHandler = (e: any) => {
        setActive(e.currentTarget.id);
    }
    const bottomOverLay = () => {
        if (!bottomNav) {
            BottomOverlayRef.current.style.width = '45%';
        } else {
            BottomOverlayRef.current.style.width = '0%';
        }
        setBottomNav(!bottomNav);
    };
    const closeStructurePage = (e: any) => {
        console.log(leftOverlayRef.current.contains(e.target));
        console.log(!leftIconsContainerRef.current.contains(e.target));
        if (!leftOverlayRef.current.contains(e.target) && !leftIconsContainerRef.current.contains(e.target)) {
            setLeftNav(false);
        }
    }
    useEffect(() => {
        const handler = document.addEventListener("click", closeStructurePage);
        console.log(handler);
        return () => {
            document.removeEventListener("click", closeStructurePage)
        }
    }, [])
    return (
        <div>
            <div className='absolute left-0 z-10 w-10 h-91 text-center bg-gray-300' ref={leftIconsContainerRef}>
                <div>
                    <FontAwesomeIcon id='icon1' className={` w-full py-2  cursor-pointer ${active === "icon1" ? "selectedClass" : "unSelectedClass"}`} onClick={leftClickHandler} icon={faGripHorizontal}></FontAwesomeIcon>
                </div>
                <div >
                    <FontAwesomeIcon
                        id='icon2' className={` w-full py-2 cursor-pointer ${active === "icon2" ? "selectedClass" : "unSelectedClass"}`} onClick={leftNavCollapse}
                        icon={faGreaterThan}
                    ></FontAwesomeIcon>
                </div>
                <div
                    ref={leftOverlayRef} id="icon3"
                    className={`h-full bg-gray-200 w-0 absolute  ${active === "icon3" ? "selectedClass" : "unSelectedClass"} ${leftNav ? 'left-10' : 'left-10  '
                        }   top-0   duration-300 overflow-x-hidden`}
                >
                    <LeftOverLay
                        getStractureHierarchy={getStractureHierarchy}
                        getStructureData={getStructureData}
                        structures={structures}
                    ></LeftOverLay>
                </div>
                <div  >
                    <FontAwesomeIcon id='icon4' className={`${leftNav ? 'left-0' : 'left-0  '} w-full py-2  cursor-pointer ${active === "icon4" ? "selectedClass" : "unSelectedClass"}`} onClick={leftClickHandler} icon={faCircleInfo}></FontAwesomeIcon>
                </div>

                <div >
                    <FontAwesomeIcon id="icon5" className={` cursor-pointer w-full py-2  ${active === "icon5" ? "selectedClass" : "unSelectedClass"}`} onClick={leftClickHandler} icon={faGreaterThan}></FontAwesomeIcon>
                </div>
                <div >
                    <FontAwesomeIcon id="icon6" className={` cursor-pointer w-full py-2  ${active === "icon6" ? "selectedClass" : "unSelectedClass"}`} icon={faGreaterThan} onClick={leftClickHandler}></FontAwesomeIcon>
                </div>
                <div >
                    <FontAwesomeIcon id="icon7" className={` cursor-pointer w-full py-2  ${active === "icon7" ? "selectedClass" : "unSelectedClass"}`} icon={faGreaterThan} onClick={leftClickHandler}></FontAwesomeIcon>
                </div>
                <div >
                    <FontAwesomeIcon id="icon8" className={`cursor-pointer w-full py-2  ${active === "icon8" ? "selectedClass" : "unSelectedClass"} `} icon={faUsers} onClick={leftClickHandler}></FontAwesomeIcon>
                </div>
                <div className='mt-2 border-t border-solid border-gray-400'>
                    <FontAwesomeIcon id="icon9" className={` cursor-pointer w-full py-2  ${active === "icon9" ? "selectedClass" : "unSelectedClass"} `} icon={faGreaterThan} onClick={leftClickHandler}></FontAwesomeIcon>
                </div>
            </div>
            <MapLoading></MapLoading>
            <FontAwesomeIcon
                className={`absolute  ${rightNav && 'rotate-180'
                    } text-2xl text-blue-300 top-2/4 ${rightNav ? 'right-5' : 'right-0'
                    }  cursor-pointer border-none rounded ml-2 p-2 bg-gray-600 text-white`}
                onClick={rightNavCollapse}
                icon={faGreaterThan}
            ></FontAwesomeIcon>
            <div
                ref={rightOverlayRef}
                id="bg-color"
                className={`absolute w-0  ${rightNav ? 'visible' : 'hidden'}  bg-gray-400 top-1/4 rounded z-10 right-0 duration-300 overflow-x-hidden`}
            >
                <RightOverLay></RightOverLay>
            </div>
            <p className={`left-48  bg-gray-300 rounded absolute duration-300 cursor-pointer ${bottomNav ? 'bottom-11' : 'bottom-0'} `} onClick={bottomOverLay}>
                10-01-2022
            </p>
            <div ref={BottomOverlayRef} className="w-0 absolute left-35 bottom-1  overflow-x-hidden z-10"            >
                <div className="flex ">
                    <div className="">
                        <Pagination></Pagination>
                    </div>
                    <div className=''>
                        <DatePicker></DatePicker>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CollapsableMenu;
