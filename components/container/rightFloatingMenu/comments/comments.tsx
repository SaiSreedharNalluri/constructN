import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Comments } from '../../../../models/IComments';
import { createComment, getCommentsList } from '../../../../services/comments';
import CommentForm from './commentForm';
import CommentsListing from './commentsListing';
interface IProps {
  entityId: string;
}
const Comments: React.FC<IProps> = ({ entityId }) => {
  const router = useRouter();
  const [backendComments, setBackendComments] = useState<Comments[]>([]);
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
              <CommentsListing key={commentObj._id} comment={commentObj} />
            );
          })}
        </div>
      </div>
    </React.Fragment>
  );
};
export default Comments;
