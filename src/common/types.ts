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