import instance from "./axios"

export const getSpents = async () => {
    const response = await instance.get("/spents/");
    return response.data
}

export const postSpents = async (payload) => {
    const response = await instance.post("/spents/", payload);
    return response.date;
}

export const deleteSpent = async (id) => {
    const response = await instance.delete(`/spents/${id}`)
    return response.data
}

export const modifySpent = async (id, payload) => {
    const response = await instance.put(`/spents/${id}`, payload)
    return response.data
}

export const totalSpent = async (year) => {
    const response = await instance.get(`/spents/total/?year=${year}`)
    return response.data
}

export const totalIncome = async (year) => {
    const response = await instance.get(`/spents/total/income/?year=${year}`)
    return response.data
}

export const totalRemaining = async (year) => {
    const response = await instance.get(`/spents/total/remaining/?year=${year}`)
    return response.data
}

export const allYears = async () => {
    const response = await instance.get("/spents/all/years/")
    return response.data
}