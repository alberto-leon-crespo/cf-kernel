import {ParameterBag} from "./ParameterBag";

export class Request {

    private _headers: ParameterBag;
    private _query: ParameterBag;
    private _request: ParameterBag;
    private _cookies: ParameterBag;
    private _params: ParameterBag;
    private _body: string;
    private _method: string;
    private _baseUrl: string;
    private _basePath: string;
    private _requestUri: string;
    private _httpScheme: string;
    private _charsets: any[];
    private _encodings: any[];
    private _acceptableContentTypes: any[];

    public constructor(){
        this._headers = new ParameterBag();
        this._query = new ParameterBag();
        this._request = new ParameterBag();
        this._cookies = new ParameterBag();
        this._params = new ParameterBag();
    }

    get headers(): ParameterBag {
        return this._headers;
    }

    set headers(value: ParameterBag) {
        this._headers = value;
    }

    get query(): ParameterBag {
        return this._query;
    }

    set query(value: ParameterBag) {
        this._query = value;
    }

    get request(): ParameterBag {
        return this._request;
    }

    set request(value: ParameterBag) {
        this._request = value;
    }

    get cookies(): ParameterBag {
        return this._cookies;
    }

    set cookies(value: ParameterBag) {
        this._cookies = value;
    }

    get params(): ParameterBag {
        return this._params;
    }

    set params(value: ParameterBag) {
        this._params = value;
    }

    public getBody(): string {
        return this._body;
    }

    public setBody(value: string) {
        this._body = value;
        return this;
    }

    public getMethod(): string {
        return this._method;
    }

    public setMethod(value: string) {
        this._method = value;
        return this;
    }

    public getBaseUrl(): string {
        return this._baseUrl;
    }

    public setBaseUrl(value: string) {
        this._baseUrl = value;
        return this;
    }

    public getBasePath(): string {
        return this._basePath;
    }

    public setBasePath(value: string) {
        this._basePath = value;
        return this;
    }

    public getRequestUri(): string {
        return this._requestUri;
    }

    public setRequestUri(value: string) {
        this._requestUri = value;
        return this;
    }

    public getCharsets(): any[] {
        return this._charsets;
    }

    public setCharsets(value: any[]) {
        this._charsets = value;
        return this;
    }

    public getEncodings(): any[] {
        return this._encodings;
    }

    public setEncodings(value: any[]) {
        this._encodings = value;
        return this;
    }

    public getAcceptableContentTypes(): any[] {
        return this._acceptableContentTypes;
    }

    public setAcceptableContentTypes(value: any[]) {
        this._acceptableContentTypes = value;
        return this;
    }

    public getHttpScheme() {
        return this._httpScheme;
    }

    public setHttpScheme(value: string) {
        this._httpScheme = value;
        return this;
    }
}
