import BigNumber from "bignumber.js";

export enum WEB3_LISTENERS {
    ACCOUNT_CHANGED = 'accountsChanged',
    CHAIN_CHANGED = 'chainChanged',
}

export enum ETH_CHAINS_ID {
    MAINNET = 1,
    ROPSTEN = 5,
    RINKEBY = 4,
    GOERLI = 5,
    KOVAN = 42,
}

export interface IExtendedToken {
    balance: string,
    allowance: string,
}

export interface IToken extends Partial<IExtendedToken> {
    address: string,
    decimals: string,
    symbol: string,
    name: string,
}

export interface IExtendedStaking {
    userStaked: string,
    claimable: string,
}

export interface IStaking extends Partial<IExtendedStaking> {
    address: string,
    totalStaked: string,
}

export interface IListener {
    name: WEB3_LISTENERS,
    callback: (payload: any) => void | Promise<void>,
}

export interface TransactionReceipt {
    to: string;
    from: string;
    contractAddress: string,
    transactionIndex: number,
    root?: string,
    gasUsed: BigNumber,
    logsBloom: string,
    blockHash: string,
    transactionHash: string,
    logs: Array<any>,
    blockNumber: number,
    confirmations: number,
    cumulativeGasUsed: BigNumber,
    effectiveGasPrice: BigNumber,
    byzantium: boolean,
    type: number;
    status?: number
}

export type chainNameType =
    | 'eth'
    | 'ropsten'
    | 'rinkeby'
    | 'goerli'
    | 'kovan'
    | 'polygon'
    | 'mumbai'
    | 'bsc'
    | 'bsc testnet'
    | 'avalanche'
    | 'avalanche testnet'
    | 'fantom'
