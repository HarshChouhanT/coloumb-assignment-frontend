import Cookies from "universal-cookie/es6/Cookies";
import axios from "axios";

const baseUrl = "http://localhost:3000";

export const login = async (username: string, password: string) => {
  var raw = {
    username: username,
    password: password,
  };

  const response = await axios.post(`${baseUrl}/auth/login`, raw);
  if (response.status == 200) {
    const cookies = new Cookies();
    const data = response.data;
    cookies.set("token", data?.access_token);
    return true;
  }
  return false;
};

export const register = async (username: string, password: string) => {
  var raw = {
    username: username,
    password: password,
  };

  const response = await axios.post(`${baseUrl}/auth/register`, raw);
  if (response.status == 201) {
    const cookies = new Cookies();
    const data = response.data;
    cookies.set("token", data?.access_token);
    return true;
  }
  return false;
};
