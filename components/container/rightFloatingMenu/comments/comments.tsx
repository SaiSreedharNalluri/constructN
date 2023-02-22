import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Comments } from '../../../../models/IComments';
import {
  createComment,
  createCommentReply,
  deleteComment,
  editComment,
  getCommentsList,
} from '../../../../services/comments';
import CommentForm from './commentForm';
import CommentsListing from './commentsListing';
interface IProps {
  entityId: string;
}
const Comments: React.FC<IProps> = ({ entityId }) => {
  const router = useRouter();
  const [backendComments, setBackendComments] = useState<Comments[]>([]);
  const [activeComment, setActiveComment] = useState<{
    _id: string;
    type: string;
  } | null>(null);
  useEffect(() => {
    if (router.isReady) {
      getCommentsList(entityId)
        .then((response) => {
          if (response.success === true) {
            setBackendComments(response.result);
          }
        })
        .catch((error) => {
          toast.error('failed to load the data');
        });
    }
  }, [entityId, router.isReady]);
  const addComment = (text: string) => {
    createComment({
      comment: text,
      entity: entityId,
    }).then((response) => {
      if (response.success === true) {
        toast.success('Comment is added sucessfully');
        setBackendComments([response.result, ...backendComments]);
      }
    });
  };
  const updateComment = (text: string, commentId: string, type: string) => {
    if (type === 'comments') {
      editComment(commentId, { comment: text }).then((response) => {
        if (response.success === true) {
          toast.success('Comment is updated sucessfully');
          const updatedBackendComments = backendComments.map(
            (backendComment) => {
              if (backendComment._id === commentId) {
                return { ...backendComment, comment: text };
              }
              return backendComment;
            }
          );
          setBackendComments(updatedBackendComments);
          setActiveComment(null);
        }
      });
    } else if (type === 'reply') {
    }
  };
  const addReplyToComment = (text: string, commentId: string) => {
    createCommentReply({ reply: text }, commentId).then((response) => {
      if (response.success === true) {
        toast.success(response.message);
        const indexOfUserToReplace = backendComments.findIndex(
          (comment) => comment._id === commentId
        );
        if (indexOfUserToReplace !== -1) {
          backendComments[indexOfUserToReplace] = response.result;
        }
        setBackendComments(backendComments);
        setActiveComment(null);
      }
    });
  };
  const deleteComments = (commentId: string) => {
    deleteComment(commentId).then((response) => {
      if (response.success === true) {
        toast.success('Comment is deleted sucessfully');
        const updatedBackendComments = backendComments.filter(
          (backendComment) => backendComment._id !== commentId
        );
        setBackendComments(updatedBackendComments);
      }
    });
  };
  return (
    <React.Fragment>
      <div>
        <h1 className="font-bold ">Comments</h1>
        <h4>Write comment</h4>
        <CommentForm
          submitLabel="Add Comment"
          handleSubmit={addComment}
          handleCancel={() => {}}
        />
        <div>
          {backendComments.map((commentObj: Comments) => {
            return (
              <CommentsListing
                key={commentObj._id}
                comment={commentObj}
                updateComment={updateComment}
                activeComment={activeComment}
                setActiveComment={setActiveComment}
                addReplyToComment={addReplyToComment}
                deleteComment={deleteComments}
              />
            );
          })}
        </div>
      </div>
    </React.Fragment>
  );
};
export default Comments;
