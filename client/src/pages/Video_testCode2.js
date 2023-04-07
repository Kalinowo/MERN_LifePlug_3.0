import React, { Suspense } from "react";
import { GlobalContext } from "../context/GlobalState";
import {
  useParams,
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
  async function getVideo() {
    let anime;
    let remoteControl = null;
    let videoLink = null;
    let lastWatch = null;
    let title;
    let user_id = JSON.parse(localStorage.getItem("user")).user._id;
    let commentLists;
    let ep;

    await AnimeService.getOne(params.id).then((res) => {
      anime = res.data;
      if (res.data[0].episode.length && params.episode !== "0") {
        remoteControl = res.data[0].episode[params.episode - 1];
        videoLink = remoteControl.split("v=")[1].split("&")[0];
      }
      title = res.data[0].title;
      ep = res.data[0].title + "[" + params.episode + "]";
    });

    await HistoryService.getLastWatch(title, user_id).then((res) => {
      if (res.data.length !== 0) {
        lastWatch = res.data;
      }
    });

    await CommentService.getComment(ep).then((res) => {
      commentLists = res.data;
    });
    return { params, anime, remoteControl, videoLink, lastWatch, commentLists };
  }

  return defer({ data: getVideo() });
}

export default function Video() {
  const { data } = useLoaderData();
  // const [animeData, setAnimeData] = React.useState();
  const [commentLists, setCommentLists] = React.useState([]);
  // const [lastWatch, setLastWatch] = React.useState(null);
  const [forceRefresh, setForceRefresh] = React.useState(0);

  const { currentUser, setCurrentUser, theme, pop, setPop } =
    React.useContext(GlobalContext);
  let navigate = useNavigate();

  React.useEffect(() => {
    data.then((res) => {
      setCommentLists(res.commentLists);
    });
  }, []);

  // function deleteEpisode(link) {
  //   AnimeService.deleteOne(link).then((res) => {
  //     setForceRefresh((prev) => prev + 1);
  //     if (link === remoteControl.current) {
  //       navigate(-1);
  //     }
  //   });
  // }

  const updateComment = (newComment) => {
    setCommentLists((prev) => prev.concat(newComment));
  };

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={data}>
          {(loadedData) => (
            <>
              {pop === true && (
                <UploadNewEpisode
                  anime={loadedData.anime}
                  setForceRefresh={setForceRefresh}
                />
              )}
              <div className="videoOuter" data-theme={theme}>
                <div className="videoContainer">
                  <div className="videoTitle text-4xl font-bold text-center mt-3">
                    {loadedData.anime[0].title}
                  </div>
                  <div className="youtubePlayerOuter">
                    {!!loadedData.anime[0].episode.length && (
                      <YoutubeContainer
                        videoLink={loadedData.videoLink}
                        anime={loadedData.anime}
                        params={loadedData.params}
                      />
                    )}
                  </div>
                  <div className="videoTitle2 text-xl font-bold text-center mt-3">
                    {loadedData.anime[0].title}[{loadedData.params.episode}]
                  </div>
                  <div className="episodeOuter">
                    {loadedData.anime[0].episode.map((episode, index) => {
                      return (
                        <React.Fragment key={index}>
                          <div className="episodeContainer">
                            {currentUser &&
                              currentUser.user.role === "Admin" && (
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
                            <Link
                              to={`/LifePlug/video/${loadedData.params.id}/${
                                index + 1
                              }`}
                            >
                              <button
                                className={
                                  loadedData.lastWatch !== null
                                    ? loadedData.lastWatch[0].episode ===
                                      index + 1
                                      ? "episodeBtn lastWatch"
                                      : "episodeBtn"
                                    : "episodeBtn"
                                }
                                style={
                                  episode === loadedData.remoteControl
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
                        {loadedData.anime[0].genre}
                      </li>
                      <li>
                        <span>導演監督</span>
                        {loadedData.anime[0].director}
                      </li>

                      <li>
                        <span>台灣代理</span>
                        {loadedData.anime[0].agent}
                      </li>
                      <li>
                        <span>製作廠商</span>
                        {loadedData.anime[0].producer}
                      </li>
                    </ul>
                    <div className="videoIntro">
                      {loadedData.anime[0].intro}
                    </div>
                  </div>
                  <Comment
                    currentUser={currentUser}
                    title={loadedData.anime[0].title}
                    ep={loadedData.params.episode}
                    commentLists={commentLists}
                    refreshFunction={updateComment}
                  />
                </div>
              </div>
            </>
          )}
        </Await>
      </Suspense>
    </>
  );
}
