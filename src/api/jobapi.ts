import { JobForBookmark, JobForCreation, JobForPatch, JobResponse } from "../types";
import axios, { AxiosRequestConfig } from 'axios'


const path = `${import.meta.env.VITE_API_URL}${import.meta.env.VITE_ENTITY_CONTROLLER_BASE_PATH}/jobs`;
// an async function always returns a Promise object
// if the return value is not a Promise object, then it will be wrapped in one
export const getJobs = async (): Promise<JobResponse[]> => {

    // `response` is an AxiosResponse object containing serveral properties with information about the response
    // from the HTTP request
    // The AxiosResponse object contains the following properties:
    // `data`: payload
    // `status`, `statusText`, `headers`,
    // `config`: full request configuration such as URL, headers, method, etc.
    // `request`: the request instance itself, in case you need it for any reason
    let response;
    try {
        response = await axios.get(path, getAxiosConfig());
    } catch (error) {
        sessionStorage.removeItem("jwt");
        response = await axios.get(path, getAxiosConfig());
    }
    return response.data; // same as `return Promise.resolve(response.data);`
}

export const deleteJob = async (link: string) => {
    try {
        const response = await axios.delete(link, getAxiosConfig());
        return response;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data || error.response.status)
        } else {
            throw new Error("An unknown error occurred.");
        }
    }

}

export const addJob = async (job: JobForCreation) => {
    try {
        const response = await axios.post(path, job, getAxiosConfig());
        return response;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data || error.response.status)
        } else {
            throw new Error("An unknown error occurred.");
        }
    }
}

export const updateJob = async (jobForPatch: JobForPatch): Promise<JobResponse> => {
    try {
        const response = await axios.patch(getJobLink(jobForPatch.id), jobForPatch.job, getAxiosConfig());
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data || error.response.status)
        } else {
            throw new Error("An unknown error occurred.");
        }
    }
}

export const bookmarkJob = async (jobForBookmark: JobForBookmark): Promise<JobResponse> => {
    try {
        const response = await axios.patch(getJobLink(jobForBookmark.id) + "/bookmark", { isBookmarked: jobForBookmark.isBookmarked }, getAxiosConfig());
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data || error.response.status)
        } else {
            throw new Error("An unknown error occurred.");
        }
    }
}

export const getJobLink = (id: number): string => {
    return `${import.meta.env.VITE_API_URL}${import.meta.env.VITE_ENTITY_CONTROLLER_BASE_PATH}/jobs/${id}`;
}

const getAxiosConfig = (): AxiosRequestConfig => {
    const token = sessionStorage.getItem("jwt");
    if (token) {
        return {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`,
            }
        };
    } else {
        return {
            headers: {
                'Content-Type': 'application/json',
            }
        };
    }
}