import React, { useState } from 'react';
import { Comments } from '../../../../models/IComments';
import Moment from 'moment';
import NextImage from '../../../core/Image';
import CommentForm from './commentForm';
interface IProps {
  comment: any;
  updateComment: (text: string, commentId: string, editType: string) => void;
  activeComment: { _id: string; type: string } | null;
  setActiveComment: React.Dispatch<
    React.SetStateAction<{ _id: string; type: string } | null>
  >;
  addReplyToComment: (text: string, commentId: string) => void;
}
const CommentsListing: React.FC<IProps> = ({
  comment,
  updateComment,
  activeComment,
  setActiveComment,
  addReplyToComment,
}) => {
  const isEditing =
    activeComment &&
    activeComment._id === comment._id &&
    activeComment.type === 'editing';
  const isReplying =
    activeComment &&
    activeComment._id === comment._id &&
    activeComment.type === 'replying';
  const [editType, setEditType] = useState(''); //comments,reply
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
            <div>{comment.comment ? comment.comment : comment.reply}</div>
            <div className="flex justify-items-start cursor-pointer hover:underline text-blue-700">
              {comment?.replies && (
                <div
                  onClick={() => {
                    setActiveComment({ _id: comment._id, type: 'replying' });
                  }}
                >
                  Reply
                </div>
              )}
              <div
                className="ml-2 "
                onClick={() => {
                  setActiveComment({ _id: comment._id, type: 'editing' });
                  if (comment.replies) {
                    setEditType('comments');
                  } else {
                    setEditType('reply');
                  }
                }}
              >
                Edit
              </div>
              <div className="ml-2">Delete</div>
            </div>
            {isEditing && (
              <CommentForm
                submitLabel="Update"
                hasCancelButton={true}
                handleCancel={() => {
                  setActiveComment(null);
                }}
                initialText={comment.comment ? comment.comment : comment.reply}
                handleSubmit={(text) => {
                  updateComment(text, comment._id, editType);
                }}
              />
            )}
            {isReplying && (
              <CommentForm
                submitLabel="Reply"
                handleSubmit={(text) => addReplyToComment(text, comment._id)}
                hasCancelButton={true}
                handleCancel={() => {
                  setActiveComment(null);
                }}
              />
            )}
            {comment?.replies &&
              comment?.replies?.length > 0 &&
              comment.replies.map((replyObj: any) => {
                return (
                  <CommentsListing
                    key={replyObj._id}
                    comment={replyObj}
                    updateComment={updateComment}
                    activeComment={activeComment}
                    setActiveComment={setActiveComment}
                    addReplyToComment={() => {}}
                  />
                );
              })}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
export default CommentsListing;
