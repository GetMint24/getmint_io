export interface NFTDto {
    id: string;
    pinataImageHash: string;
    name: string;
    description: string;
    createdAt: string;
    tokenId: number;
    chainNativeId: number;
    chainId: string;
    chainNetwork: string;
    chainName: string;
}