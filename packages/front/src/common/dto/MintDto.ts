export interface MintDto {
    id: number;
    pinataImageHash: string;
    name: string;
    description?: string;
}

export interface CreateMintDto {
    name: string;
    description?: string;
    metamaskWalletAddress: string;
}