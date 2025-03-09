// From superboring.tsx:
// const macroForwarderABI = [
//   'function runMacro(address macro, bytes memory params) external',
// ];
export const MACRO_FORWARDER_ABI = [
    {
        inputs: [
            {
                internalType: "address",
                name: "macro",
                type: "address",
            },
            {
                internalType: "bytes",
                name: "params",
                type: "bytes",
            },
        ],
        name: "runMacro",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
] as const;

// From superboring.tsx:
// const sbMacroABI = [
//   'function getParams(address torexAddr, int96 flowRate, address distributor, address referrer, uint256 upgradeAmount) public pure returns (bytes memory)',
// ];
export const SB_MACRO_ABI = [
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
] as const;

// From superboring.tsx:
// const torexABI = [
//   'function getPairedTokens() external view returns (address inToken, address outToken)',
// ];
export const TOREX_ABI = [
    {
        inputs: [],
        name: "getPairedTokens",
        outputs: [
            {
                internalType: "address",
                name: "inToken",
                type: "address",
            },
            {
                internalType: "address",
                name: "outToken",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
] as const;

// From superboring.tsx:
// const superTokenABI = [
//   'function getUnderlyingToken() external view returns (address)',
// ];
export const SUPER_TOKEN_ABI = [
    {
        inputs: [],
        name: "getUnderlyingToken",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
] as const;

// From superboring.tsx:
// const erc20ABI = [
//   'function balanceOf(address account) external view returns (uint256)',
//   'function allowance(address owner, address spender) external view returns (uint256)',
//   'function approve(address spender, uint256 amount) external returns (bool)',
// ];
export const ERC20_ABI = [
    {
        inputs: [
            {
                internalType: "address",
                name: "account",
                type: "address",
            },
        ],
        name: "balanceOf",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "owner",
                type: "address",
            },
            {
                internalType: "address",
                name: "spender",
                type: "address",
            },
        ],
        name: "allowance",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "spender",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
        ],
        name: "approve",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
] as const;
