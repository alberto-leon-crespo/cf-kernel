import {BaseEvent} from "../BaseEvent";
import {BaseKernel} from "../BaseKernel";
import {EventEmitter} from "events";
import fs from "fs";
import http from "http";
import https from "https";
import path from "path";
import {pathToRegexp} from "path-to-regexp";
import url from "url";
import {Request} from "./Request";
import {Response} from "./Response";

export class Server {

    private _server: any;
    private _request: Request;
    private _kernel: BaseKernel;
    private _eventEmitter: EventEmitter;
    private _response: any;
    private _port: number;
    private _ip: string;
    private _ssl: boolean;
    private _registeredRoutes: any = [];
    private _stopEventPropagation: boolean;

    public constructor(port: number, ip: string, ssl: boolean | object) {
        this._request = new Request();
        this._port = port;
        this._ip = ip || "0.0.0.0";
        const defaultSSLServerOptions = {
            cert: fs.readFileSync(path.join(__dirname, "certs", "cert.pem")),
            key: fs.readFileSync(path.join(__dirname, "certs", "key.pem")),
            passphrase: "CarbonFrog"
        };
        let serverOptions = null;
        if (typeof ssl === "object") {
            serverOptions = ssl;
            this._ssl = true;
        } else if (typeof ssl === "boolean" && ssl === true) {
            console.log("Using default SSL certificates of Carbonfrog. You can specify your own certificates with options object.");
            serverOptions = defaultSSLServerOptions;
            this._ssl = true;
        } else if (typeof ssl === "boolean" && ssl === false) {
            this._ssl = false;
        } else {
            this._ssl = false;
        }
        this._stopEventPropagation = false;
        if (this._ssl) {
            this._server = https;
            this._request.setHttpScheme("https");
            if (serverOptions) {
                this._server = this._server.createServer(
                    serverOptions,
                    (request: any, response: any) => {
                        this._response = response;
                        this.handleRequest(request);
                    }
                );
            } else {
                this._server = this._server.createServer((request: any, response: any) => {
                        this._response = response;
                        this.handleRequest(request);
                    }
                );
            }
        } else {
            this._server = http;
            this._request.setHttpScheme("http");
            this._server = this._server.createServer((request: any, response: any) => {
                this._response = response;
                this.handleRequest(request);
            });
        }
    }

    public setKernel(kernel: BaseKernel) {
        this._kernel = kernel;
        return this;
    }

    public setEventManager(eventManager: any) {
        this._eventEmitter = eventManager.getEventEmitter();
        return this;
    }

    public getEventManager() {
        return this._eventEmitter;
    }

    public stopEventPropagation() {
        this._stopEventPropagation = true;
    }

    public startEventPropagation() {
        this._stopEventPropagation = false;
    }

    public registerRoute(method: string, path: string, controller: object, controllerMethod: string) {
        for (const routeIndex in this._registeredRoutes) {
            if (this._registeredRoutes[routeIndex].path === path) {
                delete this._registeredRoutes[routeIndex];
            }
        }
        this._registeredRoutes.push({
            path,
            method: method.toUpperCase(),
            controller,
            controllerMethod
        });
        return this;
    }

    public start() {
       this._server.listen(this._port, this._ip, (error: any) => {
           if (error) {
               console.log("Error runing server", error);
           }
           console.log(`Server listening ${this._ip} on port ${this._port}`);
       });
    }

    public handleResponse(response: Response) {

        if (!this._stopEventPropagation) {
            const onResponseEvent = new BaseEvent();

            onResponseEvent.setKernel(this._kernel);
            onResponseEvent.setRequest(this._request);
            onResponseEvent.setResponse(response);

            this._eventEmitter.emit("onResponse", onResponseEvent);
        }

        this._response.writeHead(response.getStatusCode(), response.getStatusText(), response.getHeaders().all());
        this._response.end(response.getContent());
    }

    private handleRequest(request: any) {

        const urlParts = url.parse(request.url, true);
        const urlParams = urlParts.query;
        const urlPathname = urlParts.pathname;
        let requestBody: string = "";

        request.on("data", (chunk: any) => {
            requestBody += chunk.toString(); // convert Buffer to string
        });

        request.on("end", async () => {
            this._request.setBody(requestBody);
            if (this._request.headers.get("content-type") === "application/x-www-form-urlencoded") {
                requestBody.split("&").map((value: string) => {
                    const valueParts = value.split("=");
                    this._request.request.set(valueParts[0], valueParts[1]);
                });
            }
            this._request.setMethod(request.method.toUpperCase());
            this._request.setBasePath(urlPathname);
            this._request.setBaseUrl(this._request.getHttpScheme() + ":://" + request.headers.host);
            this._request.setRequestUri(this._request.getHttpScheme() + ":://" + request.headers.host + urlParts.path);

            if (request.headers) {
                for (const headerName in request.headers) {
                    this._request.headers.set(headerName, request.headers[headerName]);
                }
            }

            if (request.query) {
                for (const parameterName in urlParams) {
                    this._request.query.set(parameterName, request.query[parameterName]);
                }
            }

            const cookies = this.parseCookies(request.headers.cookie);

            if (cookies) {
                for (const cookieName in cookies) {
                    this._request.cookies.set(cookieName, cookies[cookieName]);
                }
            }

            if (request.headers["accept-encoding"]) {
                const acceptableEncodings = request
                    .headers["accept-encoding"]
                    .split(",")
                    .map((value: string) => {
                        return value.trim();
                    });
                this._request.setEncodings(acceptableEncodings);
            }

            if (request.headers.accept) {
                const acceptableContentTypes = request
                    .headers.accept
                    .split(",")
                    .map((value: string) => {
                        if (value.indexOf(";q=") !== -1) {
                            value = value.split(";q=")[0];
                        }
                        return value.trim();
                    });
                this._request.setEncodings(acceptableContentTypes);
            }

            for (const registeredRoutesKey in this._registeredRoutes) {
                const keys: any = [];
                const matchedParams = pathToRegexp(this._registeredRoutes[registeredRoutesKey].path, keys);
                const urlParams = matchedParams.exec(this._request.getBasePath());
                const replacedRegisteredRoutePath = this._request.getBasePath();
                if (urlParams !== null) {
                    for (let i = 0; i < keys.length; i++) {
                        this._request.params.set(keys[i].name, urlParams[i + 1]);
                        replacedRegisteredRoutePath.replace(":" + keys[i].name, urlParams[i + 1]);
                    }
                }
                this._kernel.getContainer().set("request", this._request);

                if (!this._stopEventPropagation) {
                    const onRequestEvent = new BaseEvent();

                    onRequestEvent.setKernel(this._kernel);
                    onRequestEvent.setRequest(this._request);
                    onRequestEvent.setResponse(null);

                    this._eventEmitter.emit("onRequest", onRequestEvent);
                }

                if (
                    this._request.getBasePath() === replacedRegisteredRoutePath &&
                    this._request.getMethod() === this._registeredRoutes[registeredRoutesKey].method &&
                    urlParams !== null
                ) {
                    this._request.params.set("_route", replacedRegisteredRoutePath);
                    const controller = this._registeredRoutes[registeredRoutesKey].controller;
                    const controllerMethod = this._registeredRoutes[registeredRoutesKey].controllerMethod;
                    try {
                        if (!this._stopEventPropagation) {
                            const onPreControllerEvent = new BaseEvent();

                            onPreControllerEvent.setKernel(this._kernel);
                            onPreControllerEvent.setRequest(this._request);
                            onPreControllerEvent.setResponse(null);

                            this._eventEmitter.emit("onPreController", onPreControllerEvent);
                        }

                        let controllerResponse = await controller[controllerMethod](this._request);

                        if (!this._stopEventPropagation) {
                            const onPostControllerEvent = new BaseEvent();

                            onPostControllerEvent.setKernel(this._kernel);
                            onPostControllerEvent.setRequest(this._request);
                            onPostControllerEvent.setResponse(controllerResponse);

                            this._eventEmitter.emit("onPostController", onPostControllerEvent);

                            controllerResponse = onPostControllerEvent.getResponse();
                        }

                        this.handleResponse(controllerResponse);

                    } catch (e) {

                        if (!this._stopEventPropagation) {

                            const onErrorEvent = new BaseEvent();

                            onErrorEvent.setKernel(this._kernel);
                            onErrorEvent.setRequest(this._request);
                            onErrorEvent.setResponse(null);
                            onErrorEvent.setException(e);

                            this._eventEmitter.emit("onError", onErrorEvent);

                            this.handleResponse(onErrorEvent.getResponse());
                        }
                    }
                }
            }

            const notFoundResponse = {
                message: "Resource not foud."
            };

            const headers = {
                "Content-Type": "application/json"
            };

            this._response.statusCode = 404;
            this._response.writeHead(404, "Not Found", headers);
            this._response.end(JSON.stringify(notFoundResponse));

            if (!this._stopEventPropagation) {
                const onTerminateEvent = new BaseEvent();

                onTerminateEvent.setKernel(this._kernel);
                onTerminateEvent.setRequest(this._request);
                onTerminateEvent.setResponse(null);

                this._eventEmitter.emit("onTerminate", onTerminateEvent);
            }
        });
    }

    private parseCookies(cookieHeader: string) {
        const list: any = {};
        const rc = cookieHeader;
        rc && rc.split(";").forEach((cookie: string) => {
           const parts = cookie.split("=");
           list[parts.shift().trim()] = decodeURI(parts.join("="));
        });
        return list;
    }
}
