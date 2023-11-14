import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import Image from 'next/image';
import { IProjects } from '../../models/IProjects';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import ChangeIcon from './changeIcon';
import { Map, Marker } from 'react-map-gl';
import { useRouter } from 'next/router';
import { getProjectTypes } from '../../services/project';
import { AWS, MAPBOX } from '../../config/config';
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
  const router = useRouter();
  const [projectTypes, setProjectTypes] = useState<[string]>();
  useEffect(() => {
    if (router.isReady) {
      getProjectTypes()
        .then((response) => {
          if (response.success === true) {
            setProjectTypes(response.result);
          }
        })
        .catch();
    }
  }, [router.isReady]);
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
  return (
    <React.Fragment>
      <div className="w-full row-span-2 overflow">
        <img
          alt=""
          className=" w-3/4 h-25 border border-solid border-black  cursor-pointer"
          width={1080}
          height={1080}
          src={
            projectData.coverPhoto
              ? projectData.coverPhoto
              : `${AWS.CDN_ATTACHMENTS}/defaults/projectCoverPhoto.webp`
          }
        />
      </div>
      <div className="pl-6">
        <ChangeIcon handleImageUPload={handleImageUPload} />
      </div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={updateProjectData}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="grid grid-cols-2 gap-4 px-6">
            <div>
                <label className=" text-sm font-bold ">{'Created On : '+projectData.createdAt.toString().split('T')[0]}</label>
              
              </div>
              <div>
                <label className=" text-sm font-bold ">{'Created By : '+projectData.email}</label>
              
              </div>
              <div>
                <label className=" text-sm font-bold ">Project Name</label>
                <Field
                  className=" border border-solid border-gray-500 rounded w-full py-2 px-2"
                  type="text"
                  placeholder="Project Name"
                  name="name"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="alert alert-danger text-red-600"
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
                  {projectTypes &&
                    projectTypes.map((option: string) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                </Field>
              </div>
            </div>

            <div className="grid grid-cols-2  gap-1 px-6 mt-2 ">
              <div className="col-span-2">
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
                  className="alert alert-danger text-red-600"
                />
              </div>

              <div className="w-full row-span-2 overflow-y-auto">
                <Map
                  initialViewState={{
                    longitude: initialValues.longitude,
                    latitude: initialValues.latitude,
                    zoom: 10,
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                  mapStyle="mapbox://styles/mapbox/streets-v9"
                  mapboxAccessToken={MAPBOX.token}
                >
                  <Marker
                    longitude={initialValues.longitude}
                    latitude={initialValues.latitude}
                  ></Marker>
                </Map>
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
                  className="alert alert-danger text-red-600"
                />
              </div>
              <div className="grid grid-cols-2  gap-2">
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
                    className="alert alert-danger text-red-600"
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
                    className="alert alert-danger text-red-600"
                  />
                </div>
              </div>
            </div>

            <div className="flex  justify-center py-4  mt-4">
              <button
                className="bg-gray-500 rounded hover:bg-gray-300 text-white font-bold py-1 px-2 lg:w-2/12 "
                type="submit"
              >
                Update
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </React.Fragment>
  );
};
export default ProjectInfo;
