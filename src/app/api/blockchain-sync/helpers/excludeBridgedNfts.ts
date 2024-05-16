import { NftBlockchainDataForSync } from "./types";

export const excludeBridgedNfts= (nfts: NftBlockchainDataForSync[], bridgedTokens: number[]) => {
    return nfts.filter((({ tokenId }) => {
        const bridgedTokenIdx = bridgedTokens.findIndex((token) => token === tokenId);

        if (bridgedTokenIdx === -1) {
            return true
        }

        bridgedTokens.splice(bridgedTokenIdx, 1)
    }))
}