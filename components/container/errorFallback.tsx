import { FallbackProps } from "react-error-boundary";
import NextImage from "../core/Image";
import { useRouter } from "next/router";

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const router = useRouter();
  return (
    <div>
      <NextImage
        src="https://constructn-attachments.s3.ap-south-1.amazonaws.com/Login/login02.png"
        className="h-screen w-screen"
      />
      <div className=" absolute w-1/4 h-1/4 top-1/4 bg-opacity-50 left-1/3 rounded p-2  bg-gray-300 text-center">
        <div className="mt-14">
          <h1>Something went wrong</h1>
          <p>{error.message}</p>
          <button
            className="mt-2 p-2 px-2 py-1  focus:outline-none bg-gray-500 hover:bg-gray-800 rounded text-gray-200 font-semibold"
            onClick={resetErrorBoundary}
          >
            Try again
          </button>
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
}

export default ErrorFallback;