import React, { useEffect, useState } from "react";
import Send from "../../../public/divami_icons/send.svg";
import Delete from "../../../public/divami_icons/delete.svg";
import Edit from "../../../public/divami_icons/edit.svg";
import {
  ActivityCardContainer,
  ActivityCard,
  ActivityHeader,
  ActivityStatusIcon,
  ActivityHeaderDivider,
  ActivityTimeStamp,
  ActivityCommentAddedBy,
  ActivityCommentAddedByMain,
  ActivityAddedComment,
  ActivityCommentDiv,
  ActivityComment,
  CommentActions,
  ReplyButton,
  RepliesContainer,
  ActivityBodyChild,
  ActivityBody,
  CommentsTitle,
  ActivityImageAvatar,
  CommentEditActions,
  CommentTitleName,
  CommentTitleWrapper,
  EditIconImage,
  DeleteconImage,
  ActivityCommentsDiv,
  ReplyDiv,
  ReplyDivText,
  ReplyCancel,
} from "./ActivityLogStyles";
import router from "next/router";
import {
  AddCommentContainerSecond,
  StyledInput,
  AddCommentButtonContainer,
  AttachButton,
  ImageErrorIcon,
  SendButton,
} from "../taskDetails/TaskDetailStyles";
import { CustomToast } from "../../divami_components/custom-toaster/CustomToast";
import {
  createCommentReply,
  editCommentReply,
  createComment,
  editComment,
  deleteComment,
  deleteCommentReply,
} from "../../../services/comments";
import PopupComponent from "../../popupComponent/PopupComponent";
import { Comments } from "../../../models/IComments";
interface IProps{
  backendComments:Comments[],
  getComments: (entityId: string) => Promise<void>
  setBackendComments: React.Dispatch<React.SetStateAction<Comments[]>>
}
const ActivityLog:React.FC<IProps> = ({backendComments,getComments,setBackendComments}) => {
  const [commentsData, setCommentsData] = useState(backendComments);
  const [autofocusState, setAutoFocusState] = useState(false);
  const [replyToText, setReplyToText] = useState("");
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
  const [searchingOnnew, setSearchingOnnew] = useState(false);
  const [currentCommentId, setCurrentCommentId] = useState("");
  const [commentId, setCommentId] = useState("");
  const [commentPopUp, setCommentPopup] = useState(false);
  const [commentReplyPopUp, setcommentReplyPopup] = useState(false);
  const [adding,setAdding] =useState(false)
  function sayHello(name: string) {
    setCurrentCommentId(name);
    // setSearchingOn(!searchingOn);
  }
  const getTimeText = (createdDate: string) => {
    let text = "";
    const date1: any = new Date(createdDate);
    const date2: any = new Date();
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.ceil(diffTime / (1000 * 60));
    const diffSec = Math.ceil(diffTime / 1000);
    if (diffSec < 60) {
      text = `few seconds ago`;
    } else if (diffMinutes < 60) {
      text = `${diffMinutes}m`;
    } else if (diffHours < 60) {
      text = `${diffHours - 1}h `;
    } else {
      text = `${diffDays - 1}d `;
    }
    return text;
  };
  useEffect(() => {
    const localStorageData = localStorage.getItem("userInfo");
    let userName = localStorageData ? localStorageData : "";
    const commentsList = backendComments.map((each: any) => {
      return {
        ...each,
        updatedTimeText: getTimeText(each.createdAt),
        showMoreText: true,
        showEdit: false,
        isEditAvailable: each.by?.fullName === userName,
        isDeleteAvailable: each.by?.fullName === userName,
        // isEditAvailable: each?.by?.fullName === user?.fullName,
        // isDeleteAvailable: each?.by?.fullName === user?.fullName,
        showDelete: false,
        replies: each.replies.map((item: any) => {
          return {
            ...item,
            updatedTimeText: getTimeText(item.createdAt),
            showMoreText: true,
            showEdit: false,
            showDelete: false,
            isEditAvailable: item?.by?.fullName === userName,
            isDeleteAvailable: item?.by?.fullName === userName,
          };
        }),
      };
    });
    setCommentsData(commentsList);
  if(adding === true)
  {
    console.log('caliigjhdsjk')
    const fileInput = document.getElementById(
      "DetailsWindow"
    ) as HTMLInputElement;
    if (fileInput) {
      setTimeout(()=>{
        fileInput.scrollTo (0,fileInput.scrollHeight);
      },100)
      
    }
  }
   
  }, [backendComments]);

  const cancelComment = () => {
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
  const saveRepliedComments = async (commentObj: any) => {
    if (commentsData?.length && commentObj?.data?.text) {
      createCommentReply(
        router.query.projectId as string,
        { reply: commentObj.data?.text },
        commentObj?.data?.commentId
      ).then((response) => {
        if (response.success === true) {
          CustomToast("Reply added successfully","success");
          getComments(commentsData[0]?.entity);
          setReplyToText("");
        }
      });
    }
  };

  const saveEditRepliedComments = async (commentObj: any) => {
    if (commentsData?.length && commentObj?.data?.text) {
      editCommentReply(
        router.query.projectId as string,
        { reply: commentObj.data?.text },
        commentObj.data?.commentId,
        commentObj.data?.replyId
      ).then((response) => {
        if (response.success === true) {
          CustomToast("Reply updated successfully","success");
          getComments(commentsData[0]?.entity);
          setReplyToText("");
        }
      });
    }
  };

  const saveEditComment = (commentObj: any) => {
    if (commentsData?.length && commentObj?.data?.text) {
      editComment(
        router.query.projectId as string,
        commentObj?.data?.commentId,
        {
          comment: commentObj.data?.text,
        }
      ).then((response) => {
        if (response.success === true) {
          CustomToast("Comment updated successfully","success");
          getComments(commentsData[0]?.entity);
        }
      });
    }
  };

  const saveAddedComments = async (commentObj: any) => {
    if (commentsData?.length && commentObj?.data?.text) {
      createComment(router.query.projectId as string, {
        comment: commentObj.data?.text,
        entity: commentsData[0]?.entity,
      }).then((response: any) => {
        if (response.success === true) {
          let commentsList:any = backendComments
          commentsList.push(response.result)
          setBackendComments(structuredClone(commentsList))
          setAdding(true)
          CustomToast("Comment added successfully","success");
        }
      });
    }
  };

  const deleteComments = async (commentId: string) => {
    if (commentId) {
      deleteComment(router.query.projectId as string, commentId).then(
        (response: any) => {
          if (response.success === true) {
            CustomToast("Comment deleted successfully","success");
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

  const deletePopup = async (commentId: string) => {
    console.log("deletePopup", commentId);
  };

  const deleteReplyComments = async (commentId: string, replyId: string) => {
    if (commentId && replyId) {
      deleteCommentReply(
        router.query.projectId as string,
        commentId,
        replyId
      ).then((response: any) => {
        if (response.success === true) {
          CustomToast("Reply deleted successfully","success");
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
    <ActivityCardContainer data-testid="const-custom-activity-log-issue">
      {commentsData.length ? <CommentsTitle>Comments</CommentsTitle> : <></>}
      {commentsData?.map((each: any, index: number) => {
        return (
          <ActivityCard key={index}>
            <ActivityCommentsDiv>
              <ActivityHeader>
                <ActivityStatusIcon>
                  <ActivityImageAvatar
                    src={each?.by?.avatar}
                    width={30}
                    height={30}
                    alt={""}
                  />
                </ActivityStatusIcon>

                <CommentTitleWrapper
                  onMouseOver={() => {
                    setCommentsData((prev: any) => {
                      return prev.map((item: any) => {
                        if (item._id == each._id) {
                          return {
                            ...item,
                            showEdit: item.isEditAvailable,
                            showDelete: item.isDeleteAvailable,
                          };
                        } else {
                          return {
                            ...item,
                          };
                        }
                      });
                    });
                  }}
                  onMouseOut={() => {
                    setCommentsData((prev: any) => {
                      return prev.map((item: any) => {
                        if (item._id == each._id) {
                          return {
                            ...item,
                            showEdit: false,
                            showDelete: false,
                          };
                        } else {
                          return {
                            ...item,
                          };
                        }
                      });
                    });
                  }}
                >
                  <CommentTitleName>
                    <ActivityCommentAddedByMain>
                      {each.by?.firstName}
                    </ActivityCommentAddedByMain>
                    {/* <ActivityHeaderDivider>{" | "}</ActivityHeaderDivider> */}
                    <ActivityTimeStamp>
                      {each.updatedTimeText}
                      {/* {moment(each.createdAt).format("DD MMM YY")} */}
                    </ActivityTimeStamp>
                  </CommentTitleName>
                  {each.isEditAvailable &&
                  each.isDeleteAvailable &&
                  each.showEdit &&
                  each.showDelete ? (
                    <CommentEditActions>
                      <EditIconImage
                        src={Edit}
                        alt={"close icon"}
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
                      />

                      <DeleteconImage
                        src={Delete}
                        alt={"close icon"}
                        onClick={() => {
                          setReplyToText('')
                          setCommentId(each?._id)
                          setCommentPopup(true);
                        }}
                      />   
                    </CommentEditActions>
                  ) : (
                    <></>
                  )}
                   {commentPopUp && (
                       <PopupComponent
                       open={commentPopUp}
                       setShowPopUp={setCommentPopup}
                       modalTitle={"Delete Comment"}
                       // modalmessage={`Are you sure you want to delete this Task "${selectedTask.type}(#${selectedTask._id})"?`}
                       modalmessage={`Are you sure you want to delete this comment?`}
                       primaryButtonLabel={"Delete"}
                       SecondaryButtonlabel={"Cancel"}
                       callBackvalue={() => {
                         setCommentPopup(false);
                         deleteComments(commentId);
                       }}
                     /> 
                      )} 
                </CommentTitleWrapper>
              </ActivityHeader>

              <ActivityBody
                textEachMore={each?.showMoreText}
                searchingOnnew={searchingOnnew}
                currentCommentId={currentCommentId}
                commentId={each?._id}
              >
                <ActivityCommentAddedBy>
                  <>
                    <ActivityCommentDiv>
                      <ActivityComment>{`${each.comment}`}</ActivityComment>
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
                            setReplyToText(`Replying to ${each.by?.firstName}`);
                          }}
                        >
                          Reply
                        </ReplyButton>
                        {each.replies?.length ? (
                          <>
                            <ActivityHeaderDivider>
                              {" | "}
                            </ActivityHeaderDivider>
                            <ReplyButton
                              onClick={() => {
                                const commentsList = commentsData.map(
                                  (item: any) => {
                                    return {
                                      ...item,
                                      showMoreText:
                                        each._id == item._id
                                          ? !item.showMoreText
                                          : true,
                                    };
                                  }
                                );
                                setCommentsData(commentsList);
                                // setSearchingOn(!searchingOn);

                                sayHello(each?._id);
                              }}
                            >
                              {each.showMoreText
                                ? `Show ${each?.replies?.length} more ${
                                    each.replies.length >= 2
                                      ? "replies"
                                      : "reply"
                                  } `
                                : `Hide ${
                                    each?.replies?.length >= 2
                                      ? "replies"
                                      : "reply"
                                  } `}
                              {/* "Hide Replies" */}
                            </ReplyButton>
                          </>
                        ) : (
                          <></>
                        )}
                        {/* <ReplyButton
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
                      <ActivityHeaderDivider>{" | "}</ActivityHeaderDivider>
                      <ReplyButton
                        onClick={() => {
                          deleteComments(each?._id);
                        }}
                      >
                        Delete
                      </ReplyButton> */}
                      </CommentActions>
                      {!each.showMoreText &&
                        each.replies?.map((replyObj: any) => {
                          return (
                            <RepliesContainer key={`${replyObj._id}`}>
                              <ActivityCard key={index}>
                                <ActivityHeader
                                  onMouseOver={() => {
                                    setCommentsData((prev: any) => {
                                      return prev.map((item: any) => {
                                        if (item._id == each._id) {
                                          return {
                                            ...item,
                                            replies: item.replies.map(
                                              (replyIter: any) => {
                                                if (
                                                  replyIter?._id ==
                                                  replyObj?._id
                                                ) {
                                                  return {
                                                    ...replyIter,
                                                    showEdit:
                                                      replyObj.isEditAvailable,
                                                    showDelete:
                                                      replyObj.isDeleteAvailable,
                                                  };
                                                } else {
                                                  return {
                                                    ...replyIter,
                                                  };
                                                }
                                              }
                                            ),
                                          };
                                        } else {
                                          return {
                                            ...item,
                                          };
                                        }
                                      });
                                    });
                                  }}
                                  onMouseOut={() => {
                                    setCommentsData((prev: any) => {
                                      return prev.map((item: any) => {
                                        if (item._id == each._id) {
                                          return {
                                            ...item,
                                            replies: item.replies.map(
                                              (replyIter: any) => {
                                                if (
                                                  replyIter?._id ==
                                                  replyObj?._id
                                                ) {
                                                  return {
                                                    ...replyIter,
                                                    showEdit: false,
                                                    showDelete: false,
                                                  };
                                                } else {
                                                  return {
                                                    ...replyIter,
                                                  };
                                                }
                                              }
                                            ),
                                          };
                                        } else {
                                          return {
                                            ...item,
                                          };
                                        }
                                      });
                                    });
                                  }}
                                >
                                  <ActivityStatusIcon>
                                    <ActivityImageAvatar
                                      src={replyObj?.by?.avatar}
                                      alt={""}
                                      width={30}
                                      height={30}
                                    />
                                  </ActivityStatusIcon>
                                  {/* <ActivityStatusTitle>
                                  Reply Added
                                </ActivityStatusTitle> */}

                                  {/* <ActivityHeaderDivider>
                                  {" | "}
                                </ActivityHeaderDivider> */}
                                  <CommentTitleName>
                                    <ActivityCommentAddedByMain>
                                      {replyObj?.by?.firstName}
                                    </ActivityCommentAddedByMain>

                                    <ActivityTimeStamp>
                                      {replyObj.updatedTimeText}

                                      {/* {moment(replyObj?.createdAt).format(
                                    "DD MMM YY"
                                  )} */}
                                    </ActivityTimeStamp>
                                  </CommentTitleName>
                                  {replyObj.showEdit &&
                                  replyObj.showDelete &&
                                  replyObj.isEditAvailable &&
                                  replyObj.isDeleteAvailable ? (
                                    <CommentEditActions>
                                      <EditIconImage
                                        src={Edit}
                                        alt={"close icon"}
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
                                      />

                                      {/* <ActivityHeaderDivider>{" | "}</ActivityHeaderDivider> */}
                                      <DeleteconImage
                                        src={Delete}
                                        alt={"close icon"}
                                        onClick={() => {
                                          // deleteReplyComments(
                                          //   replyObj?.commentId,
                                          //   replyObj?._id
                                          // );
                                          setReplyToText('')
                                          setcommentReplyPopup(true);
                                        }}
                                      />

                                    
                                    </CommentEditActions>
                                  ) : (
                                    <></>
                                  )}
                              {commentReplyPopUp && (
                                      <PopupComponent
                                        open={commentReplyPopUp}
                                        setShowPopUp={setcommentReplyPopup}
                                        modalTitle={"Delete Reply"}
                                        // modalmessage={`Are you sure you want to delete this Task "${selectedTask.type}(#${selectedTask._id})"?`}
                                        modalmessage={`Are you sure you want to delete this reply?`}
                                        primaryButtonLabel={"Delete"}
                                        SecondaryButtonlabel={"Cancel"}
                                        callBackvalue={() => {
                                          setcommentReplyPopup(false);
                                          deleteReplyComments(
                                            replyObj?.commentId,
                                            replyObj?._id
                                          );
                                        }}
                                      />
                                      )}      
                                </ActivityHeader>

                                <ActivityBodyChild>
                                  <ActivityCommentAddedBy>
                                    <>
                                      {/* <ActivityAddedComment>
                                      added a reply
                                    </ActivityAddedComment> */}
                                      <ActivityCommentDiv>
                                        <ActivityComment>{`${replyObj.reply}`}</ActivityComment>
                                      </ActivityCommentDiv>
                                      {/* <CommentActions>
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
                                    <ActivityHeaderDivider>
                                      {" | "}
                                    </ActivityHeaderDivider>
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
                                  </CommentActions> */}
                                    </>
                                  </ActivityCommentAddedBy>
                                </ActivityBodyChild>
                              </ActivityCard>
                            </RepliesContainer>
                          );
                        })}
                    </ActivityCommentDiv>
                  </>
                </ActivityCommentAddedBy>
              </ActivityBody>
              {/* )} */}
            </ActivityCommentsDiv>
          </ActivityCard>
        );
      })}
      {commentsData.length ? (
        <>
          {replyToText ? (
            <ReplyDiv>
              <ReplyDivText> {replyToText}</ReplyDivText>

              <ReplyCancel
                onClick={() => {
                  cancelComment();
                  setReplyToText("");
                }}
              >
                Cancel
              </ReplyCancel>
            </ReplyDiv>
          ) : (
            ""
          )}

          {/* {replyToText ? replyToText : ""} */}
          <AddCommentContainerSecond>
            <StyledInput
              id="standard-basic"
              variant="standard"
              placeholder={replyToText ? "Add Reply" : "Add Comment"}
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
              onKeyDown={(e) => {
                if (e.key == "Enter") {
                  let commentText = commentInputData?.data?.text?.trim();
                  let newObj = { ...commentInputData };
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
                  if (commentText) {
                    if (commentInputData?.isReply) {
                      saveRepliedComments(newObj);
                    } else if (commentInputData?.isEdit) {
                      saveEditComment(newObj);
                    } else if (commentInputData?.isEditReply) {
                      saveEditRepliedComments(newObj);
                    } else {
                      saveAddedComments(newObj);
                    }
                  }
                } else if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                  e.stopPropagation();
                }
              }}
            />
            <AddCommentButtonContainer>
              <SendButton
                onClick={() => {
                  let commentText = commentInputData?.data?.text?.trim();
                  let newObj = { ...commentInputData };
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
                  if (commentText) {
                    if (commentInputData?.isReply) {
                      saveRepliedComments(newObj);
                    } else if (commentInputData?.isEdit) {
                      saveEditComment(newObj);
                    } else if (commentInputData?.isEditReply) {
                      saveEditRepliedComments(newObj);
                    } else {
                      saveAddedComments(newObj);
                    }
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
