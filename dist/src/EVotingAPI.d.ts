export declare const get: (url: string) => Promise<any>;
export declare const post: (url: string, body: any) => Promise<any>;
export declare const postWithHeaders: (url: string, headers: {
    [key: string]: string;
}, body: any) => Promise<any>;
export declare class RequestError extends Error {
    error: object | string;
    constructor(message: string, error: any);
}
