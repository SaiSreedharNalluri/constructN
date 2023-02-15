import React, { useEffect, useState } from "react";
import {
  ChildrenEntity,
  IStructure,
  IStructures,
} from "../../models/IStructure";
import Treelist from "./treeList";
import { useRouter } from "next/router";
import { AxiosResponse } from "axios";
import { getStructureHierarchy } from "../../services/structure";
import ProjectHierarchy from "../divami_components/project-hierarchy/ProjectHierarchy";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
interface IProps {
  getStructureData: (structure: ChildrenEntity) => void;
  getStructure: (Structure: ChildrenEntity) => void;
  setHierarchy: any;
  handleNodeSelection: any;
  selectedNodes: any;
  handleNodeExpand: any;
  expandedNodes: any;
}
const LeftOverLay: React.FC<IProps> = ({
  getStructureData,
  getStructure,
  setHierarchy,
  handleNodeSelection,
  selectedNodes,
  handleNodeExpand,
  expandedNodes,
}) => {
  let router = useRouter();
  let [state, setState] = useState<ChildrenEntity[] | any[]>([]);
  let [stateFilter, setStateFilter] = useState<ChildrenEntity[]>([]);
  useEffect(() => {
    if (router.isReady) {
      getStructureHierarchy(router.query.projectId as string)
        .then((response: AxiosResponse<any>) => {
          setState([...response.data.result]);
          setStateFilter([...response.data.result]);
          getStructure(response.data.result[0]);
        })
        .catch((error) => {
          console.log("error", error);
        });
    }
  }, [router.isReady, router.query.projectId]);
  const schema = Yup.object().shape({
    searchQuery: Yup.string()
      .required("A search query is required")
      .min(3, "Search query must be at least 3 characters long"),
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

  // const [selected, setSelected] = useState<string[]>([]);
  // const handleNodeSelection = (nodeIds: any) => {
  //   setSelected(nodeIds);
  // };
  return (
    <React.Fragment>
      {/* <Formik
        initialValues={{ searchQuery: "" }}
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
                setFieldValue("searchQuery", event.target.value);
                setState(filterBy(stateFilter, event.target.value));
              }}
            />
          </Form>
        )}
      </Formik> */}

      <div>
        {/* <SearchInput></SearchInput> */}
        {
          <>
            {/* <Treelist treeList={state} getStructureData={getStructureData} /> */}
            <ProjectHierarchy
              handleSearch={(event: React.ChangeEvent<HTMLInputElement>) => {
                // setFieldValue("searchQuery", event.target.value);
                setState(filterBy(stateFilter, event.target.value));
              }}
              title={"Project Hierarchy"}
              onCloseHandler={() => {
                // setOpenSelectLayer(false)
                setHierarchy(false);
              }}
              treeData={state}
              setHierarchy={setHierarchy}
              getStructureData={getStructureData}
              handleNodeSelection={handleNodeSelection}
              selectedNodes={selectedNodes}
              handleNodeExpand={handleNodeExpand}
              expandedNodes={expandedNodes}
            />
          </>
        }
      </div>
    </React.Fragment>
  );
};
export default LeftOverLay;
