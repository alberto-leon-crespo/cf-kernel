import * as path from "path";
import {BaseEvent} from "../BaseEvent";
import {Response} from "../http/Response";
import {JSONResponse} from "../http/JSONResponse";

export const View = (headers: any = {}) => {
    return async (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) => {
        const kernel = await import(path.join(path.resolve("."), process.argv[1]));
        kernel._Container.get('eventmanager').getEventEmitter().on("onPostController", (event: BaseEvent) => {
            const response = event.getResponse();
            const checkIfResponse = response instanceof Response;
            const checkIfJSONResponse = response instanceof JSONResponse;
            if (checkIfResponse === false || checkIfJSONResponse === false) {
                if (typeof response === "object") {
                    event.setResponse(new Response(JSON.stringify(response), 200, headers));
                } else if (typeof response === "string") {
                    event.setResponse(new Response(response, 200, headers));
                }
            }
        });
        return descriptor;
    };
};
