import React from 'react'
import DropDown from '../container/dropDown';
import Layer from '../container/layer';
import SearchInput from '../container/searchInput';
const LeftOverLay: React.FC = () => {
    return (
        <>
            <DropDown></DropDown>
            <Layer></Layer>
            <SearchInput></SearchInput>
        </>
    )
}

export default LeftOverLay