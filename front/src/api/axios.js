import axios from "axios";

const instance = axios.create({
    baseURL: "http://budget-back:8022/api/v1",
    timeout: 1000,
    headers: {
        "Content-Type": "application/json",
    },
})

export default instance;
