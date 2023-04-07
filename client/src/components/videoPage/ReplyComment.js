import React from "react";
import SingleComment from "./SingleComment";
import CustomButton from "../../UI/Button";
import { FaCaretUp, FaCaretDown } from "react-icons/fa";

export default function ReplyComment(props) {
  let {
    commentLists,
    parentCommentId,
    hostCommentId,
    episode,
    refreshFunction,
  } = props;

  const [childCommentNumber, setChildcommentNumber] = React.useState(0);
  const [openReplyComments, setOpenReplyComments] = React.useState(false);

  React.useEffect(() => {
    const commentNumber = commentLists.reduce((acc, comment) => {
      if (comment.host && comment.host === hostCommentId) {
        return acc + 1;
      }
      return acc + 0;
    }, 0);

    setChildcommentNumber(commentNumber);
  }, [commentLists]);

  let renderReplyComment = (parentCommentId) =>
    commentLists.reverse().map((comment, index) => (
      <React.Fragment key={comment._id}>
        {comment.host === hostCommentId && (
          <div>
            <SingleComment
              comment={comment}
              episode={episode}
              refreshFunction={refreshFunction}
              hostCommentId={hostCommentId}
            />
          </div>
        )}
      </React.Fragment>
    ));

  const trigger = () => (
    <div className="content">
      {openReplyComments ? <FaCaretDown /> : <FaCaretUp />}
      <div className="text">{`view ${childCommentNumber} more comments`}</div>
    </div>
  );

  const handleChange = () => {
    setOpenReplyComments(!openReplyComments);
  };

  return (
    <>
      {/* childCommentNumber = 0的時候 condition會印出0 */}
      {/* 或是使用ternary operator, false時回傳null */}
      {!!childCommentNumber && childCommentNumber > 0 && (
        <div className="viewMoreContainer">
          <CustomButton
            children={trigger()}
            height="30px"
            width="auto"
            onClick={handleChange}
          />
        </div>
      )}
      {openReplyComments && (
        <div className="replyContainer" style={{ marginLeft: "50px" }}>
          {renderReplyComment(parentCommentId)}
        </div>
      )}
    </>
  );
}
