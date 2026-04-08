import axios from "axios";

const api = axios.create({
  baseURL: "b1s/v1",
});

api.interceptors.request.use((config) => {
  const session = JSON.parse(localStorage.getItem("session"));

  console.log("➡️ REQUEST");
  console.log("URL:", config.url);
  console.log("METHOD:", config.method);
  console.log("DATA:", config.data);

  if (session?.sessionId) {
    config.headers.Cookie = `B1SESSION=${session.sessionId}`;
    console.log("SESSION ID:", session.sessionId);
  } else {
    console.log("NO SESSION");
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log("✅ RESPONSE");
    console.log("URL:", response.config.url);
    console.log("STATUS:", response.status);
    console.log("DATA:", response.data);
    return response;
  },
  (error) => {
    console.log("❌ ERROR RESPONSE");

    if (error.response) {
      console.log("STATUS:", error.response.status);
      console.log("HEADERS:", error.response.headers);
      console.log("DATA:", error.response.data);
    } else {
      console.log("ERROR:", error.message);
    }

    if (error.response?.status === 401) {
      console.log("SESSION EXPIRADA");
      localStorage.removeItem("session");
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default api;