import axios from "axios";

const apiURL = import.meta.env.VITE_API_URL;

const instance = axios.create({
    baseURL: apiURL,
    timeout: 5000,
    headers: {
        "Content-Type": "application/json",
    },
})

export default instance;
