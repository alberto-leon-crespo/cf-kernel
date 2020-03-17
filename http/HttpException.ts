import {ParameterBag} from "./ParameterBag";

export class HttpException extends Error {

    private _code: number;
    private _httpStatus: number;
    private _httpContent: string;
    private _message: string;
    private _headers: ParameterBag;

    public constructor(
        code: number,
        httpStatus: number,
        httpContent: string,
        message: string,
        headers?: ParameterBag
    ) {
        super(message);
        this._code = code;
        this._httpStatus = httpStatus;
        this._httpContent = httpContent;
        this._message = message;
        if (!headers) {
            this._headers = new ParameterBag();
        } else {
            this._headers = headers;
        }
    }

    public getCode(): number {
        return this._code;
    }

    public setCode(value: number) {
        this._code = value;
        return this;
    }

    public getHttpStatus(): number {
        return this._httpStatus;
    }

    public setHttpStatus(value: number) {
        this._httpStatus = value;
        return this;
    }

    public getHttpContent(): string {
        return this._httpContent;
    }

    public setHttpContent(value: string) {
        this._httpContent = value;
        return this;
    }

    public getMessage(): string {
        return this._message;
    }

    public setMessage(value: string) {
        this._message = value;
        return this;
    }

    public setHeaders(value: ParameterBag) {
        this._headers = value;
        return this;
    }

    public getHeaders(): ParameterBag {
        return this._headers;
    }
}
