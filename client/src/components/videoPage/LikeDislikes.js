import React, { useState } from "react";
import likeService from "../../services/like.service";
import {
  FaThumbsUp,
  FaThumbsDown,
  FaRegThumbsUp,
  FaRegThumbsDown,
} from "react-icons/fa";

export default function LikeDislikes(props) {
  let { commentId } = props;
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [likeAction, setLikeAction] = useState(null);
  const [dislikeAction, setDislikeAction] = useState(null);

  React.useEffect(() => {
    likeService.getLikes(commentId).then((res) => {
      setLikes((prev) => prev + res.data.length);
      res.data.forEach((like) => {
        if (like.userId === JSON.parse(localStorage.getItem("user")).user._id) {
          setLikeAction("liked");
        }
      });
    });

    likeService.getDislikes(commentId).then((res) => {
      setDislikes((prev) => prev + res.data.length);

      res.data.forEach((dislike) => {
        if (
          dislike.userId === JSON.parse(localStorage.getItem("user")).user._id
        ) {
          setDislikeAction("disliked");
        }
      });
    });
  }, [commentId]);

  const onLike = () => {
    if (likeAction === null) {
      likeService
        .uplike(commentId)
        .then((res) => {
          setLikes((prev) => prev + 1);
          setLikeAction("liked");
          if (dislikeAction !== null) {
            setDislikeAction(null);
            setDislikes((prev) => prev - 1);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      likeService
        .unlike(commentId)
        .then((res) => {
          setLikes((prev) => prev - 1);
          setLikeAction(null);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const onDislike = () => {
    if (dislikeAction !== null) {
      likeService
        .undislike(commentId)
        .then((res) => {
          setDislikes((prev) => prev - 1);
          setDislikeAction(null);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      likeService
        .updislike(commentId)
        .then((res) => {
          setDislikes((prev) => prev + 1);
          setDislikeAction("disliked");
          if (likeAction !== null) {
            setLikeAction(null);
            setLikes((prev) => prev - 1);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <div className="thumbs">
      <span onClick={onLike}>
        {likeAction === "liked" ? <FaThumbsUp /> : <FaRegThumbsUp />}
      </span>
      <span>{likes}</span>
      <span onClick={onDislike}>
        {dislikeAction === "disliked" ? <FaThumbsDown /> : <FaRegThumbsDown />}
      </span>
      <span>{dislikes}</span>
    </div>
  );
}
