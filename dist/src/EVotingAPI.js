"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestError = exports.postWithHeaders = exports.post = exports.get = void 0;
const axios_1 = __importDefault(require("axios"));
const get = (url) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield axios_1.default.get(url);
        return res.data;
    }
    catch (ex) {
        throw formatRequestError(ex);
    }
});
exports.get = get;
const post = (url, body) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, exports.postWithHeaders)(url, {}, body);
});
exports.post = post;
const postWithHeaders = (url, headers, body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield axios_1.default.post(url, body, { headers });
        return res.data;
    }
    catch (ex) {
        throw formatRequestError(ex);
    }
});
exports.postWithHeaders = postWithHeaders;
const formatRequestError = (error) => {
    let errorObj = new RequestError("EVoting API request failed", {});
    if (error.response) {
        errorObj.message += ` with status ${error.response.status} (${error.response.statusText})`;
        if (error.response.data) {
            const errorData = error.response.data;
            if (errorData.error !== undefined) {
                errorObj.error = errorData.error;
            }
            else {
                errorObj.error = errorData;
            }
        }
    }
    return errorObj;
};
class RequestError extends Error {
    constructor(message, error) {
        super(message);
        this.name = this.constructor.name;
        this.error = error;
    }
}
exports.RequestError = RequestError;
