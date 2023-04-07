import React from "react";
import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { Blurhash } from "react-blurhash";

export default function AnimeSeasonFilter(props) {
  const [isLoaded, setIsLoaded] = React.useState(true);
  let { animes, year } = props;
  const rules = ["一月冬番", "四月春番", "七月夏番", "十月秋番"];
  const seasons = [...new Set(animes.map((animes) => animes.season))];
  seasons.sort((a, b) => {
    if (rules.indexOf(a) < rules.indexOf(b)) {
      return 1;
    } else {
      return -1;
    }
  });

  const handleLoad = () => {
    setIsLoaded(false);
  };

  return (
    <>
      {seasons.map((season) => (
        <div key={season} className="animeSeasonInner">
          <div className="seasonTitle text-4xl font-bold text-center my-5">
            {year + "(" + season + ")"}
          </div>
          <div className="animeSeasonContainer">
            {animes.map(
              (anime) =>
                anime.season === season && (
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
                          onLoad={handleLoad}
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
                          className={
                            anime.title.length > 12 ? "scroll" : "name"
                          }
                        >
                          {anime.title}
                        </div>
                      </div>
                      {isLoaded && (
                        <div className="styledBlur">
                          <Blurhash
                            hash={anime.blurHash}
                            width="100%"
                            height="100%"
                            resolutionX={32}
                            resolutionY={32}
                            punch={1}
                          />
                        </div>
                      )}
                    </Link>
                  </React.Fragment>
                )
            )}
          </div>
        </div>
      ))}
    </>
  );
}
