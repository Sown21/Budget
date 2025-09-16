import { UserProvider } from "../context/UserContext";
import instance from "./axios"

export const getSpents = async (id) => {
    const response = await instance.get(`/spents/?user_id=${id}`);
    return response.data
}

export const postSpents = async (payload) => {
    const response = await instance.post("/spents/", payload);
    return response.data;
}

export const deleteSpent = async (id) => {
    const response = await instance.delete(`/spents/${id}`)
    return response.data
}

export const modifySpent = async (id, payload) => {
    const response = await instance.put(`/spents/${id}`, payload)
    return response.data
}

export const totalSpent = async (id, year, month) => {
    let url = `/spents/total/?year=${year}&user_id=${id}`
    if (month) url += `&month=${month}`
    const response = await instance.get(url)
    return response.data
}

export const totalIncome = async (id, year, month) => {
    let url = `/spents/total/income/?year=${year}&user_id=${id}`
    if (month) url += `&month=${month}`
    const response = await instance.get(url)
    return response.data
}

export const totalRemaining = async (id, year, month) => {
    let url = `/spents/total/remaining/?year=${year}&user_id=${id}`
    if (month) url += `&month=${month}`
    const response = await instance.get(url)
    return response.data
}

export const totalRemainingByMonth = async (id, year, month) => {
    let url = `/spents/total/remaining/month/?year=${year}&month=${month}&user_id=${id}`
    const response = await instance.get(url)
    return response.data
}

export const allYears = async (id) => {
    const response = await instance.get(`/spents/all/years/?user_id=${id}`)
    return response.data
}

export const totalByCategory = async (id, year, month) => {
    let url = `/spents/total/by_category/?year=${year}&user_id=${id}`
    if (month) url += `&month=${month}`
    const response = await instance.get(url)
    return response.data
}

export const yearIncome = async (id, year) => {
    const response = await instance.get(`/spents/year/income/?year=${year}&user_id=${id}`)
    return response.data
}

export const yearSpent = async (id, year) => {
    const response = await instance.get(`/spents/year/spent/?year=${year}&user_id=${id}`)
    return response.data
}

export const compareMonthSpent = async (userId, year, month) => {
    const response = await instance.get(`/spents/compare/month?user_id=${userId}&year=${year}&month=${month}`)
    return response.data
}