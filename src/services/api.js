import axios from "axios";

const API = axios.create({
  baseURL: "https://text-to-speech-server-mj96.onrender.com/api",
});

export const checkHealth = () => {
  return API.get("/health");
};

export const generateSpeech = (data) => {
  return API.post("/tts", data);
};

export default API;
