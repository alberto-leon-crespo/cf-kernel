import {ParameterBag} from "./ParameterBag";

export class Response {
    protected _headers: ParameterBag = new ParameterBag();
    protected _content: string = "";
    protected _statusCode: number = 200;
    protected _statusText: string = "OK";
    protected _protocolVersion: string = "1.0";
    private _statusTexts: any = {
        100: "Continue",
        101: "Switching Protocols",
        102: "Processing",            // RFC2518
        103: "Early Hints",
        200: "OK",
        201: "Created",
        202: "Accepted",
        203: "Non-Authoritative Information",
        204: "No Content",
        205: "Reset Content",
        206: "Partial Content",
        207: "Multi-Status",          // RFC4918
        208: "Already Reported",      // RFC5842
        226: "IM Used",               // RFC3229
        300: "Multiple Choices",
        301: "Moved Permanently",
        302: "Found",
        303: "See Other",
        304: "Not Modified",
        305: "Use Proxy",
        307: "Temporary Redirect",
        308: "Permanent Redirect",    // RFC7238
        400: "Bad Request",
        401: "Unauthorized",
        402: "Payment Required",
        403: "Forbidden",
        404: "Not Found",
        405: "Method Not Allowed",
        406: "Not Acceptable",
        407: "Proxy Authentication Required",
        408: "Request Timeout",
        409: "Conflict",
        410: "Gone",
        411: "Length Required",
        412: "Precondition Failed",
        413: "Payload Too Large",
        414: "URI Too Long",
        415: "Unsupported Media Type",
        416: "Range Not Satisfiable",
        417: "Expectation Failed",
        418: "I\"m a teapot",                                               // RFC2324
        421: "Misdirected Request",                                         // RFC7540
        422: "Unprocessable Entity",                                        // RFC4918
        423: "Locked",                                                      // RFC4918
        424: "Failed Dependency",                                           // RFC4918
        425: "Too Early",                                                   // RFC-ietf-httpbis-replay-04
        426: "Upgrade Required",                                            // RFC2817
        428: "Precondition Required",                                       // RFC6585
        429: "Too Many Requests",                                           // RFC6585
        431: "Request Header Fields Too Large",                             // RFC6585
        451: "Unavailable For Legal Reasons",                               // RFC7725
        500: "Internal Server Error",
        501: "Not Implemented",
        502: "Bad Gateway",
        503: "Service Unavailable",
        504: "Gateway Timeout",
        505: "HTTP Version Not Supported",
        506: "Variant Also Negotiates",                                     // RFC2295
        507: "Insufficient Storage",                                        // RFC4918
        508: "Loop Detected",                                               // RFC5842
        510: "Not Extended",                                                // RFC2774
        511: "Network Authentication Required",                             // RFC6585
    };

    public constructor(content: string, statusCode: number, headers: any = {}) {
        this._headers.set("Content-Type", "text/html");
        for (const headerName in headers) {
            this._headers.set(headerName, headers[headerName]);
        }
        this._content = content;
        this._statusCode = statusCode;
        if (this._statusTexts[statusCode]) {
            this._statusText = this._statusTexts[statusCode];
        }
        return this;
    }

    public toString() {
        let httpResponse = "HTTP/" + this._protocolVersion + " " + this._statusCode + " " + this._statusText + "\r\n";
        httpResponse += this._headers.all() + "\r\n";
        httpResponse += this._content;

        return httpResponse;
    }

    public setHeaders(headers: any[]) {
        this._headers.flush();
        for (const headerName in headers) {
            this._headers.set(headerName, headers[headerName]);
        }
    }

    public getHeaders() {
        return this._headers;
    }

    public setContent(content: string) {
        this._content = content;
        return this;
    }

    public getContent() {
        return this._content;
    }

    public setStatusCode(statusCode: number) {
        this._statusCode = statusCode;
        if (this._statusTexts[statusCode]) {
            this._statusText = this._statusTexts[statusCode];
        }
        return this;
    }

    public getStatusCode() {
        return this._statusCode;
    }

    public getStatusText() {
        return this._statusText;
    }

    public setProtocolVersion(protocolVersion: string) {
        this._protocolVersion = protocolVersion;
        return this;
    }

    public getProtocolVersion() {
        return this._protocolVersion;
    }

    public pushHeader(headerName: string, headerValue: string) {
        this._headers.set(headerName, headerValue);
    }
}
