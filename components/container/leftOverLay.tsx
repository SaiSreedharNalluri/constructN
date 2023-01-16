import React, { useEffect, useState } from 'react';
import { ChildrenEntity, IStrature } from '../../models/IStrature';
import SearchInput from '../container/searchInput';
import Treelist from './treeList';
import { useRouter } from 'next/router';
import { AxiosResponse } from 'axios';
import { getStructureHierarchy } from '../../services/structure';
interface IProps {
    structures: IStrature[];
    getStructureData: (strature: ChildrenEntity) => void;
    getStractureHierarchy: (e: string) => void;
}
const LeftOverLay: React.FC<IProps> = ({ getStructureData, }) => {
    let router = useRouter();
    let [state, setState] = useState<ChildrenEntity[]>([]);
    useEffect(() => {
        if (router.isReady) {
            getStructureHierarchy(router.query.projectId as string)
                .then((response: AxiosResponse<any>) => {
                    setState([...response.data.result]);
                })
                .catch((error) => {
                    console.log('error', error);
                });
        }
    }, [router.isReady, router.query.projectId]);
    return (
        <React.Fragment>
            <SearchInput></SearchInput>
            <div className="w-full ">
                {state.length === 0 ? (
                    'no structures found for this project'
                ) : (
                    <Treelist treeList={state} getStructureData={getStructureData} />
                )}
            </div>
        </React.Fragment>
    );
};
export default LeftOverLay;
