import axios from 'axios';

const baseURL = 'http://localhost:8080/'

export const authInstance = () => {
    const customInstance = axios.create({
        baseURL: baseURL + "auth/",
        withCredentials: true
    });
    return customInstance;
};

export const adminInstance = () => {
    const customInstance = axios.create({
        baseURL: baseURL + "admin/",
        withCredentials: true
    });
    return customInstance;
}