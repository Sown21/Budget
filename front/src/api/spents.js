import instance from "./axios"

export const getSpents = async () => {
    const response = await instance.get("/spents");
    return response.data
}

export const postSpents = async (payload) => {
    const response = await instance.post("/spents", payload);
    return response.date;
}