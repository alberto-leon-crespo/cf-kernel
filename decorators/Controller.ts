import { BaseController } from "../BaseController";

export const Controller = <T extends BaseController>(constructor: Function): T => {
    return class extends BaseController {
        constructor() {
            super();
        }
    };
};