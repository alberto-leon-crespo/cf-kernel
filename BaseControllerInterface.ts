import {ContainerBuilder} from "node-dependency-injection";
import {BaseController} from "./BaseController";

export interface BaseControllerInterface {
    setContainer(containerBuilder: ContainerBuilder): this;
    get(serviceId: string): object;
    set(serviceId: string, classInstance: object): BaseController;
    getParameter(parameterName: string): any;
    setParameter(parameterName: string, value: any): BaseController;
}
