import instance from "./axios"

export const getSpents = async () => {
    const response = await instance.get("/spents");
    return response.data
}