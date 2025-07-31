import axios from "axios";
import auth from "./authservice";

// const baseUrl = "http://localhost:2410";
const baseUrl="https://booksserver.onrender.com"


function getAuthHeader() {
  const token = auth.getToken();
  console.log("Token from auth.getToken():", token);
  return { Authorization: token ? token : "" };
}


function get(url, auth = true) {
  const headers = auth ? getAuthHeader() : {};
  return axios.get(baseUrl + url, { headers });
}

function post(url, obj, auth = true) {
  const headers = auth ? getAuthHeader() : {};
  return axios.post(baseUrl + url, obj, { headers });
}

function put(url, obj) {
  return axios.put(baseUrl + url, obj, {
    headers: getAuthHeader(),
  });
}

function deleteReq(url) {
  return axios.delete(baseUrl + url, {
    headers: getAuthHeader(),
  });
}

const httpService={
  get,
  post,
  put,
  deleteReq,
}
export default httpService;
