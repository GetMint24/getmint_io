export interface MintDto {
    id: number;
    imageHash: string;
    name: string;
    description?: string;
}

export interface CreateMintDto {
    name: string;
    description?: string;
    userId: number;
}