import axios from "axios";
import { getAddress } from "ethers";
import { isStartWithSome } from "../../../../../utils/isStartWithSome";
import { NftBlockchainDataForSync } from "../types";
import { contractFuncNamesForBridge } from "../../../../../utils/contractActionNames";
import { excludeBridgedNfts} from "../excludeBridgedNfts"

const API_URL = 'https://explorer.zora.energy/api'

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

export async function getZoraNfts(walletAddress: string, contracts: string[]) {
    const data = await axios<TransactionsResponse>(
      `${API_URL}/v2/addresses/${walletAddress}/token-transfers`
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

    const nftsFromWallet = excludeBridgedNfts(nfts, bridgedTokens) 

    return nftsFromWallet;
}