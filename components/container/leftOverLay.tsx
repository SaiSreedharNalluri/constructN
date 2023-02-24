import React, { useEffect, useState } from 'react';
import { ChildrenEntity, IStructure } from '../../models/IStructure';
import Treelist from './treeList';
import { useRouter } from 'next/router';
import { AxiosResponse } from 'axios';
import { getStructureHierarchy } from '../../services/structure';
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';
interface IProps {
  getStructureData: (structure: ChildrenEntity) => void;
  getStructure: (Structure: ChildrenEntity) => void;
}
const LeftOverLay: React.FC<IProps> = ({ getStructureData, getStructure }) => {
  let router = useRouter();
  let [state, setState] = useState<ChildrenEntity[]>([]);
  let [stateFilter, setStateFilter] = useState<ChildrenEntity[]>([]);
  const [selector,setSelector]=useState('');
  useEffect(() => {
    if (router.isReady) {
      if(router.query.structId!==undefined)
          setSelector(router.query.structId.toString());
      getStructureHierarchy(router.query.projectId as string)
        .then((response: AxiosResponse<any>) => {
          setState([...response.data.result]);
          setStateFilter([...response.data.result]);
          if(selector.length<1){
            let index =response.data.result.findIndex((structData:IStructure)=>{
                
              return ((structData.designs!==undefined )&& (structData.designs.length>0))
            })
            if(index>0)
            setSelector(response.data.result[index]._id);
            else
            setSelector(response.data.result[0]._id);
           
            //to find structure with data and set
          }
          
        })
        .catch((error) => {
          console.log('error', error);
        });
        
    }
  }, [router.isReady, router.query.projectId,router.query.structId]);
  const schema = Yup.object().shape({
    searchQuery: Yup.string()
      .required('A search query is required')
      .min(3, 'Search query must be at least 3 characters long'),
  });

  function filterBy(arr: ChildrenEntity[], query: string) {
    return query
      ? arr.reduce((acc: any, item: any) => {
          if (item.children?.length) {
            const filtered: any = filterBy(item.children, query);
            if (filtered.length)
              return [...acc, { ...item, children: filtered }];
          }

          const { children, ...itemWithoutChildren } = item;
          return item.name?.toLowerCase().includes(query.toLowerCase())
            ? [...acc, itemWithoutChildren]
            : acc;
        }, [])
      : arr;
  }
  return (
    <React.Fragment>
      <Formik
        initialValues={{ searchQuery: '' }}
        validationSchema={schema}
        onSubmit={(values, actions) => {
          actions.setSubmitting(false);
        }}
      >
        {({ setFieldValue }) => (
          <Form>
            <Field
              className="border-2 w-full border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
              type="text"
              name="searchQuery"
              placeholder="Search"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setFieldValue('searchQuery', event.target.value);
                setState(filterBy(stateFilter, event.target.value));
              }}
            />
          </Form>
        )}
      </Formik>

      <div>
        {state.length === 0 ? (
          'no structures found for this project'
        ) : (
          <Treelist initialSelector={selector} treeList={state} getStructureData={getStructureData} />
        )}
      </div>
    </React.Fragment>
  );
};
export default LeftOverLay;
