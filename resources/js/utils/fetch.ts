import Axios, { CreateAxiosDefaults } from 'axios';

export function fetchWithCsrf(options: CreateAxiosDefaults = {}) {
    return Axios.create({
        withCredentials: true,
        withXSRFToken: true,
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        ...options,
    });
}
