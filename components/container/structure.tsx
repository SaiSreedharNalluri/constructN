import { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import { ChildrenEntity } from '../../models/IStrature';
import { getStructure } from '../../services/structure';
import Treelist from './treeList';
import { useRouter } from 'next/router';
interface IProps {
  getStructureData: (strature: ChildrenEntity) => void;
}

const Structure: React.FC<IProps> = ({ getStructureData }) => {
  let router = useRouter();
  let [state, setState] = useState<ChildrenEntity[]>([]);
  useEffect(() => {
    if (router.isReady) {
      getStructure(router.query.projectId as string)
        .then((response: AxiosResponse<any>) => {
          setState([...response.data.result]);
        })
        .catch((error) => {
          console.log('error', error);
        });
    }
  }, [router.isReady, router.query.projectId]);

  return (
    <div>
      <React.Fragment>
        {state.length === 0 ? (
          'no structures found for this project'
        ) : (
          <Treelist treeList={state} getStructureData={getStructureData} />
        )}
      </React.Fragment>
    </div>
  );
};

export default Structure;
