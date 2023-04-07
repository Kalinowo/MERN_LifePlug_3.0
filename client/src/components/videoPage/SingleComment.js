import React from "react";
import CustomButton from "../../UI/Button";
import CommentService from "../../services/comment.service";
import LikeDislikes from "./LikeDislikes";

export default function SingleComment(props) {
  let { comment, episode, refreshFunction, hostCommentId } = props;
  const [commentValue, setCommentValue] = React.useState("");
  const [openReply, setOpenReply] = React.useState(false);

  const handleChange = (e) => {
    setCommentValue(e.currentTarget.value);
  };

  const onSubmit = (e, user) => {
    console.log(user);
    e.preventDefault();
    const variable = {
      content: commentValue,
      episode: episode,
      responseTo: user,
      host: hostCommentId,
    };
    CommentService.post(variable).then((res) => {
      refreshFunction(res.data);
      setOpenReply(false);
      setCommentValue("");
    });
  };

  return (
    <>
      <div className="commentContainer">
        <div className="avatarBox">
          <img className="img" src={comment.writer.picture} alt="" />
        </div>
        <div className="contentBox">
          <div className="userAndDate">{`${comment.writer.username} ${new Date(
            comment.createdAt
          ).toLocaleString("zh-TW", {
            hour12: false,
          })}`}</div>
          <div className="textContent">
            {comment.responseTo ? (
              <div className="responseTo">{`@${comment.responseTo}`}</div>
            ) : null}
            <div>{comment.content}</div>
          </div>
          <LikeDislikes commentId={comment._id} />
          <CustomButton
            children="reply"
            onClick={() => setOpenReply(!openReply)}
          />
          {openReply && (
            <form className="replyBox" onSubmit={onSubmit}>
              <textarea
                className="reply"
                value={commentValue}
                onChange={handleChange}
                placeholder="write some comments..."
              />
              <div className="btnContainer">
                <CustomButton
                  children="submit"
                  onClick={(e, user) => onSubmit(e, comment.writer.username)}
                />
                <CustomButton
                  children="cancel"
                  onClick={() => setOpenReply(!openReply)}
                />
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
