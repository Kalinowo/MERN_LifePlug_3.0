import React, { Suspense } from "react";
import { GlobalContext } from "../context/GlobalState";
import HistoryService from "../services/history.service";
import AnimeService from "../services/anime.Service";
import {
  useNavigate,
  Link,
  useLoaderData,
  defer,
  Await,
} from "react-router-dom";
import { FaGripLinesVertical, FaArrowRight } from "react-icons/fa";

export async function historyDataLoader() {
  async function getHistory() {
    let watchHistory = null;
    let user_id = JSON.parse(localStorage.getItem("user")).user._id;
    await HistoryService.getHistory(user_id).then((res) => {
      watchHistory = watchHistory = res.data.sort((a, b) =>
        Date.parse(a.date) < Date.parse(b.date) ? 1 : -1
      );
    });
    return watchHistory;
  }

  async function getAnimeData() {
    let animeData = null;
    await AnimeService.getEveryAnime().then((res) => {
      animeData = res.data;
    });
    return animeData;
  }

  return defer({ watchHistory: getHistory(), animeData: getAnimeData() });
}

export default function History() {
  const { watchHistory, animeData } = useLoaderData();
  const { currentUser, setCurrentUser, theme } =
    React.useContext(GlobalContext);
  // let [watchHistory, setWatchHistory] = React.useState(watchHistoryLoader);
  // let [animeData, setAnimeData] = React.useState(null);
  let navigate = useNavigate();

  // React.useEffect(() => {
  //   if (!currentUser) {
  //     return;
  //   }

  //   let _id = currentUser.user._id;
  //   HistoryService.getHistory(_id)
  //     .then((data) => {
  //       if (data.data === "資料遭到串改") {
  //         setCurrentUser(null);
  //         localStorage.removeItem("user");
  //         navigate("/", { replace: true });
  //       } else {
  //         setWatchHistory(
  //           data.data.sort((a, b) =>
  //             Date.parse(a.date) < Date.parse(b.date) ? 1 : -1
  //           )
  //         );
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  //   //eslint-disable-next-line
  // }, []);

  // React.useEffect(() => {
  //   AnimeService.getEveryAnime()
  //     .then((data) => {
  //       setAnimeData(data.data);
  //     })
  //     .catch((err) => {
  //       if (err.response.data === "Unauthorized") {
  //         setCurrentUser(null);
  //         localStorage.removeItem("user");
  //         navigate("/", { replace: true });
  //       }
  //     });
  // }, []);

  const toHHMMSS = (time) => {
    var sec_num = parseInt(time, 10); // don't forget the second param
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - hours * 3600) / 60);
    var seconds = sec_num - hours * 3600 - minutes * 60;

    if (hours < 10) {
      hours = "0" + hours;
    }
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    return hours + "時" + minutes + "分" + seconds + "秒";
  };

  return (
    <React.Fragment>
      <div className="watchHistoryOuter" data-theme={theme}>
        <Suspense fallback={<div className="loader">Loading...</div>}>
          <Await resolve={watchHistory}>
            {(loadedHistory) => (
              <Await resolve={animeData}>
                {(loadedAnimeData) => (
                  <div className="watchHistoryContainer">
                    <div className="pageTitle">觀看紀錄：</div>
                    {loadedHistory.map((history, index) => (
                      <React.Fragment key={index}>
                        <div className="historyBox">
                          <div className="boxInner">
                            <div className="imgOuter">
                              <img
                                className="img"
                                src={`/${history.img}`}
                                alt={history.title}
                              />
                            </div>
                            <div className="textOuter">
                              <div className="title">{history.title}</div>
                              <div className="box1">
                                <div className="title2">上次觀看：</div>
                                <div className="episodeBox">
                                  <a
                                    href={`/video/${history.engName}/${history.episode}`}
                                  >
                                    <div className="episode">
                                      第
                                      <div className="number">
                                        {history.episode}
                                      </div>
                                      集
                                    </div>
                                  </a>
                                  <div className="branch">
                                    <FaGripLinesVertical />
                                  </div>
                                  <div className="time">
                                    {toHHMMSS(history.currentTime)}
                                  </div>
                                </div>
                                {loadedAnimeData.map((anime, index) => (
                                  <React.Fragment key={index}>
                                    {anime.engName === history.engName && (
                                      <div className="latestEpisode">
                                        最新集數：{anime.episode.length}
                                      </div>
                                    )}
                                    {anime.engName === history.engName &&
                                      history.episode <
                                        anime.episode.length && (
                                        <Link
                                          to={`/LifePlug/video/${
                                            history.engName
                                          }/${history.episode + 1}`}
                                        >
                                          <span className="episodePlusPlus">
                                            觀看下一集
                                            <FaArrowRight className="animation fas fa-arrow-right" />
                                          </span>
                                        </Link>
                                      )}
                                  </React.Fragment>
                                ))}
                                <div className="date">
                                  {new Date(history.date).toLocaleString(
                                    "zh-TW",
                                    {
                                      hour12: false,
                                    }
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </Await>
            )}
          </Await>
        </Suspense>
      </div>
    </React.Fragment>
  );
}
