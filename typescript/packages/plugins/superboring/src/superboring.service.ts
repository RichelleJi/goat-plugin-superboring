import { Tool } from "@goat-sdk/core";
import { EVMWalletClient } from "@goat-sdk/wallet-evm";
import { MACRO_FORWARDER_ABI, SB_MACRO_CONTRACT_ABI } from "./abi";
import {
    BuildBatchOperationsParameters,
    GetParamsParameters,
    PostCheckParameters,
    RunMacroParameters,
} from "./parameters";

export class SuperboringService {
    // Constants for contract addresses based on SuperBoring.jsx
    private readonly SB_MACRO_ADDRESS = "0x383329703f346d72F4b86111a502daaa8f2c69C7"; // Optimism Mainnet
    private readonly MACRO_FORWARDER_ADDRESS = "0xfD01285b9435bc45C243E5e7F978E288B2912de6";

    @Tool({
        name: "get_params",
        description: "Get encoded parameters for SuperBoring DCA flow",
    })
    async getParams(walletClient: EVMWalletClient, parameters: GetParamsParameters) {
        try {
            const result = await walletClient.read({
                address: this.SB_MACRO_ADDRESS,
                abi: SB_MACRO_CONTRACT_ABI,
                functionName: "getParams",
                args: [
                    parameters.torexAddr,
                    parameters.flowRate,
                    parameters.distributor,
                    parameters.referrer,
                    parameters.upgradeAmount,
                ],
            });
            return result;
        } catch (error) {
            throw Error(`Failed to get params: ${error}`);
        }
    }

    @Tool({
        name: "build_batch_operations",
        description: "Build batch operations for SuperBoring contract",
    })
    async buildBatchOperations(walletClient: EVMWalletClient, parameters: BuildBatchOperationsParameters) {
        try {
            const result = await walletClient.read({
                address: this.SB_MACRO_ADDRESS,
                abi: SB_MACRO_CONTRACT_ABI,
                functionName: "buildBatchOperations",
                args: [parameters.host, parameters.params, parameters.msgSender],
            });
            return result;
        } catch (error) {
            throw Error(`Failed to build batch operations: ${error}`);
        }
    }

    @Tool({
        name: "post_check",
        description: "Perform post check for SuperBoring contract",
    })
    async postCheck(walletClient: EVMWalletClient, parameters: PostCheckParameters) {
        try {
            const result = await walletClient.read({
                address: this.SB_MACRO_ADDRESS,
                abi: SB_MACRO_CONTRACT_ABI,
                functionName: "postCheck",
                args: [parameters.host, parameters.params, parameters.msgSender],
            });
            return result;
        } catch (error) {
            throw Error(`Failed to perform post check: ${error}`);
        }
    }

    @Tool({
        name: "run_macro",
        description: "Run a SuperBoring macro to start a DCA position",
    })
    async runMacro(walletClient: EVMWalletClient, parameters: RunMacroParameters) {
        try {
            const hash = await walletClient.sendTransaction({
                to: this.MACRO_FORWARDER_ADDRESS,
                abi: MACRO_FORWARDER_ABI,
                functionName: "runMacro",
                args: [parameters.macroAddress, parameters.params],
            });
            return hash.hash;
        } catch (error) {
            throw Error(`Failed to run macro: ${error}`);
        }
    }
}
