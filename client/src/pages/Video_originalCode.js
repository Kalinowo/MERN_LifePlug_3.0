import React from "react";
import { GlobalContext } from "../context/GlobalState";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";

import YoutubeContainer from "../components/videoPage/YoutubeContainer";
import Comment from "../components/videoPage/Comment";
import UploadNewEpisode from "../components/videoPage/UploadNewEpisode";

import { FaPlusCircle, FaTimes } from "react-icons/fa";

import AnimeService from "../services/anime.Service";
import HistoryService from "../services/history.service";
import CommentService from "../services/comment.service";

export async function videoDataLoader({ params }) {
  console.log(params);
  return params;
}

export default function Video() {
  const [animeData, setAnimeData] = React.useState();
  const [commentLists, setCommentLists] = React.useState([]);
  const [lastWatch, setLastWatch] = React.useState(null);
  const [forceRefresh, setForceRefresh] = React.useState(0);

  const { currentUser, setCurrentUser, theme, pop, setPop } =
    React.useContext(GlobalContext);
  let location = useLocation();
  let navigate = useNavigate();
  let params = useParams();
  let animeID = params.id;
  let remoteControl = React.useRef();
  let videoLink;

  React.useEffect(() => {
    AnimeService.getOne(animeID).then((res) => {
      remoteControl.current = res.data[0].episode[params.episode - 1];
      setAnimeData(res.data);
    });
    // .catch((err) => {
    //   if (err.response.data === "Unauthorized") {
    //     setCurrentUser(null);
    //     localStorage.removeItem("user");
    //     navigate("/", { replace: true });
    //   }
    // });
  }, [location.pathname, forceRefresh]);

  React.useEffect(() => {
    if (animeData) {
      let user_id = currentUser.user._id;
      let title = animeData[0].title;
      HistoryService.getLastWatch(title, user_id).then((res) => {
        if (res.data.length !== 0) {
          setLastWatch(res.data);
        }
      });
    }
    //eslint-disable-next-line
  }, [animeData]);

  React.useEffect(() => {
    if (animeData) {
      let ep = animeData[0].title + "[" + params.episode + "]";
      CommentService.getComment(ep).then((res) => {
        setCommentLists(res.data);
      });
    }
  }, [animeData]);

  if (remoteControl.current) {
    videoLink = remoteControl.current.split("v=")[1].split("&")[0];
  }

  function deleteEpisode(link) {
    AnimeService.deleteOne(link).then((res) => {
      setForceRefresh((prev) => prev + 1);
      if (link === remoteControl.current) {
        navigate(-1);
      }
    });
  }

  const updateComment = (newComment) => {
    setCommentLists(commentLists.concat(newComment));
  };

  return (
    <>
      {pop === true && (
        <UploadNewEpisode anime={animeData} setForceRefresh={setForceRefresh} />
      )}
      {animeData && (
        <div className="videoOuter" data-theme={theme}>
          <div className="videoContainer">
            <div className="videoTitle text-4xl font-bold text-center mt-3">
              {animeData[0].title}
            </div>
            <div className="youtubePlayerOuter">
              {!!animeData[0].episode.length && (
                <YoutubeContainer
                  videoLink={videoLink}
                  anime={animeData}
                  params={params}
                />
              )}
            </div>
            <div className="videoTitle2 text-xl font-bold text-center mt-3">
              {animeData[0].title}[{params.episode}]
            </div>
            <div className="episodeOuter">
              {animeData[0].episode.map((episode, index) => {
                return (
                  <React.Fragment key={index}>
                    <div className="episodeContainer">
                      {currentUser && currentUser.user.role === "Admin" && (
                        <div className="removeBox">
                          <div
                            className="remove"
                            onClick={() => deleteEpisode(episode)}
                          >
                            Remove
                          </div>
                          <FaTimes />
                        </div>
                      )}
                      <Link to={`/LifePlug/video/${animeID}/${index + 1}`}>
                        <button
                          className={
                            lastWatch !== null
                              ? lastWatch[0].episode === index + 1
                                ? "episodeBtn lastWatch"
                                : "episodeBtn"
                              : "episodeBtn"
                          }
                          style={
                            episode === remoteControl.current
                              ? { background: "lightblue" }
                              : null
                          }
                        >
                          {index + 1}
                        </button>
                      </Link>
                    </div>
                  </React.Fragment>
                );
              })}
              {currentUser && currentUser.user.role === "Admin" && (
                <div className="uploadEpisodeOuter">
                  <div className="circle" onClick={() => setPop(true)}>
                    <FaPlusCircle />
                  </div>
                </div>
              )}
            </div>
            <div className="videoDetailOuter">
              <ul className="videoDetailContainer">
                <li>
                  <span>作品類型</span>
                  {animeData[0].genre}
                </li>
                <li>
                  <span>導演監督</span>
                  {animeData[0].director}
                </li>

                <li>
                  <span>台灣代理</span>
                  {animeData[0].agent}
                </li>
                <li>
                  <span>製作廠商</span>
                  {animeData[0].producer}
                </li>
              </ul>
              <div className="videoIntro">{animeData[0].intro}</div>
            </div>
            <Comment
              currentUser={currentUser}
              title={animeData[0].title}
              ep={params.episode}
              commentLists={commentLists}
              refreshFunction={updateComment}
            />
          </div>
        </div>
      )}
    </>
  );
}
