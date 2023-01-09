import React from 'react'
import { Form } from "react-bootstrap";

const Pagination: React.FC = () => {
    return (
        < div className="flex justify-between">
            <div>
                <ul className="flex">
                    <li >
                        <a
                            className=" relative block py-2   border-0 bg-transparent  hover:bg-gray-200 outline-none transition-all duration-300 rounded focus:shadow-none text-gray-800 hover:text-gray-800  "
                        >
                            <span>&laquo;</span>
                        </a></li>
                    <p className=" relative block py-2  px-2">{"06Jan'22"}</p>
                    <li >
                        <a
                            className=" relative block py-2  px-2  border-0 bg-transparent  hover:bg-gray-200 outline-none transition-all duration-300 rounded focus:shadow-none text-gray-800 hover:text-gray-800  "
                        >
                            <span>1</span>
                        </a></li>
                    <li >
                        <a
                            className=" relative block py-2  px-2  border-0 bg-transparent  hover:bg-gray-200 outline-none transition-all duration-300 rounded focus:shadow-none text-gray-800 hover:text-gray-800  "
                        >
                            <span>2</span>
                        </a></li>

                    <li >
                        <a
                            className=" relative block py-2  px-2  border-0 bg-transparent  hover:bg-gray-200 outline-none transition-all duration-300 rounded focus:shadow-none text-gray-800 hover:text-gray-800  "
                        >
                            <span>3</span>
                        </a></li>
                    <li >
                        <a
                            className=" relative block py-2  px-2  border-0 bg-transparent  hover:bg-gray-200 outline-none transition-all duration-300 rounded focus:shadow-none text-gray-800 hover:text-gray-800  "
                        >
                            <span>4</span>
                        </a></li>
                    <li >
                        <a
                            className=" relative block py-2  px-2  border-0 bg-transparent  hover:bg-gray-200 outline-none transition-all duration-300 rounded focus:shadow-none text-gray-800 hover:text-gray-800  "
                        >
                            <span>5</span>
                        </a></li>
                    <li >
                        <a
                            className=" relative block py-2  px-2  border-0 bg-transparent  hover:bg-gray-200 outline-none transition-all duration-300 rounded focus:shadow-none text-gray-800 hover:text-gray-800  "
                        >
                            <span>6</span>
                        </a></li>
                    <li >
                        <a
                            className=" relative block py-2  px-2  border-0 bg-transparent  hover:bg-gray-200 outline-none transition-all duration-300 rounded focus:shadow-none text-gray-800 hover:text-gray-800  "
                        >
                            <span>7</span>
                        </a></li>
                    <li >
                        <a
                            className=" relative block py-2  px-2  border-0 bg-transparent  hover:bg-gray-200 outline-none transition-all duration-300 rounded focus:shadow-none text-gray-800 hover:text-gray-800  "
                        >
                            <span>8</span>
                        </a></li>
                    <li >
                        <a
                            className=" relative block py-2  px-2  border-0 bg-transparent  hover:bg-gray-200 outline-none transition-all duration-300 rounded focus:shadow-none text-gray-800 hover:text-gray-800  "
                        >
                            <span>9</span>
                        </a></li>
                    <li >
                        <a
                            className=" relative block py-2  px-2  border-0 bg-transparent  hover:bg-gray-200 outline-none transition-all duration-300 rounded focus:shadow-none text-gray-800 hover:text-gray-800  "
                        >
                            <span>10</span>
                        </a></li>
                    <p className=" relative block py-2  px-2">{"06Jan'22"}</p>
                    <li >
                        <a
                            className=" relative block py-2    border-0 bg-transparent  hover:bg-gray-200 outline-none transition-all duration-300 rounded focus:shadow-none text-gray-800 hover:text-gray-800  "
                        >
                            <span>&raquo;</span>
                        </a></li>
                </ul>
            </div>
            <div className='ml-4 rounded-sm bg-gray-300'>
                <Form.Group controlId="dob">
                    <Form.Control
                        type="date"
                        name="dob"
                    />
                </Form.Group>
            </div>
        </div>
    )
}

export default Pagination;