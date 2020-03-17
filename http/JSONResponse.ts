import {Response} from "./Response";

export class JSONResponse extends Response {
    public constructor(data: any, statusCode: number, headers: any = {}) {
        super(JSON.stringify(data), statusCode, headers);
        this._headers.set("Content-Type", "application/json");
        return this;
    }
}