import { BridgeType } from "../enums/BridgeType";

export interface MintDto {
    id: string;
    pinataImageHash: string;
    name: string;
    description?: string;
}

export interface CreateOptimisticMintDto {
    name: string;
    description?: string;
    metamaskWalletAddress: string;
    chainNetwork: string;
    networkType: BridgeType;
    pinataImageHash: string, 
    pinataJsonHash: string
}

export interface ConfirmMintDto {
    id: string;
    tokenId: number;
    transactionHash: string;
}