import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { getCookie, removeCookies } from 'cookies-next';
import { IProjects } from '../../models/IProjects';
interface IProps {}
const Header: React.FC<IProps> = () => {
  const router = useRouter();
  let [name, setName] = useState<string>('');
  let [projects, setProjects] = useState<IProjects[]>([]);
  const [selectedValue, setSelection] = useState(
    router.query.projectId as string
  );
  useEffect(() => {
    const userObj: any = getCookie('user');
    setProjects(JSON.parse(localStorage.getItem('projects') as string));
    let user = null;
    if (userObj) user = JSON.parse(userObj);
    if (user.fullName) {
      setName(user.fullName);
    }
  }, [router.query.projectId]);
  const [loading, setLoading] = useState<boolean>(false);
  const userLogOut = () => {
    removeCookies('user');
    router.push('/login');
  };
  const goToProjectsList = () => {
    router.push('/projects');
  };
  return (
    <React.Fragment>
      <header className="h-11 bg-custom-yellow ">
        <div className="flex justify-between">
          <div>
            <Image
              onClick={goToProjectsList}
              className=" mt-2  cursor-pointer"
              src="https://d1muf25xaso8hp.cloudfront.net/https%3A%2F%2Fs3.amazonaws.com%2Fappforest_uf%2Ff1628494605280x954459828257958600%2FArtboard%25201%2520copy%25202%25404x.png?w=512&h=115&auto=compress&fit=crop&dpr=1.25"
              alt=""
              height={240}
              width={240}
            ></Image>
          </div>
          {router.pathname != '/projects' && (
            <div>
              <select
                className="focus:outline-none"
                onChange={(e) => {
                  router.push(`/projects/${e.target.value}/project`);
                }}
              >
                {projects &&
                  projects.map((pData: IProjects) => {
                    return (
                      <option
                        key={pData._id}
                        value={pData._id}
                        selected={pData._id === selectedValue}
                      >
                        {pData.name}
                      </option>
                    );
                  })}
              </select>
            </div>
          )}
          <div>
            <FontAwesomeIcon className="mt-4 mr-2 " icon={faBell} size="2x" />
          </div>
          <div
            onClick={() => {
              if (!loading) {
                setLoading(true);
              } else {
                setLoading(false);
              }
            }}
          >
            <div className="flex justify-center items-center space-x-3 cursor-pointer">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 dark:border-white border-gray-900">
                <Image
                  src="https://images.unsplash.com/photo-1610397095767-84a5b4736cbd?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80"
                  alt=""
                  className="w-full h-full object-cover"
                  height={1920}
                  width={1080}
                />
              </div>
              <div className="font-semibold dark:text-white text-gray-900 text-lg">
                <div className="cursor-pointer">{name}</div>
              </div>
            </div>
            {loading && (
              <div className="absolute w-60 px-5 py-3 dark:bg-gray-800 bg-white rounded-lg shadow border dark:border-transparent mt-5">
                <ul className="space-y-3 dark:text-white">
                  <li className="font-medium">
                    <div className="flex items-center transform transition-colors duration-200 border-r-4 border-transparent hover:border-indigo-700">
                      <div className="mr-3">
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          ></path>
                        </svg>
                      </div>
                      Account
                    </div>
                  </li>
                  <li className="font-medium">
                    <div className="flex items-center transform transition-colors duration-200 border-r-4 border-transparent hover:border-indigo-700">
                      <div className="mr-3">
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                          ></path>
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          ></path>
                        </svg>
                      </div>
                      Settings
                    </div>
                  </li>
                  <hr className="dark:border-gray-700" />
                  <li className="font-medium" onClick={() => userLogOut()}>
                    <div className="flex items-center transform transition-colors duration-200 border-r-4 border-transparent hover:border-red-600">
                      <div className="mr-3 text-red-600">
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          ></path>
                        </svg>
                      </div>
                      Logout
                    </div>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </header>
    </React.Fragment>
  );
};
export default Header;
