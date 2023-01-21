import React, { useEffect, useState } from 'react';
import { ChildrenEntity, IStructure } from '../../models/IStructure';
import SearchInput from '../container/searchInput';
import Treelist from './treeList';
import { useRouter } from 'next/router';
import { AxiosResponse } from 'axios';
import { getStructureHierarchy } from '../../services/structure';
interface IProps {
  getStructureData: (structure: ChildrenEntity) => void;
  getStructure: (Structure: ChildrenEntity) => void;
}
const LeftOverLay: React.FC<IProps> = ({ getStructureData, getStructure }) => {
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
  if (state.length > 0) {
    getStructure(state[0]);
  }
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
