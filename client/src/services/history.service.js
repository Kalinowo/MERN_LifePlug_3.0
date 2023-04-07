import axios from "axios";
const API_URL = "http://localhost:4000/api/history";

class HistoryService {
  post(user_id, title, engName, img, episode, length, currentTime) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.post(
      API_URL,
      {
        user_id,
        title,
        engName,
        img,
        episode,
        length,
        currentTime,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }

  getHistory(_id) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.get(API_URL, {
      params: {
        _id: _id,
      },
      headers: {
        Authorization: token,
      },
    });
  }

  getLastWatch(title, _id) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.get(API_URL + "/lastwatch", {
      params: {
        title,
        _id: _id,
      },
      headers: {
        Authorization: token,
      },
    });
  }
}

export default new HistoryService();
