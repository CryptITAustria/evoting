import axios, { Axios, AxiosError } from "axios";

export const get = async (url: string) => {
    try {
        const res = await axios.get(url);
        return res.data;
    }
    catch (ex) {
        throw formatRequestError(ex as AxiosError);
    }
}

export const post = async (url: string, body: any) => {
    return await postWithHeaders(url, {}, body);
}

export const postWithHeaders = async (url: string, headers: { [key: string]: string }, body: any) => {
    try {
        const res = await axios.post(url, body, { headers });
        return res.data;
    }
    catch (ex) {
        throw formatRequestError(ex as AxiosError);
    }
}

const formatRequestError = (error: AxiosError) => {
    let errorObj = new RequestError("EVoting API request failed", {});
    if (error.response) {
        errorObj.message += ` with status ${error.response.status} (${error.response.statusText})`;
        if (error.response.data) {
            const errorData = error.response.data as any;
            if (errorData.error !== undefined) {
                errorObj.error = errorData.error;
            }
            else {
                errorObj.error = errorData;
            }
        }
    }
    return errorObj;
}

export class RequestError extends Error {
    error: object | string;
    constructor(message: string, error: any) {
        super(message);
        this.name = this.constructor.name;
        this.error = error;
    }
}