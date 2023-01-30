import React from 'react';
import * as Yup from 'yup';
import Image from 'next/image';
import { IProjects } from '../../models/IProjects';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { ProjectTypes } from '../../utils/constants';
import ChangeIcon from './changeIcon';
interface IProps {
  projectData: IProjects;
  updateProjectData: (updateInfo: object) => void;
  handleImageUPload: (e: object) => void;
}

let latitude = 0;
const ProjectInfo: React.FC<IProps> = ({
  projectData,
  updateProjectData,
  handleImageUPload,
}) => {
  const initialValues: {
    name: string;
    type: string;
    description: string;
    latitude: number;
    longitude: number;
    utm: string;
  } = {
    name: projectData?.name ? projectData?.name : '',
    type: projectData?.type ? projectData?.type : '',
    description: projectData?.description ? projectData?.description : '',
    latitude:
      projectData?.location != undefined ? projectData?.location[0] : latitude,
    longitude:
      projectData?.location != undefined ? projectData?.location[1] : latitude,
    utm: projectData?.utm ? projectData?.utm : '',
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string(),
    type: Yup.string(),
    description: Yup.string(),
    Location: Yup.array(),
    utm: Yup.string(),
  });
  console.log('project', projectData);
  return (
    <React.Fragment>
      <div className="inset-x-1/2 grid grid-cols-2 place-content-center gap-8 px-4">
        <div className="col-span-2">
          <Image
            alt=""
            className=" w-8/12 h-20 border border-solid border-black  cursor-pointer"
            width={1080}
            height={1080}
            src={projectData.coverPhoto ? projectData.coverPhoto : ''}
          />
          <ChangeIcon handleImageUPload={handleImageUPload} />
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={updateProjectData}
        >
          {({ isSubmitting }) => (
            <Form className=" grid grid-cols-1 gap-y-2 px-4">
              <div>
                <label className=" text-sm font-bold mb-2">Project Name</label>
                <Field
                  className=" border border-solid border-gray-500 rounded w-full py-2 px-2"
                  type="text"
                  placeholder="projectName"
                  name="name"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="alert alert-danger"
                />
              </div>
              <div>
                <div className=" font-bold">
                  <h1>Project type</h1>
                </div>
                <Field
                  as="select"
                  name="type"
                  id="type"
                  className="border border-solid border-gray-500 w-full p-2  rounded"
                >
                  {ProjectTypes.map((option: any) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </Field>
              </div>
              <div>
                <label className="text-sm  font-bold mb-2">
                  Project Description
                </label>
                <Field
                  className="border border-solid border-gray-500 rounded py-2 px-2 w-full text-gray-500"
                  placeholder="Project Description"
                  name="description"
                  id="description"
                  type="text"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="alert alert-danger"
                />
              </div>
              <div>
                <label className="text-sm font-bold mb-2">Latitude</label>
                <Field
                  className=" border border-solid border-gray-500 rounded py-2 px-2 w-full"
                  type="text"
                  placeholder="Latitude"
                  name="latitude"
                />
                <ErrorMessage
                  name="latitude"
                  component="div"
                  className="alert alert-danger"
                />
              </div>
              <div>
                <label className="text-sm font-bold mb-2">Longitude</label>
                <Field
                  className=" border border-solid border-gray-500 rounded py-2 px-2 w-full"
                  type="text"
                  placeholder="Longitude"
                  name="longitude"
                />
                <ErrorMessage
                  name="latitude"
                  component="div"
                  className="alert alert-danger"
                />
              </div>
              <div>
                <label className="text-sm font-bold mb-2">UTM</label>
                <Field
                  className="border border-solid border-gray-500 rounded py-2 px-2 w-full text-gray-500"
                  placeholder="UTM"
                  name="utm"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="alert alert-danger"
                />
              </div>

              <div className="flex col-span-2 justify-center ">
                <button
                  className="bg-gray-500 rounded hover:bg-gray-300 text-white font-bold py-1 px-2 w-3/12 "
                  type="submit"
                  disabled={isSubmitting}
                >
                  Submit
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </React.Fragment>
  );
};
export default ProjectInfo;
