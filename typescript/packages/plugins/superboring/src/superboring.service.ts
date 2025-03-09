import { Tool } from "@goat-sdk/core";
import { EVMWalletClient } from "@goat-sdk/wallet-evm";
import { ExampleParameters } from "./parameters";

export class SuperboringService {
    @Tool({
        name: "superboring_example",
        description: "An example method in SuperboringService",
    })
    async doSomething(walletClient: EVMWalletClient, parameters: ExampleParameters) {
        // Implementation goes here
        return "Hello from SuperboringService!";
    }
}
