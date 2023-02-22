import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Comments } from '../../../../models/IComments';
import {
  createComment,
  createCommentReply,
  deleteComment,
  deleteCommentReply,
  editComment,
  editCommentReply,
  getCommentsList,
} from '../../../../services/comments';
import CommentForm from './commentForm';
import CommentsListing from './commentsListing';
interface IProps {
  entityId: string;
  currentProject: string;
}
const Comments: React.FC<IProps> = ({ entityId, currentProject }) => {
  const router = useRouter();
  const [backendComments, setBackendComments] = useState<Comments[]>([]);
  const [activeComment, setActiveComment] = useState<{
    _id: string;
    type: string;
  } | null>(null);
  const [myProject, setMyProject] = useState(currentProject);
  useEffect(() => {
    if (router.isReady) {
      if (router.query.projectId)
        getCommentsList(router.query.projectId as string, entityId)
          .then((response) => {
            if (response.success === true) {
              setBackendComments(response.result);
            }
          })
          .catch((error) => {
            toast.error('failed to load the data');
          });
    }
  }, [entityId, router.isReady, router.query.projectId]);
  const addComment = (text: string) => {
    createComment(router.query.projectId as string, {
      comment: text,
      entity: entityId,
    }).then((response) => {
      if (response.success === true) {
        toast.success('Comment is added sucessfully');
        setBackendComments([response.result, ...backendComments]);
      }
    });
  };
  const updateComment = (text: string, comment: any) => {
    if (comment.commentId) {
      editCommentReply(
        router.query.projectId as string,
        { reply: text },
        comment.commentId,
        comment._id
      ).then((response) => {
        if (response.success === true) {
          toast.success('Comment reply is updated sucessfully');
        }
      });
    } else {
      editComment(router.query.projectId as string, comment._id, {
        comment: text,
      }).then((response) => {
        if (response.success === true) {
          toast.success('Comment is updated sucessfully');
          const updatedBackendComments = backendComments.map(
            (backendComment) => {
              if (backendComment._id === comment._id) {
                return { ...backendComment, comment: text };
              }
              return backendComment;
            }
          );
          setBackendComments(updatedBackendComments);
          setActiveComment(null);
        }
      });
    }
  };
  const addReplyToComment = (text: string, commentId: string) => {
    createCommentReply(
      router.query.projectId as string,
      { reply: text },
      commentId
    ).then((response) => {
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
  const deleteComments = (comment: any) => {
    if (comment.comment) {
      deleteCommentReply(
        router.query.projectId as string,
        comment.commentId,
        comment._id
      ).then((response) => {
        if (response.success === true) {
          toast.success('Comment reply is deleted sucessfully');
        }
      });
    } else {
      deleteComment(router.query.projectId as string, comment._id).then(
        (response) => {
          if (response.success === true) {
            toast.success('Comment is deleted sucessfully');
            const updatedBackendComments = backendComments.filter(
              (backendComment) => backendComment._id !== comment._id
            );
            setBackendComments(updatedBackendComments);
          }
        }
      );
    }
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
