import { BridgeType } from "../enums/BridgeType";

export interface NFTDto {
    id: string;
    pinataImageHash: string;
    name: string;
    description: string;
    createdAt: string;
    tokenId: number | null;
    chainNativeId: number;
    chainId: string;
    chainNetwork: string;
    chainName: string;
    userId: string;
    userWalletAddress: string;
    userName: string | null;
    tweeted: boolean;
    networkType: BridgeType;
}