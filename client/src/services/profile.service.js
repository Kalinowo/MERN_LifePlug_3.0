import axios from "axios";
const API_URL = "http://localhost:4000/api/profile";

class ProfileService {
  updateName(user_id, nickname) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.patch(
      API_URL + "/updateName",
      {
        user_id,
        nickname,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }

  updateDP(user_id, picture) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.patch(
      API_URL + "/updateDP",
      {
        user_id,
        picture,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }

  getUser() {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.get(API_URL + "/", {
      headers: {
        Authorization: token,
      },
    });
  }
}

export default new ProfileService();
