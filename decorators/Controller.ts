import { BaseController } from "../BaseController";

export const Controller = <T extends BaseController>(constructor: any): T => {
    return new(class extends BaseController {
        constructor() {
            super();
        }
    })() as T;
};
