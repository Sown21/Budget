import instance from "./axios"

export const getCategories = async () => {
    const response = await instance.get("/categories/total");
    return response.data
}