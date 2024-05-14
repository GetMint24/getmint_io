import axios from "axios";
import { getAddress } from "ethers";
import { contractFuncNamesForBridge } from "../../../../../utils/contractActionNames";
import { isStartWithSome } from "../../../../../utils/isStartWithSome";
import { NftBlockchainDataForSync } from "../types";

interface TransactionsResponse {
    result: {
        to: string;
        blockNumber: string;
        functionName: string;
        hash: string;
        timeStamp: string;
    }[]
}

interface TokensResponse {
    result: {
        tokenID: string;
    }[];
    status: '0' | '1'
}

export async function getScrollNfts(walletAddress: string, contracts: string[]) {
    const data = await axios<TransactionsResponse>('https://api.scrollscan.com/api', {
      params: {
        module: 'account',
        action: 'txlist',
        address: walletAddress,
        sort: 'desc',
        apikey: 'QU5VVJZ3MJ6P67S1EU31VJ1QD8HNS8T174',
      },
    });
  
    const nfts: NftBlockchainDataForSync[] = [];
    const bridgedTokens: number[] = [];

    for (const nft of data.data.result) {
        if (!nft?.to || !contracts.includes(getAddress(nft.to).toLowerCase())) {
            continue
        }

        const txData = await axios<TokensResponse>('https://api.scrollscan.com/api', {
          params: {
            module: 'account',
            action: 'tokennfttx',
            startblock: nft.blockNumber,
            endblock: nft.blockNumber,
            contractaddress: nft.to,
            sort: 'desc'
          },
        });

        // if the status is zero, then we have exhausted the request limit
        if (txData.data.status === '0') {
            break;
        }

        const isBridgeAction = isStartWithSome(nft.functionName, contractFuncNamesForBridge)

        txData.data.result.forEach(({ tokenID }) => {
            if (isBridgeAction) {
                bridgedTokens.push(+tokenID)
            } else {
                nfts.push({
                  tokenId: +tokenID,
                  transactionHash: nft.hash,
                  mintTime: new Date(+nft.timeStamp * 1000).valueOf(),
                });
            }
        })
    }
    
    const nftsFromWallet = nfts.filter((({tokenId}) => {
        const bridgedTokenIdx = bridgedTokens.findIndex((token) => token === tokenId);

        if (bridgedTokenIdx === -1) {
            return true
        }

        bridgedTokens.splice(bridgedTokenIdx, 1)
    }))

    return nftsFromWallet;
}