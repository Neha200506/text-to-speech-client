import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const checkHealth = () => {
  return API.get("/health");
};

export const generateSpeech = (data) => {
  return API.post("/tts", data);
};

export default API;