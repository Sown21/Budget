import axios from "axios";

const instance = axios.create({
    baseURL: "http://192.168.2.100:32023/api/v1",
    timeout: 1000,
    headers: {
        "Content-Type": "application/json",
    },
})

export default instance;
