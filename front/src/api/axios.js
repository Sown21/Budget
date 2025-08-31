import axios from "axios";

const instance = axios.create({
    baseURL: "http://192.168.2.100:38022/api/v1",
    timeout: 1000,
    headers: {
        "Content-Type": "application/json",
    },
})

export default instance;
