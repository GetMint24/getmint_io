import { ConfirmMintDto } from "./MintDto";

export interface NftDataForSync {
    forDelete: {
        id: string,
        pinataImageHash: string
    }[],
    forUpdate: ConfirmMintDto[]
}