import React, { useState } from 'react';
import { Comments } from '../../../../models/IComments';
import Moment from 'moment';
import NextImage from '../../../core/Image';
import CommentForm from './commentForm';
import Modal from 'react-responsive-modal';
interface IProps {
  comment: any;
  updateComment: (text: string, comment: Comments) => void;
  activeComment: { _id: string; type: string } | null;
  setActiveComment: React.Dispatch<
    React.SetStateAction<{ _id: string; type: string } | null>
  >;
  addReplyToComment: (text: string, commentId: string) => void;
  deleteComment: (comment: Comments) => void;
}
const CommentsListing: React.FC<IProps> = ({
  comment,
  updateComment,
  activeComment,
  setActiveComment,
  addReplyToComment,
  deleteComment,
}) => {
  const isEditing =
    activeComment &&
    activeComment._id === comment._id &&
    activeComment.type === 'editing';
  const isReplying =
    activeComment &&
    activeComment._id === comment._id &&
    activeComment.type === 'replying';
  const [open, setOpen] = useState(false);
  const [commentObj, setCommentObj] = useState<Comments>();
  const handleDeleteItem = () => {
    deleteComment(commentObj as any);
    setTimeout(() => {
      setOpen(false);
    }, 4000);
  };
  return (
    <React.Fragment>
      <div key={comment._id} className="">
        <div className="grid grid-cols-8">
          <div
            className={`${
              comment.comment ? '' : 'col-start-2'
            } p-1 text-xs overflow-hidden  col-span-1`}
          >
            <NextImage
              src={comment.by.avatar}
              className={`rounded-full row-span-2 cursor-pointer object-cover`}
            />
          </div>
          <div className="font-bold text-cyan-700 text-base col-span-6">
            {comment.by.fullName}
          </div>
          <div className={`text-xs col-span-full ${comment.comment ? 'col-start-2' : 'col-start-3'}`}>
            {Moment(comment?.createdAt).format('DD-MMM-YYYY hh:mm A')}
          </div>
        </div>

        <div className="grid grid-cols-8">
          <div className={`col-span-full ${comment.comment ? '' : 'col-start-2'}`}>
            <div className={`px-3`}>
              <p>{comment.comment ? comment.comment : comment.reply}</p>
            </div>
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
                }}
              >
                Edit
              </div>
              <div
                className="ml-2"
                onClick={() => {
                  setOpen(true);
                  setCommentObj(comment);
                }}
              >
                Delete
              </div>
            </div>
            {isEditing && (
              <CommentForm
                hasCancelButton={true}
                handleCancel={() => {
                  setActiveComment(null);
                }}
                initialText={comment.comment ? comment.comment : comment.reply}
                handleSubmit={(text) => {
                  updateComment(text, comment);
                }}
              />
            )}
            {isReplying && (
              <CommentForm
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
                    deleteComment={deleteComment}
                  />
                );
              })}
          </div>
        </div>
        <div>
          <Modal
            open={open}
            onClose={() => {
              setOpen(false);
            }}
          >
            <h1 className=" font-bold">Delete confirmation</h1>
            <p className="mt-2">
              Are you sure you want to delete this comment?
            </p>
            <div className="grid grid-cols-2 gap-x-4 mt-4">
              <button
                onClick={() => {
                  setOpen(false);
                }}
                className="px-2 py-1  focus:outline-none bg-gray-500 hover:bg-gray-800 rounded text-gray-200 font-semibold"
              >
                Cancel
              </button>
              <button
                className="px-2 py-1 bg-red-500 hover:bg-red-800  rounded text-gray-200 font-semibold "
                onClick={handleDeleteItem}
              >
                Confirm
              </button>
            </div>
          </Modal>
        </div>
      </div>
    </React.Fragment>
  );
};
export default CommentsListing;
