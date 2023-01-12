import { Form } from 'react-bootstrap';
import React from 'react';
import { ISnapShort } from '../../models/ISnapShort';

interface IProps {
  snapShots: ISnapShort[];
  getsnapShortDetails: (snapShotId: string) => void;
}
let Pagination: React.FC<IProps> = ({ snapShots, getsnapShortDetails }) => {
  return (
    <React.Fragment>
      <div className="flex justify-between">
        {snapShots &&
          snapShots.length > 0 &&
          snapShots.map((snapData: ISnapShort) => {
            return (
              <div key={snapData._id}>
                <ul className="flex">
                  <li
                    key={snapData._id}
                    onClick={() => {
                      getsnapShortDetails(snapData._id);
                    }}
                  >
                    <a className=" relative block py-2  px-2  border-0 bg-transparent  hover:bg-gray-200 outline-none transition-all duration-300 rounded focus:shadow-none text-gray-800 hover:text-gray-800  ">
                      <span>{snapData._id}</span>
                    </a>
                  </li>
                </ul>
              </div>
            );
          })}
        <div className="ml-4 rounded-sm bg-gray-300">
          <Form.Group controlId="dob">
            <Form.Control type="date" name="dob" />
          </Form.Group>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Pagination;
