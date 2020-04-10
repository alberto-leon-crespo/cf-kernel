import {ContainerBuilder} from "node-dependency-injection";

export interface BaseComponentInterface {
    loadComponent(containerBuilder: ContainerBuilder): void;
}
