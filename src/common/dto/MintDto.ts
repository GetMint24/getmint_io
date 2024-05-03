import { BridgeType } from "../enums/BridgeType";

export interface MintDto {
    id: string;
    pinataImageHash: string;
    name: string;
    description?: string;
}

export interface CreateMintDto {
    name: string;
    description?: string;
    metamaskWalletAddress: string;
    tokenId: number;
    chainNetwork: string;
    transactionHash: string;
    networkType: BridgeType;
    pinataImageHash: string, 
    pinataJsonHash: string
}