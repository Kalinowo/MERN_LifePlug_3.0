import React from "react";
import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";

export default function AnimeSearchResult(props) {
  let { animes, data } = props;

  return (
    <div className="homeInner">
      <div className="animeSeasonOuter">
        <div className="animeSeasonContainer">
          {animes.map(
            (anime, index) =>
              anime.title.toLowerCase().includes(data.toLowerCase()) && (
                <React.Fragment key={anime.engName}>
                  <Link
                    className="animeContainer"
                    to={`/LifePlug/video/${anime.engName}/${anime.episode.length}`}
                  >
                    <div className="animeImgContainer">
                      <img
                        src={anime.img}
                        className="img"
                        alt={anime.engName}
                        //   onLoad={handleLoad}
                      />
                      <div className="latestEpisode">
                        更新至第{anime.episode.length}集
                      </div>
                      <div className="viewsContainer">
                        <FaEye />
                        <div className="views">{anime.view.length}</div>
                      </div>
                    </div>
                    <div className="animeNameContainer">
                      <div
                        className={anime.title.length > 12 ? "scroll" : "name"}
                      >
                        {anime.title}
                      </div>
                    </div>
                  </Link>
                </React.Fragment>
              )
          )}
        </div>
      </div>
    </div>
  );
}
