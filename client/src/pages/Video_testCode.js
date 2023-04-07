import React, { Suspense } from "react";
import { GlobalContext } from "../context/GlobalState";
import {
  useLocation,
  useNavigate,
  Link,
  useLoaderData,
  defer,
  Await,
} from "react-router-dom";

import YoutubeContainer from "../components/videoPage/YoutubeContainer";
import Comment from "../components/videoPage/Comment";
import UploadNewEpisode from "../components/videoPage/UploadNewEpisode";

import { FaPlusCircle, FaTimes } from "react-icons/fa";

import AnimeService from "../services/anime.Service";
import HistoryService from "../services/history.service";
import CommentService from "../services/comment.service";

export async function videoDataLoader({ params }) {
  let user_id = JSON.parse(localStorage.getItem("user")).user._id;
  let title;
  let ep;

  let animeLoader;
  let lastWatchLoader = null;

  let remoteControl = null;
  let videoLink = null;

  await AnimeService.getOne(params.id).then((res) => {
    animeLoader = res.data;
    if (res.data[0].episode.length && params.episode !== "0") {
      remoteControl = res.data[0].episode[params.episode - 1];
      videoLink = remoteControl.split("v=")[1].split("&")[0];
    }
    title = res.data[0].title;
    ep = res.data[0].title + "[" + params.episode + "]";
  });

  await HistoryService.getLastWatch(title, user_id).then((res) => {
    if (res.data.length) {
      lastWatchLoader = res.data;
    }
  });

  async function getCommentLists() {
    let commentListsLoader;
    await CommentService.getComment(ep).then((res) => {
      commentListsLoader = res.data.reverse();
    });
    return commentListsLoader;
  }

  return defer({
    params,
    animeLoader,
    lastWatchLoader,
    commentListsLoader: getCommentLists(),
    remoteControl,
    videoLink,
  });
}

export default function Video() {
  const {
    params,
    animeLoader,
    lastWatchLoader,
    commentListsLoader,
    remoteControl,
    videoLink,
  } = useLoaderData();
  const [animeData, setAnimeData] = React.useState(animeLoader);
  const [commentLists, setCommentLists] = React.useState([]);
  const [lastWatch, setLastWatch] = React.useState(lastWatchLoader);

  const { currentUser, setCurrentUser, theme, pop, setPop } =
    React.useContext(GlobalContext);
  let location = useLocation();
  let navigate = useNavigate();

  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    commentListsLoader.then((res) => {
      setCommentLists(res);
    });
  }, []);

  function deleteEpisode(link) {
    AnimeService.deleteOne(link).then((res) => {
      navigate(0);
    });
  }

  const updateComment = (newComment) => {
    setCommentLists((prev) => newComment.concat(prev));
  };

  return (
    <>
      {pop === true && <UploadNewEpisode anime={animeData} />}
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
                      <Link to={`/LifePlug/video/${params.id}/${index + 1}`}>
                        <button
                          className={
                            lastWatch !== null
                              ? lastWatch[0].episode === index + 1
                                ? "episodeBtn lastWatch"
                                : "episodeBtn"
                              : "episodeBtn"
                          }
                          style={
                            episode === remoteControl
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
            {
              <Suspense fallback={<div className="loader">Loading...</div>}>
                <Await resolve={commentListsLoader}>
                  {() => (
                    <>
                      <Comment
                        currentUser={currentUser}
                        title={animeData[0].title}
                        ep={params.episode}
                        commentLists={commentLists}
                        refreshFunction={updateComment}
                      />
                    </>
                  )}
                </Await>
              </Suspense>
            }
          </div>
        </div>
      )}
    </>
  );
}
