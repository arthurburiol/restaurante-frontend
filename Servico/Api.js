// Servico/Api.js
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Api = axios.create({
  //baseURL: "http://56.124.45.108:4000",
  baseURL: "https://restaurantedosguris.agp.app.br",
});

// Função para salvar o token no header do axios
async function setTokenAxios() {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    Api.defaults.headers.common["token"] = token; 
  }
}

// Interceptor para sempre enviar o token antes de cada requisição
Api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");

  if (token) {
    config.headers["token"] = token;  // <-- igual seu backend espera
  }

  return config;
});

export default {
  api: Api,
  setTokenAxios,
};
