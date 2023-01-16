import { ISnapShort } from '../../models/ISnapShort';
import React, { useState, useRef } from 'react';
const Pagination: React.FC = () => {

    return (
        <React.Fragment>
            <div className="flex justify-around rounded-lg bg-gray-200">
                <div className="flex ">
                    <div className='  py-2 px-1  ' >
                        <span>&laquo;</span>
                    </div>
                    <div className=' flex items-center mr-1'>
                        <p>{"08Nov2022"}</p>
                    </div>
                    <div className="   rounded pl-2 pt-3">
                        <input
                            type="radio"
                            name="bordered-radio"
                            className="w-3 h-4 cursor-pointer"
                        />
                        <input
                            type="radio"
                            name="bordered-radio"
                            className="w-3 h-4 ml-2  cursor-pointer"
                        />
                        <input
                            type="radio"
                            name="bordered-radio"
                            className="w-3 h-4 ml-2  cursor-pointer"
                        />
                        <input
                            type="radio"
                            name="bordered-radio"
                            className="w-3 h-4 ml-2  cursor-pointer"
                        />
                        <input
                            type="radio"
                            name="bordered-radio"
                            className="w-3 h-4 ml-2  cursor-pointer"
                        />
                        <input
                            type="radio"
                            name="bordered-radio"
                            className="w-3 h-4 ml-2  cursor-pointer"
                        />
                        <input
                            type="radio"
                            name="bordered-radio"
                            className="w-3 h-4 ml-2  cursor-pointer"
                        />
                        <input
                            type="radio"
                            name="bordered-radio"
                            className="w-3 h-4 ml-2  cursor-pointer"
                        />
                        <input
                            type="radio"
                            name="bordered-radio"
                            className="w-3 h-4 ml-2  cursor-pointer"
                        />
                        <input
                            type="radio"
                            name="bordered-radio"
                            className="w-3 h-4 ml-2  cursor-pointer"
                        />
                    </div>

                </div>


                <div className='flex items-center ml-1 '>
                    <p>{"11Nov2022"}  </p>
                </div>
                <div className=' flex items-center ml-1 ' >
                    <span>&raquo;</span>
                </div>
            </div>


        </React.Fragment >
    );
};

export default Pagination;
