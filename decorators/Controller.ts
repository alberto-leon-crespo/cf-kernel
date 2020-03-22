import { BaseController } from "../BaseController";

export const Controller = <T extends BaseController>(constructor: Function) => {
    let originalController = new constructor();
    return class extends BaseController {
        constructor() {
            super();
            const methods = Object.getOwnPropertyNames(constructor.prototype);
            const properties = Object.getOwnPropertyNames(originalController);
            for (const methodName of methods) {
                this[methodName] = originalController[methodName];
            }
            for (const propertyName of properties) {
                this[propertyName] = originalController[propertyName];
            }
        }
    };
};