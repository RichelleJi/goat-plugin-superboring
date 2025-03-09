import { PluginBase } from "@goat-sdk/core";
import { SuperboringService } from "./superboring.service";

export class SuperboringPlugin extends PluginBase {
    constructor() {
        super("superboring", [new SuperboringService()]);
    }

    supportsChain = () => true;
}

export function superboring() {
    return new SuperboringPlugin();
}
