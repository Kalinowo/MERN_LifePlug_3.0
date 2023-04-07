import React, { Suspense } from "react";
import { useLoaderData, defer, Await } from "react-router-dom";
import { GlobalContext } from "../context/GlobalState";
import PostNewAnime from "../components/homePage/PostNewAnime";
import AnimeService from "../services/anime.Service";
import AnimeSeasonFilter from "../components/homePage/AnimeSeasonFilter";
import AnimeSearchResult from "../components/homePage/AnimeSearchResult";
import CustomButton from "../UI/Button";
import { FaSearch } from "react-icons/fa";

export async function homeDataLoader() {
  async function getHome() {
    let anime = null;
    let orderYear = null;
    await AnimeService.getEveryAnime().then((res) => {
      let unique = [...new Set(res.data.map((obj) => obj.year))];
      unique.sort().reverse();
      anime = res.data;
      orderYear = unique;
    });
    return { animes: anime, orderYear };
  }

  return defer({ data: getHome() });
}

export default function Home() {
  const { data } = useLoaderData();

  // const [animes, setAnimes] = React.useState(null);
  // const [orderYear, setOrderYear] = React.useState(null);
  const [loadLimit, setLoadLimit] = React.useState(1);
  const [searchValue, setSearchValue] = React.useState("");
  const { currentUser, setCurrentUser, theme, pop, setPop } =
    React.useContext(GlobalContext);

  function loadMore() {
    setLoadLimit((prev) => prev + 1);
  }

  return (
    <div className="homeOuter">
      <div className="homeInner" data-theme={theme}>
        <Suspense fallback={<div className="loader">Loading...</div>}>
          <Await resolve={data}>
            {(loadedData) => (
              <>
                {currentUser &&
                  currentUser.user.role === "Admin" &&
                  pop === true && <PostNewAnime />}

                <div className="searchInputOuter">
                  <div className="searchInputContainer">
                    <div className="searchIconContainer">
                      <FaSearch />
                    </div>
                    <input
                      type="text"
                      placeholder="search..."
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                    />
                  </div>
                </div>
                {searchValue && (
                  <AnimeSearchResult
                    animes={loadedData.animes}
                    data={searchValue}
                  />
                )}
                {currentUser && currentUser.user.role === "Admin" && (
                  <div className="postNewAnimeBtnOuter">
                    <CustomButton
                      children="Post Anime"
                      width="90%"
                      height="45px"
                      fontSize="35px"
                      lineHeight="50px"
                      onClick={() => setPop(true)}
                    />
                  </div>
                )}
                {!searchValue &&
                  loadedData.orderYear &&
                  loadedData.orderYear
                    .slice(0, loadLimit)
                    .map((data, index) => (
                      <div className="animeSeasonOuter" key={index}>
                        <AnimeSeasonFilter
                          animes={loadedData.animes.filter(
                            (anime) => anime.year === data
                          )}
                          year={data}
                        />
                      </div>
                    ))}
                {!searchValue &&
                  loadedData.orderYear &&
                  loadLimit < loadedData.orderYear.length && (
                    <div className="loadMoreBtnContainer">
                      <CustomButton
                        children="Load more"
                        width="90%"
                        height="50px"
                        fontSize="35px"
                        lineHeight="55px"
                        onClick={() => loadMore()}
                      />
                    </div>
                  )}
              </>
            )}
          </Await>
        </Suspense>
      </div>
    </div>
  );
}
