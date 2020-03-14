import { BaseController } from "../kernel/BaseController";

export const Controller = <T extends BaseController>(constructor: Function): T => {
    return class extends BaseController {
        constructor() {
            super();
        }
    };
};
