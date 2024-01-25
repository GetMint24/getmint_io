import { NetworkName } from "./enums/NetworkName";

export type CryptoAddress = `0x${string}`;

export type AuthState = `${string}:${string}` | string;

export interface TwitterUser {
    username: string;
    avatar?: string;
}

export interface EarnedItem {
    chainNetwork: NetworkName;
    chainName: string;
    earned: string;
    price: number;
    calculatedPrice: number;
    formattedPrice: string;
}