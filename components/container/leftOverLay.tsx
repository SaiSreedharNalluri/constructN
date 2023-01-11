import React from 'react'
import { ChildrenEntity, IStrature } from '../../models/IStrature';
import Layer from '../container/layer';
import SearchInput from '../container/searchInput';
import Structure from './structure';
interface IProps {
    structures: IStrature[];
    getStructureData: (strature: ChildrenEntity) => void;
    getStractureHierarchy: (e: string) => void
}
const LeftOverLay: React.FC<IProps> = ({ structures, getStructureData, getStractureHierarchy }) => {
    return (
        <React.Fragment>
            <div className=''>
                <select
                    className="focus:outline-none w-full bg-gray-100 p-2"
                    onChange={(e) => {
                        getStractureHierarchy(e.target.value);
                    }}
                >
                    {structures &&
                        structures.map((stractureData: any) => {
                            return (
                                <option
                                    key={stractureData._id}
                                    value={stractureData._id}
                                    selected={stractureData.parent === null}
                                >
                                    {stractureData.name}
                                </option>
                            );
                        })}
                </select>
            </div>
            <Layer></Layer>
            <SearchInput></SearchInput>
            <div className="w-full">
                <Structure getStructureData={getStructureData}></Structure>
            </div>
        </React.Fragment>
    )
}

export default LeftOverLay