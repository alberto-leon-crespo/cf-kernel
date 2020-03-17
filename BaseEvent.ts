import {Request} from "@carbonfrog/http/Request";
import {Response} from "@carbonfrog/http/Response";
import {BaseKernel} from "./BaseKernel";

export class BaseEvent {

    private _request: Request;
    private _kernel: BaseKernel;
    private _response: Response;
    private _exception: Error;

    public setRequest(request: Request) {
        this._request = request;
    }

    public setKernel(kernel: BaseKernel) {
        this._kernel = kernel;
    }

    public setResponse(response: Response) {
        this._response = response;
    }

    public getRequest() {
        return this._request;
    }

    public getKernel() {
        return this._kernel;
    }

    public getResponse() {
        return this._response;
    }

    public setException(exception: Error) {
        this._exception = exception;
        return this;
    }

    public getException() {
        return this._exception;
    }
}
