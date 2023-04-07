import axios from "axios";
const API_URL = "http://localhost:4000/api/thumbs";

class LikeService {
  getLikes(commentId) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.get(API_URL + "/likenumbers", {
      params: {
        commentId,
      },
      headers: {
        Authorization: token,
      },
    });
  }

  getDislikes(commentId) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.get(API_URL + "/dislikenumbers", {
      params: {
        commentId,
      },
      headers: {
        Authorization: token,
      },
    });
  }

  uplike(commentId) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.post(
      API_URL + "/like",
      { commentId },
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }

  unlike(commentId) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.delete(API_URL + "/like", {
      params: {
        commentId,
      },
      headers: {
        Authorization: token,
      },
    });
  }

  updislike(commentId) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.post(
      API_URL + "/dislike",
      { commentId },
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }

  undislike(commentId) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.delete(API_URL + "/dislike", {
      params: {
        commentId,
      },
      headers: {
        Authorization: token,
      },
    });
  }
}

export default new LikeService();
