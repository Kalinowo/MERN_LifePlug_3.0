import React from "react";
import { GlobalContext } from "../../context/GlobalState";
import HistoryService from "../../services/history.service";
import AnimeService from "../../services/anime.Service";
import { useNavigate } from "react-router-dom";

import Youtube from "react-youtube";

export default function YouTube(props) {
  const { currentUser } = React.useContext(GlobalContext);
  let { videoLink, anime, params } = props;

  let navigate = useNavigate();

  const opts = {
    playerVars: {
      autoplay: 0,
    },
  };

  const youtubeState = (e) => {
    // const duration = e.target.getDuration();
    const currentTime = e.target.getCurrentTime();

    let user_id = currentUser.user._id;
    let title = anime[0].title;
    let engName = anime[0].engName;
    let img = anime[0].img;
    let episode = params.episode;
    let length = anime[0].episode.length;

    switch (e.data) {
      case -1:
        console.log("暫停");
        break;
      case 0:
        console.log("影片結束");
        break;
      case 1:
        HistoryService.post(
          user_id,
          title,
          engName,
          img,
          episode,
          length,
          currentTime
        )
          .then((update) => {
            if (update.data === "資料遭到串改") {
              localStorage.removeItem("user");
              navigate("/");
            }
          })
          .catch((error) => {
            console.log(error);
          });

        AnimeService.postView(user_id, title)
          .then((data) => {
            console.log(data);
          })
          .catch((error) => {
            console.log(error);
          });
        break;
      case 2:
        HistoryService.post(
          user_id,
          title,
          engName,
          img,
          episode,
          length,
          currentTime
        )
          .then((update) => {
            if (update.data === "資料遭到串改") {
              localStorage.removeItem("user");
              navigate("/");
            }
          })
          .catch((error) => {
            console.log(error);
          });
        break;
      case 3:
        console.log("buffering");
        break;
      case 5:
        console.log("影片嵌入");
        break;
      default:
        console.log("錯誤");
    }
  };

  return (
    <>
      <Youtube
        videoId={videoLink}
        className="youtubePlayer"
        opts={opts}
        onStateChange={youtubeState}
      />
    </>
  );
}
