import {ContainerBuilder} from "node-dependency-injection";

export interface BaseComponentInterface {
    load(containerBuilder: ContainerBuilder): void;
}
