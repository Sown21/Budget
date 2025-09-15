import instance from './axios'
import axios from './axios'

export const getUsers = async () => {
    const response = await instance.get("/users/")
    return response.data
}

export const createUser = async (userData) => {
    const response = await instance.post("/users/", userData)
    return response.data
}

export const deleteUser = async (userId) => {
    const response = await instance.delete(`/users/${userId}`)
    return response.data
}

export const updateUser = async (userId, userData) => {
    const response = await instance.put(`/users/${userId}`, userData)
    return response.data
}