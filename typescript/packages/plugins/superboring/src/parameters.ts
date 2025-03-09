import { createToolParameters } from "@goat-sdk/core";
import { z } from "zod";

export class BuildBatchOperationsParameters extends createToolParameters(
    z.object({
        host: z.string().describe("The address of the Superfluid host contract"),
        params: z.string().describe("The encoded parameters for the batch operations"),
        msgSender: z.string().describe("The address of the message sender"),
    }),
) {}
export class GetParamsParameters extends createToolParameters(
    z.object({
        torexAddr: z.string().describe("The address of the TOREX contract to interact with"),
        flowRate: z.string().describe("The flow rate in tokens per second"),
        distributor: z.string().describe("The distributor address (use ZeroAddress if not needed)"),
        referrer: z.string().describe("The referrer address (use ZeroAddress if not needed)"),
        upgradeAmount: z.string().describe("The amount of tokens to upgrade (use MaxUint256 for maximum possible amount)"),
    }),
) {}

export class PostCheckParameters extends createToolParameters(
    z.object({
        host: z.string().describe("The address of the Superfluid host contract"),
        params: z.string().describe("The encoded parameters for the post check"),
        msgSender: z.string().describe("The address of the message sender"),
    }),
) {}

export class RunMacroParameters extends createToolParameters(
    z.object({
        macroAddress: z.string().describe("The address of the macro contract to run"),
        params: z.string().describe("The encoded parameters for the macro"),
    }),
) {}
