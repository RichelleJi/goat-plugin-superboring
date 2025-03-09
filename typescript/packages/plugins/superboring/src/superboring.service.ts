import { Tool } from "@goat-sdk/core";
import { EVMWalletClient } from "@goat-sdk/wallet-evm";
import { ethers } from "ethers";
import { ERC20_ABI, MACRO_FORWARDER_ABI, SB_MACRO_ABI, SUPER_TOKEN_ABI, TOREX_ABI } from "./abi";
import { GetParamsParameters } from "./parameters";

export class SuperboringService {
    private readonly SB_MACRO_ADDRESS = "0x34Db26737185671215fB90E2F8C6fd8C4F8eB944"; // Optimism Sepolia
    private readonly MACRO_FORWARDER_ADDRESS = "0xfD01285b9435bc45C243E5e7F978E288B2912de6";
    private readonly RPC_URL = "https://sepolia.optimism.io";

    /**
     * Start a SuperBoring DCA (Dollar-Cost Averaging) position
     * @param walletClient An EVMWalletClient instance
     * @param parameters Configuration parameters for the DCA position
     * @returns Transaction hash of the DCA position creation
     */
    @Tool({
        name: "startSuperBoringDCAPosition",
        description: "Get encoded parameters for SuperBoring DCA flow",
    })
    async startSuperBoringDCAPosition(walletClient: EVMWalletClient, parameters: GetParamsParameters) {
        try {
            // Get provider and wallet address
            const provider = new ethers.JsonRpcProvider(this.RPC_URL);
            const walletAddress = await walletClient.getAddress();

            // Create contract instances
            const sbMacro = new ethers.Contract(this.SB_MACRO_ADDRESS, SB_MACRO_ABI, provider);

            // Parse values
            const flowRateBN = ethers.parseEther(parameters.flowRate);
            const upgradeAmountBN = ethers.parseEther(parameters.upgradeAmount);

            // Get token information
            const torex = new ethers.Contract(parameters.torexAddr, TOREX_ABI, provider);
            const [inTokenAddr] = await torex.getPairedTokens();

            // Get underlying token address
            const superToken = new ethers.Contract(inTokenAddr, SUPER_TOKEN_ABI, provider);
            const underlyingTokenAddress = await superToken.getUnderlyingToken();

            // Check allowance if needed
            if (underlyingTokenAddress !== ethers.ZeroAddress) {
                const erc20 = new ethers.Contract(underlyingTokenAddress, ERC20_ABI, provider);
                const allowance = await erc20.allowance(walletAddress, inTokenAddr);

                // If allowance is insufficient, approve the token
                if (BigInt(upgradeAmountBN) > BigInt(allowance)) {
                    // We'll use walletClient to send the approval transaction
                    const approveTx = await walletClient.sendTransaction({
                        to: underlyingTokenAddress,
                        abi: ERC20_ABI,
                        functionName: "approve",
                        args: [inTokenAddr, upgradeAmountBN],
                    });
                    // No need to wait for confirmation in this implementation
                    // The transaction will be processed by the blockchain
                }
            }

            // Get encoded parameters
            const params = await sbMacro.getParams(
                parameters.torexAddr,
                flowRateBN,
                parameters.distributor || ethers.ZeroAddress,
                parameters.referrer || ethers.ZeroAddress,
                upgradeAmountBN,
            );

            // Execute the transaction
            const tx = await walletClient.sendTransaction({
                to: this.MACRO_FORWARDER_ADDRESS,
                abi: MACRO_FORWARDER_ABI,
                functionName: "runMacro",
                args: [this.SB_MACRO_ADDRESS, params],
            });

            return tx.hash;
        } catch (error: any) {
            throw new Error(`Failed to start SuperBoring DCA position: ${error.message}`);
        }
    }
}

async function getUnderlyingAddr(inTokenAddr: string, superTokenABI: any[], provider: ethers.BrowserProvider): Promise<string> {
    const superToken = new ethers.Contract(inTokenAddr, superTokenABI, provider);
    const underlyingAddr = await superToken.getUnderlyingToken();
    return underlyingAddr;
}

const fetchAllowance = async (
    tokenAddress: string, 
    superTokenAddress: string, 
    provider: ethers.Provider, 
    walletAddress: string
): Promise<string | null> => {
    //console.log('inTokenAddr', inTokenAddr);
    try {
        if (tokenAddress === ethers.ZeroAddress) {
            // Native token (ETH)
            const balance = await provider.getBalance(walletAddress);
            return null;
        } else {
            // ERC20 token
            const erc20 = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
            console.log(tokenAddress);
            const balance = await erc20.balanceOf(walletAddress);
            console.log(balance);
            console.log(superTokenAddress);
            const allowance = await erc20.allowance(walletAddress, superTokenAddress);
            return ethers.formatEther(allowance);
        }
    } catch (error) {
        console.error("Error fetching balance and allowance:", error);
        return null; // Return null in case of error
    }
};
