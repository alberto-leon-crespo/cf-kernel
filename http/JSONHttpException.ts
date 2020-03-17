import {HttpException} from "./HttpException";
import {ParameterBag} from "./ParameterBag";

export class JSONHttpException extends HttpException {
    public constructor(
        code: number,
        httpStatus: number,
        JSONHttpContent: object,
        message: string,
        headers?: ParameterBag
    ) {
        let defaultHeaders = headers;
        if (!headers) {
            defaultHeaders = new ParameterBag();
        }
        super(code, httpStatus, JSON.stringify(JSONHttpContent), message, defaultHeaders);
    }

    public getHttpContent(): string {
        return JSON.parse(super.getHttpContent());
    }

    public setHttpContent(value: any): this {
        super.setHttpContent(JSON.stringify(value));
        return this;
    }
}
