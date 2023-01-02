import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { removeCookies } from 'cookies-next';
interface IProps {
  headerName: string;
}
const Header: React.FC<IProps> = ({ headerName }) => {
  const router = useRouter();
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
          <div>
            <p className="text-xl font-bold mt-4">{headerName}</p>
          </div>
          <div>
            <FontAwesomeIcon
              className="mt-4 mr-2 "
              icon={faSignOutAlt}
              size="2x"
              onClick={() => userLogOut()}
            ></FontAwesomeIcon>
          </div>
        </div>
      </header>
    </React.Fragment>
  );
};
export default Header;
