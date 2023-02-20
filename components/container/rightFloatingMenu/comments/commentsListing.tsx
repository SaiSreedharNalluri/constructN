import React from 'react';
import { Comments } from '../../../../models/IComments';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Moment from 'moment';
import NextImage from '../../../core/Image';
interface IProps {
  comment: Comments;
}
const CommentsListing: React.FC<IProps> = ({ comment }) => {
  return (
    <React.Fragment>
      <div key={comment._id} className="mt-2">
        <div className="flex justify-start">
          <div className="w-1/6 h-1/6 mt-2 mr-2 mb-2 rounded-full overflow-hidden">
            <NextImage
              src={comment.by.avatar}
              className={`w-full h-full cursor-pointer object-cover`}
            />
          </div>
          <div>
            <div className="flex justify-start">
              <div className="font-bold text-cyan-700">
                {comment.by.fullName}
              </div>
              <div className="ml-2">
                {Moment(comment?.createdAt).format('DD-MMM-YYYY hh:mm A')}
              </div>
            </div>
            <div>{comment.comment}</div>
            <div className="flex justify-items-start cursor-pointer hover:underline text-blue-700">
              <div>Reply</div>
              <div className="ml-2 ">Edit</div>
              <div className="ml-2">Delete</div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
export default CommentsListing;
