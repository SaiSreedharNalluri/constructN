import React from 'react'
const SearchInput: React.FC = () => {
    return (
        <div className=" relative  text-gray-600">
            <input className="border-2 w-full  border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
                type="search" name="search" placeholder="Search" />
        </div>
    )
}

export default SearchInput