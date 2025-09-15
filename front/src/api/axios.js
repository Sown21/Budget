import axios from "axios";

const apiURL = import.meta.env.VITE_API_URL;
console.log("VITE_API_URL =", apiURL);

const instance = axios.create({
    baseURL: apiURL,
    timeout: 5000,
    headers: {
        "Content-Type": "application/json",
    },
})

// AJOUT: Intercepteur pour gérer automatiquement les erreurs
instance.interceptors.response.use(
    (response) => response, // Succès : retourne la response
    (error) => {
        console.error('❌ Axios error:', error.response?.data);
        return Promise.reject(error); // Rejette automatiquement les erreurs
    }
);

export default instance;
