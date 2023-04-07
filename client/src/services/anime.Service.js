import axios from "axios";
const API_URL = "http://localhost:4000/api/animes";

class AnimeService {
  postAnime(
    title,
    engName,
    img,
    year,
    season,
    genre,
    director,
    agent,
    producer,
    blurHash,
    intro
  ) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }

    return axios.post(
      API_URL,
      {
        title,
        engName,
        img,
        year,
        season,
        genre,
        director,
        agent,
        producer,
        blurHash,
        intro,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }

  postEpisode(link, title) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.post(
      API_URL + "/episode/",
      {
        link,
        title,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }

  getEveryAnime() {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.get(API_URL, {
      headers: {
        Authorization: token,
      },
    });
  }

  getOne(one) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.get(API_URL + "/video/" + one, {
      headers: {
        Authorization: token,
      },
    });
  }

  deleteOne(link) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.delete(API_URL + "/episode", {
      params: {
        link: link,
      },
      headers: {
        Authorization: token,
      },
    });
  }

  postView(user_id, title) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.post(
      API_URL + "/views",
      {
        user_id,
        title,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }
}

export default new AnimeService();
