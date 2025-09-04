import instance from "./axios"

export const getCategories = async () => {
    const response = await instance.get("/categories/total");
    return response.data
}

export const addCategory = async (payload) => {
    const response = await instance.post("/categories/add", payload);
    return response.data
}

export const addSubCategory = async (payload) => {
    const response = await instance.post("/categories/add/sub", payload);
    return response.data
}

export const delCategory = async (category_id) => {
    const response = await instance.delete(`/categories/del/?category_id=${category_id}`)
    return response.data
}