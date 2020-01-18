// @ts-ignore
import { ContainerBuilder } from "node-dependency-injection";

export class BaseController {

    private container: ContainerBuilder;

    public setContainer(containerBuilder: ContainerBuilder) {
        this.container = containerBuilder;
        return this;
    }

    public get(serviceId: string) {
        return this.container.get(serviceId);
    }

    public set(serviceId: string, classInstance: object): BaseController {
        this.container.set(serviceId, classInstance);
        return this;
    }

    public getParameter(parameterName: string): any {
        return this.container.getParameter(parameterName);
    }

    public setParameter(parameterName: string, value: any): BaseController {
        this.container.setParameter(parameterName, value);
        return this;
    }
}