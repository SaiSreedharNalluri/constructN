import { NextPage, NextPageContext } from "next";
import NextImage from "../components/core/Image";
import { useRouter } from "next/router";
import ErrorNotFound from "../public/divami_icons/ErrorNotFound.svg";
type ErrorPageProps = {
  statusCode?: number;
  message?: string;
};

const ErrorPage: NextPage<ErrorPageProps> = ({ statusCode, message }) => {
  const router = useRouter();
  return (
    <div className="w-full">
      <NextImage
        src={ErrorNotFound}
        className="h-screen w-screen"
      />
      <div className=" absolute w-1/4 h-1/4 top-1/4 bg-opacity-50 left-1/3 rounded p-2  bg-gray-300 text-center">
        <div className="mt-14">
          <h1>Error {statusCode}</h1>
          <p>{message}</p>
          <button
            className="mt-2 p-2 px-2 py-1 ml-1  focus:outline-none bg-gray-500 hover:bg-gray-800 rounded text-gray-200 font-semibold"
            onClick={() => {
              router.push("/projects");
            }}
          >
            Back To Home
          </button>
        </div>
      </div>
    </div>
  );
};

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  const message = err ? err.message : "An error occurred";
  return { statusCode, message };
};

export default ErrorPage;