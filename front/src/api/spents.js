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

export const totalSpent = async (year, month) => {
    let url = `/spents/total/?year=${year}`
    if (month) url += `&month=${month}`
    const response = await instance.get(url)
    return response.data
}

export const totalIncome = async (year, month) => {
    let url = `/spents/total/income/?year=${year}`
    if (month) url += `&month=${month}`
    const response = await instance.get(url)
    return response.data
}

export const totalRemaining = async (year, month) => {
    let url = `/spents/total/remaining/?year=${year}`
    if (month) url += `&month=${month}`
    const response = await instance.get(url)
    return response.data
}

export const totalRemainingByMonth = async (year, month) => {
    let url = `/spents/total/remaining/month/?year=${year}&month=${month}`
    const response = await instance.get(url)
    return response.data
}

export const allYears = async () => {
    const response = await instance.get("/spents/all/years/")
    return response.data
}

export const totalByCategory = async (year, month) => {
    let url = `/spents/total/by_category/?year=${year}`
    if (month) url += `&month=${month}`
    const response = await instance.get(url)
    return response.data
}

export const yearIncome = async (year) => {
    const response = await instance.get(`/spents/year/income/?year=${year}`)
    return response.data
}

export const yearSpent = async (year) => {
    const response = await instance.get (`/spents/year/spent/?year=${year}`)
    return response.data
}