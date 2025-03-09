import { Tool } from "@goat-sdk/core";
import { EVMWalletClient } from "@goat-sdk/wallet-evm";
import { ERC20_ABI, MACRO_FORWARDER_ABI, SB_MACRO_ABI, SUPERBORING_ABI, SUPER_TOKEN_ABI, TOREX_ABI } from "./abi";
import {
    ApproveTokenParameters,
    BuildBatchOperationsParameters,
    GetAllowanceParameters,
    GetBalanceParameters,
    GetPairedTokensParameters,
    GetParamsParameters,
    GetUnderlyingTokenParameters,
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
                abi: SB_MACRO_ABI,
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
                abi: SUPERBORING_ABI,
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
                abi: SUPERBORING_ABI,
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

    @Tool({
        name: "get_paired_tokens",
        description: "Get the paired tokens (inToken and outToken) for a Torex contract",
    })
    async getPairedTokens(walletClient: EVMWalletClient, parameters: GetPairedTokensParameters) {
        try {
            const result = await walletClient.read({
                address: parameters.torexAddr,
                abi: TOREX_ABI,
                functionName: "getPairedTokens",
            });
            return result;
        } catch (error) {
            throw Error(`Failed to get paired tokens: ${error}`);
        }
    }

    @Tool({
        name: "get_underlying_token",
        description: "Get the underlying token for a SuperToken",
    })
    async getUnderlyingToken(walletClient: EVMWalletClient, parameters: GetUnderlyingTokenParameters) {
        try {
            const result = await walletClient.read({
                address: parameters.superTokenAddr,
                abi: SUPER_TOKEN_ABI,
                functionName: "getUnderlyingToken",
            });
            return result;
        } catch (error) {
            throw Error(`Failed to get underlying token: ${error}`);
        }
    }

    @Tool({
        name: "get_balance",
        description: "Get the balance of an ERC20 token for an account",
    })
    async getBalance(walletClient: EVMWalletClient, parameters: GetBalanceParameters) {
        try {
            const result = await walletClient.read({
                address: parameters.tokenAddr,
                abi: ERC20_ABI,
                functionName: "balanceOf",
                args: [parameters.account],
            });
            return result;
        } catch (error) {
            throw Error(`Failed to get balance: ${error}`);
        }
    }

    @Tool({
        name: "get_allowance",
        description: "Get the allowance of an ERC20 token for a spender",
    })
    async getAllowance(walletClient: EVMWalletClient, parameters: GetAllowanceParameters) {
        try {
            const result = await walletClient.read({
                address: parameters.tokenAddr,
                abi: ERC20_ABI,
                functionName: "allowance",
                args: [parameters.owner, parameters.spender],
            });
            return result;
        } catch (error) {
            throw Error(`Failed to get allowance: ${error}`);
        }
    }

    @Tool({
        name: "approve_token",
        description: "Approve a spender to spend an amount of an ERC20 token",
    })
    async approveToken(walletClient: EVMWalletClient, parameters: ApproveTokenParameters) {
        try {
            const hash = await walletClient.sendTransaction({
                to: parameters.tokenAddr,
                abi: ERC20_ABI,
                functionName: "approve",
                args: [parameters.spender, parameters.amount],
            });
            return hash.hash;
        } catch (error) {
            throw Error(`Failed to approve token: ${error}`);
        }
    }
}
