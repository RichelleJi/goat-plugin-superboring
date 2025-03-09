export const SUPERBORING_ABI = [
    {
        inputs: [],
        name: "NoOutTokenPoolUnits",
        type: "error",
    },
    {
        inputs: [
            {
                internalType: "contract ISuperfluid",
                name: "host",
                type: "address",
            },
            {
                internalType: "bytes",
                name: "params",
                type: "bytes",
            },
            {
                internalType: "address",
                name: "msgSender",
                type: "address",
            },
        ],
        name: "buildBatchOperations",
        outputs: [
            {
                components: [
                    {
                        internalType: "uint32",
                        name: "operationType",
                        type: "uint32",
                    },
                    {
                        internalType: "address",
                        name: "target",
                        type: "address",
                    },
                    {
                        internalType: "bytes",
                        name: "data",
                        type: "bytes",
                    },
                ],
                internalType: "struct ISuperfluid.Operation[]",
                name: "operations",
                type: "tuple[]",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "torexAddr",
                type: "address",
            },
            {
                internalType: "int96",
                name: "flowRate",
                type: "int96",
            },
            {
                internalType: "address",
                name: "distributor",
                type: "address",
            },
            {
                internalType: "address",
                name: "referrer",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "upgradeAmount",
                type: "uint256",
            },
        ],
        name: "getParams",
        outputs: [
            {
                internalType: "bytes",
                name: "",
                type: "bytes",
            },
        ],
        stateMutability: "pure",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "contract ISuperfluid",
                name: "",
                type: "address",
            },
            {
                internalType: "bytes",
                name: "params",
                type: "bytes",
            },
            {
                internalType: "address",
                name: "msgSender",
                type: "address",
            },
        ],
        name: "postCheck",
        outputs: [],
        stateMutability: "view",
        type: "function",
    },
];
