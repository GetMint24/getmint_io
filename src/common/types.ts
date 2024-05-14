import { Hex } from "viem";
import { NetworkName } from "./enums/NetworkName";

export type CryptoAddress = `0x${string}`;

export type AuthState = `${string}:${string}` | string;

export interface TwitterUser {
    username: string;
    avatar?: string;
}

interface EarnedCalculations {
    earned: string;
    price: number;
    calculatedPrice: number;
    formattedPrice: string;
}

export interface EarnedItem {
    chainNetwork: NetworkName;
    chainName: string;
    earnedSum: string;
    lz: EarnedCalculations;
    hyperlane: EarnedCalculations;
}

export interface TransactionLog {
    _type: string,
    address: string,
    blockHash: string,
    blockNumber: number,
    data: string,
    topics: Hex[],
    transactionHash: string,
    transactionIndex: number
}