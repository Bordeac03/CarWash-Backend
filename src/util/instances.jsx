import axios from 'axios';

const baseURL = 'http://localhost:8080/'

export const authInstance = () => {
    const customInstance = axios.create({
        baseURL: baseURL + "auth/",
        withCredentials: true
    });
    return customInstance;
};

export const clientInstance = () => {
    const customInstance = axios.create({
        baseURL: baseURL + "client/",
        withCredentials: true
    });
    return customInstance;
}