import React, { useEffect, useState } from "react";
import Image from "next/image";
import IssuesUpdated from "../../../public/divami_icons/issueUpdated.svg";
import CommentAdded from "../../../public/divami_icons/commentAdded.svg";
import IssueRaised from "../../../public/divami_icons/issueRaised.svg";
import RfiRaised from "../../../public/divami_icons/rfiRaised.svg";
import RfiUpdated from "../../../public/divami_icons/rfiUpdated.svg";
import ScanUpdated from "../../../public/divami_icons/scanUpdated.svg";
import ImageScreenShot from "../../../public/divami_icons/imageScreenShot.svg";
import Clip from "../../../public/divami_icons/clip.svg";
import Send from "../../../public/divami_icons/send.svg";

import {
  ActivityCardContainer,
  ActivityCard,
  ActivityHeader,
  ActivityStatusIcon,
  ActivityStatusTitle,
  ActivityHeaderDivider,
  ActivityBody,
  ActivityTimeStamp,
  ActivityBodyIssueRaisedCase,
  ActivityCommentAddedBy,
  ActivityCommentAddedByMain,
  ActivityAddedComment,
  ActivityCommentDiv,
  ActivityComment,
  ActivityIssueRaisedMain,
  ActivityCreated,
  ActivityIssueType,
  ActivityFor,
  IssuesDescription,
  ActivityScanUploadBox,
  ActivityIssueRaisedMainProfile,
  ActivityCurrentProgress,
  ActivityImageSection,
  ActivityImage,
  ActivityScreenShotIconContainer,
  CommentActions,
  ReplyButton,
  RepliesContainer,
} from "./ActivityLogStyles";
import moment from "moment";
import router from "next/router";

import {
  AddCommentContainerSecond,
  StyledInput,
  AddCommentButtonContainer,
  AttachButton,
  ImageErrorIcon,
  SendButton,
} from "./TaskDetailStyles";
import { text } from "@fortawesome/fontawesome-svg-core";
import { toast } from "react-toastify";
import {
  createCommentReply,
  editCommentReply,
  createComment,
  editComment,
  deleteComment,
  deleteCommentReply,
} from "../../../services/comments";

const ActivityLog = (props: any) => {
  const { ActivityLog, comments, getComments } = props;
  const [commentsData, setCommentsData] = useState(comments);
  const [autofocusState, setAutoFocusState] = useState(false);
  const [commentInputData, setCommentInputData] = useState({
    isReply: false,
    isEdit: false,
    isEditReply: false,
    data: {
      text: "",
      attachments: "",
      commentId: "",
      replyId: "",
    },
  });
  useEffect(() => {
    console.log(comments, "cdsomnets");

    setCommentsData(comments);
  }, [comments]);

  const saveRepliedComments = async () => {
    console.log(commentInputData, "kokokok");
    createCommentReply(
      router.query.projectId as string,
      { reply: commentInputData.data?.text },
      commentInputData?.data?.commentId
    ).then((response) => {
      if (response.success === true) {
        toast("Reply added sucessfully");
        getComments(commentsData[0]?.entity);
      }
    });

    setCommentInputData({
      isReply: false,
      isEdit: false,
      isEditReply: false,
      data: {
        text: "",
        attachments: "",
        commentId: "",
        replyId: "",
      },
    });
  };

  const saveEditRepliedComments = async () => {
    if (commentsData?.length && commentInputData?.data?.text) {
      editCommentReply(
        router.query.projectId as string,
        { reply: commentInputData.data?.text },
        commentInputData.data?.commentId,
        commentInputData.data?.replyId
      ).then((response) => {
        if (response.success === true) {
          toast("Reply updated sucessfully");
          getComments(commentsData[0]?.entity);
        }
      });
      setCommentInputData({
        isReply: false,
        isEdit: false,
        isEditReply: false,
        data: {
          text: "",
          attachments: "",
          commentId: "",
          replyId: "",
        },
      });
    }
  };

  const saveEditComment = () => {
    if (commentsData?.length && commentInputData?.data?.text) {
      editComment(
        router.query.projectId as string,
        commentInputData?.data?.commentId,
        {
          comment: commentInputData.data?.text,
        }
      ).then((response) => {
        if (response.success === true) {
          toast("Comment updated sucessfully");
          getComments(commentsData[0]?.entity);
        }
      });

      setCommentInputData({
        isReply: false,
        isEdit: false,
        isEditReply: false,
        data: {
          text: "",
          attachments: "",
          commentId: "",
          replyId: "",
        },
      });
    }
  };

  const saveAddedComments = async () => {
    if (commentsData?.length && commentInputData?.data?.text) {
      createComment(router.query.projectId as string, {
        comment: commentInputData.data?.text,
        entity: commentsData[0]?.entity,
      }).then((response: any) => {
        if (response.success === true) {
          toast("Comment added sucessfully");
          getComments(commentsData[0]?.entity);
        }

        setCommentInputData({
          isReply: false,
          isEdit: false,
          isEditReply: false,
          data: {
            text: "",
            attachments: "",
            commentId: "",
            replyId: "",
          },
        });
      });
    }
  };

  const deleteComments = async (commentId: string) => {
    if (commentId) {
      deleteComment(router.query.projectId as string, commentId).then(
        (response: any) => {
          if (response.success === true) {
            toast("Comment Deleted sucessfully");
            getComments(commentsData[0]?.entity);

            // setBackendComments([...backendComments, response.result]);
          }

          setCommentInputData({
            isReply: false,
            isEdit: false,
            isEditReply: false,
            data: {
              text: "",
              attachments: "",
              commentId: "",
              replyId: "",
            },
          });
        }
      );
    }
  };

  const deleteReplyComments = async (commentId: string, replyId: string) => {
    if (commentId && replyId) {
      deleteCommentReply(
        router.query.projectId as string,
        commentId,
        replyId
      ).then((response: any) => {
        if (response.success === true) {
          toast("Reply deleted sucessfully");
          getComments(commentsData[0]?.entity);

          // setBackendComments([...backendComments, response.result]);
        }

        setCommentInputData({
          isReply: false,
          isEdit: false,
          isEditReply: false,
          data: {
            text: "",
            attachments: "",
            commentId: "",
            replyId: "",
          },
        });
      });
    }
  };

  return (
    <ActivityCardContainer>
      {commentsData?.map((each: any, index: number) => {
        return (
          <ActivityCard key={index}>
            <ActivityHeader>
              <ActivityStatusIcon>
                <Image
                  src={
                    CommentAdded
                    // each.status === "Issue Raised"
                    //   ? IssueRaised
                    //   : each.status === "Issue Updated"
                    //   ? IssuesUpdated
                    //   : each.status === "Comment Added"
                    //   ? CommentAdded
                    //   : each.status === "RFI Updated"
                    //   ? RfiUpdated
                    //   : each.status === "RFI Raised"
                    //   ? RfiRaised
                    //   : each.status === "Scan Updated"
                    //   ? ScanUpdated
                    //   : ""
                  }
                  alt={""}
                />
              </ActivityStatusIcon>
              {/* <ActivityStatusTitle>{each.status}</ActivityStatusTitle> */}
              <ActivityStatusTitle>Comment Added</ActivityStatusTitle>

              <ActivityHeaderDivider>{" | "}</ActivityHeaderDivider>
              <ActivityTimeStamp>
                {moment(each.createdAt).format("DD MMM YY")}
              </ActivityTimeStamp>
            </ActivityHeader>
            <ActivityBodyIssueRaisedCase>
              <ActivityCommentAddedBy>
                <>
                  <ActivityCommentAddedByMain>
                    {each.by?.firstName}
                  </ActivityCommentAddedByMain>
                  <ActivityAddedComment>added a Comment</ActivityAddedComment>
                  <ActivityCommentDiv>
                    <ActivityComment>{`"${each.comment}"`}</ActivityComment>
                    <CommentActions>
                      <ReplyButton
                        onClick={() => {
                          setAutoFocusState(true);
                          setCommentInputData((prev: any) => {
                            return {
                              ...prev,
                              isReply: true,
                              isEdit: false,
                              data: {
                                ...prev.data,
                                text: "",
                                commentId: each?._id,
                              },
                            };
                          });
                        }}
                      >
                        Reply
                      </ReplyButton>
                      <ReplyButton
                        onClick={() => {
                          setCommentInputData((prev: any) => {
                            return {
                              ...prev,
                              isEdit: true,
                              data: {
                                ...prev.data,
                                commentId: each?._id,
                                text: each.comment,
                              },
                              isReply: false,
                            };
                          });
                        }}
                      >
                        Edit
                      </ReplyButton>
                      <ReplyButton
                        onClick={() => {
                          deleteComments(each?._id);
                        }}
                      >
                        Delete
                      </ReplyButton>
                    </CommentActions>
                    {each.replies?.map((replyObj: any) => {
                      return (
                        <RepliesContainer>
                          <ActivityCard key={index}>
                            <ActivityHeader>
                              <ActivityStatusIcon>
                                <Image src={CommentAdded} alt={""} />
                              </ActivityStatusIcon>
                              <ActivityStatusTitle>
                                Reply Added
                              </ActivityStatusTitle>

                              <ActivityHeaderDivider>
                                {" | "}
                              </ActivityHeaderDivider>
                              <ActivityTimeStamp>
                                {moment(replyObj?.createdAt).format(
                                  "DD MMM YY"
                                )}
                              </ActivityTimeStamp>
                            </ActivityHeader>

                            <ActivityBody>
                              <ActivityCommentAddedBy>
                                <>
                                  <ActivityCommentAddedByMain>
                                    {replyObj?.by?.firstName}
                                  </ActivityCommentAddedByMain>
                                  <ActivityAddedComment>
                                    added a reply
                                  </ActivityAddedComment>
                                  <ActivityCommentDiv>
                                    <ActivityComment>{`"${replyObj.reply}"`}</ActivityComment>
                                  </ActivityCommentDiv>
                                  <CommentActions>
                                    <ReplyButton
                                      onClick={() => {
                                        setCommentInputData((prev: any) => {
                                          return {
                                            ...prev,
                                            isEditReply: true,
                                            data: {
                                              ...prev.data,
                                              replyId: replyObj?._id,
                                              text: replyObj?.reply,
                                              commentId: replyObj?.commentId,
                                            },
                                            isReply: false,
                                          };
                                        });
                                      }}
                                    >
                                      Edit
                                    </ReplyButton>
                                    <ReplyButton
                                      onClick={() => {
                                        deleteReplyComments(
                                          replyObj?.commentId,
                                          replyObj?._id
                                        );
                                      }}
                                    >
                                      Delete
                                    </ReplyButton>
                                  </CommentActions>
                                </>
                              </ActivityCommentAddedBy>
                            </ActivityBody>
                          </ActivityCard>
                        </RepliesContainer>
                      );
                    })}
                  </ActivityCommentDiv>
                </>
              </ActivityCommentAddedBy>
            </ActivityBodyIssueRaisedCase>
          </ActivityCard>
        );
      })}
      {commentsData.length ? (
        <>
          <AddCommentContainerSecond>
            <StyledInput
              id="standard-basic"
              variant="standard"
              placeholder="Add Comment"
              value={commentInputData?.data?.text}
              // autoFocus={true}
              inputRef={(input) => {
                if (autofocusState) {
                  input && input.focus();
                }
              }}
              onChange={(e) => {
                setCommentInputData((prev: any) => {
                  return {
                    ...prev,
                    data: {
                      ...prev.data,
                      text: e.target.value,
                    },
                  };
                });
              }}
            />
            <AddCommentButtonContainer>
              {/* <AttachButton>
              <ImageErrorIcon src={Clip} alt="" />
              <input
                type="file"
                onChange={(e: any) => {
                  if (e.target.files) {
                    setCommentInputData((prev: any) => {
                      return {
                        ...prev,
                        data: {
                          attachments: e.target.files[0],
                        },
                      };
                    });
                  }
                }}
              />
            </AttachButton> */}
              <SendButton
                onClick={() => {
                  if (commentInputData?.isReply) {
                    saveRepliedComments();
                  } else if (commentInputData?.isEdit) {
                    saveEditComment();
                  } else if (commentInputData?.isEditReply) {
                    saveEditRepliedComments();
                  } else {
                    saveAddedComments();
                  }
                }}
              >
                <ImageErrorIcon src={Send} alt="" />
              </SendButton>
            </AddCommentButtonContainer>
          </AddCommentContainerSecond>
        </>
      ) : (
        <></>
      )}
    </ActivityCardContainer>
  );
};

export default ActivityLog;
