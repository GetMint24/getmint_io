import axios from "axios";
import { getAddress } from "ethers";
import { isStartWithSome } from "../../../../../utils/isStartWithSome";
import { NftBlockchainDataForSync } from "../types";
import { contractFuncNamesForBridge } from "../../../../../utils/contractActionNames";

interface TransactionsResponse {
    items: {
        token: {
            address: string;
        };
        total: {
            token_id: string;
        }
        method: string;
        tx_hash: string;
        timestamp: string;
    }[]
}

export async function getMantleNfts(walletAddress: string, contracts: string[]) {
    const data = await axios<TransactionsResponse>(
      `https://explorer.mantle.xyz/api/v2/addresses/${walletAddress}/token-transfers`
    );

    const bridgedTokens: number[] = [];

    const nfts = data.data.items.reduce((res: NftBlockchainDataForSync[], nft) => {
        const isCorrectContract = nft?.token?.address && contracts.includes(getAddress(nft.token.address).toLowerCase());
        if (!isCorrectContract) {
            return res;
        }
        
        const isBridgeAction = isStartWithSome(nft.method, contractFuncNamesForBridge)
        
        if (isBridgeAction) {
            bridgedTokens.push(+nft.total.token_id)
        } else {
            res.push({
                tokenId: +nft.total.token_id,
                transactionHash: nft.tx_hash,
                mintTime: new Date(nft.timestamp).valueOf(),
            });
        }

      return res;
    }, []);

    const nftsFromWallet = nfts.filter((({ tokenId }) => {
        const bridgedTokenIdx = bridgedTokens.findIndex((token) => token === tokenId);

        if (bridgedTokenIdx === -1) {
            return true
        }

        bridgedTokens.splice(bridgedTokenIdx, 1)
    }))

    return nftsFromWallet;
}