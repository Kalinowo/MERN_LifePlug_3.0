import axios from "axios";
const API_URL = "http://localhost:4000/api/user";

class AuthenticateService {
  memberLogin(username, password) {
    return axios.post(API_URL + "/login", { username, password });
  }

  memberRegister(username, password, verifyPassword) {
    return axios.post(API_URL + "/register", {
      username,
      password,
      verifyPassword,
    });
  }
}

export default new AuthenticateService();
