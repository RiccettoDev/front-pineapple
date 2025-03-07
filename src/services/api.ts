import axios from "axios";

const api = axios.create({
  baseURL: "http://pineapplesoccer-api-qcfavm-11890a-54-224-70-148.traefik.me",
  timeout: 30000,
});

export default api;
