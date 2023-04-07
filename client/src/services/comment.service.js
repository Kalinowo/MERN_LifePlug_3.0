import axios from "axios";
const API_URL = "http://localhost:4000/api/comments";

class CommentService {
  post(option) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.post(API_URL, option, {
      headers: {
        Authorization: token,
      },
    });
  }

  getComment(episode) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.get(API_URL, {
      params: {
        episode: episode,
      },
      headers: {
        Authorization: token,
      },
    });
  }
}

export default new CommentService();
