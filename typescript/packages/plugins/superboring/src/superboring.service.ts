import { Tool } from "@goat-sdk/core";
import { EVMWalletClient } from "@goat-sdk/wallet-evm";
import { ethers } from "ethers";
import { ERC20_ABI, MACRO_FORWARDER_ABI, SB_MACRO_ABI, SUPER_TOKEN_ABI, TOREX_ABI } from "./abi";
import {
    ApproveTokenParameters,
    GetAllowanceParameters,
    GetBalanceParameters,
    GetPairedTokensParameters,
    GetParamsParameters,
    GetUnderlyingTokenParameters,
    PostCheckParameters,
    RunMacroParameters,
} from "./parameters";

export class SuperboringService {
    private readonly SB_MACRO_ADDRESS = "0x34Db26737185671215fB90E2F8C6fd8C4F8eB944"; // Optimism Sepolia
    private readonly MACRO_FORWARDER_ADDRESS = "0xfD01285b9435bc45C243E5e7F978E288B2912de6";
    private readonly RPC_URL = "https://sepolia.optimism.io";

    /**
     * Start a SuperBoring DCA (Dollar-Cost Averaging) position
     * @param walletClient An EVMWalletClient instance
     * @param parameters Configuration parameters for the DCA position
     * @returns Transaction hash of the DCA position creationi
     * reference to: https://docs.superboring.xyz/docs/integrate/integration-guide
     */
    @Tool({
        name: "startSuperBoringDCAPosition",
        description: "Start a SuperBoring DCA (Dollar-Cost Averaging) position",
    })
    async startSuperBoringDCAPosition(walletClient: EVMWalletClient, parameters: GetParamsParameters) {
        try {
            // Get provider and wallet address
            const provider = new ethers.JsonRpcProvider(this.RPC_URL);
            const walletAddress = walletClient.getAddress();
            const signer = await provider.getSigner();

            // Create contract instances
            const macroForwarder = new ethers.Contract(this.MACRO_FORWARDER_ADDRESS, MACRO_FORWARDER_ABI, signer);
            const sbMacro = new ethers.Contract(this.SB_MACRO_ADDRESS, SB_MACRO_ABI, provider);

            // Parse values
            const flowRateBN = ethers.parseEther(parameters.flowRate);
            const upgradeAmountBN = ethers.parseEther(parameters.upgradeAmount);
            const inTokenAddr = await getInTokenAddr(parameters.torexAddr, provider);

            // Get underlying token address
            const superToken = new ethers.Contract(inTokenAddr, SUPER_TOKEN_ABI, provider);
            const allowance = await fetchAllowance(inTokenAddr, inTokenAddr, provider, walletAddress);
            const underlyingTokenAddress = await getUnderlyingAddr(inTokenAddr, provider);

            if (allowance !== null && BigInt(upgradeAmountBN) > BigInt(ethers.parseEther(allowance))) {
                if (underlyingTokenAddress !== ethers.ZeroAddress) {
                    const erc20 = new ethers.Contract(underlyingTokenAddress, ERC20_ABI, signer);
                    const approveTx = await erc20.approve(inTokenAddr, upgradeAmountBN);
                    await approveTx.wait();
                    console.log("Approval successful. Starting DCA position.");
                }
            }

            const params = await sbMacro.getParams(
                parameters.torexAddr,
                flowRateBN,
                parameters.distributor || ethers.ZeroAddress,
                parameters.referrer || ethers.ZeroAddress,
                upgradeAmountBN,
            );

            const tx = await macroForwarder.runMacro(this.SB_MACRO_ADDRESS, params);
            await tx.wait();
        } catch (err) {
            console.error(err);
        }
    }
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

    async postCheck(walletClient: EVMWalletClient, parameters: PostCheckParameters) {
        try {
            const result = await walletClient.read({
                address: this.SB_MACRO_ADDRESS,
                abi: SB_MACRO_ABI,
                functionName: "postCheck",
                args: [parameters.host, parameters.params, parameters.msgSender],
            });
            return result;
        } catch (error) {
            throw Error(`Failed to perform post check: ${error}`);
        }
    }

    // @Tool({
    //     name: "run_macro",
    //     description: "Run a SuperBoring macro to start a DCA position",
    // })
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
async function getUnderlyingAddr(inTokenAddr: string, provider: ethers.Provider): Promise<string> {
    const superToken = new ethers.Contract(inTokenAddr, SUPER_TOKEN_ABI, provider);
    const underlyingAddr = await superToken.getUnderlyingToken();
    return underlyingAddr;
}

const fetchAllowance = async (
    tokenAddress: string,
    superTokenAddress: string,
    provider: ethers.Provider,
    walletAddress: string,
): Promise<string | null> => {
    //console.log('inTokenAddr', inTokenAddr);
    try {
        if (tokenAddress === ethers.ZeroAddress) {
            // Native token (ETH)
            const balance = await provider.getBalance(walletAddress);
            return null;
        }
        // ERC20 token
        const erc20 = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
        console.log(tokenAddress);
        const balance = await erc20.balanceOf(walletAddress);
        console.log(balance);
        console.log(superTokenAddress);
        const allowance = await erc20.allowance(walletAddress, superTokenAddress);
        return ethers.formatEther(allowance);
    } catch (error) {
        console.error("Error fetching balance and allowance:", error);
        return null; // Return null in case of error
    }
};
async function getInTokenAddr(torexAddr: string, provider: ethers.Provider) {
    const torex = new ethers.Contract(torexAddr, TOREX_ABI, provider);

    const [inTokenAddr] = await torex.getPairedTokens();
    return inTokenAddr;
}
