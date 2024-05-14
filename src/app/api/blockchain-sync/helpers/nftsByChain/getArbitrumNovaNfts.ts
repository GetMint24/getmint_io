import axios from "axios";
import { getAddress } from "ethers";
import { isStartWithSome } from "../../../../../utils/isStartWithSome";
import { NftBlockchainDataForSync } from "../types";
import { contractFuncNamesForBridge } from "../../../../../utils/contractActionNames";

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
    }[]
    status: '0' | '1'
}

export async function getArbitrumNovaNfts(walletAddress: string, contracts: string[]) {
    const data = await axios<TransactionsResponse>('https://api-nova.arbiscan.io/api', {
      params: {
        module: 'account',
        action: 'txlist',
        address: walletAddress,
        sort: 'desc',
        apikey: 'CCADMD4HT9WX2ZPFVBM84SDQ7YQ7D7SDZ4',
      },
    });
  
    const nfts: NftBlockchainDataForSync[] = []
    const bridgedTokens: number[] = [];
  
    for (const nft of data.data.result) {
        if (!nft?.to || !contracts.includes(getAddress(nft.to).toLowerCase())) {
            continue
        }

        const txData = await axios<TokensResponse>('https://api-nova.arbiscan.io/api', {
          params: {
            module: 'account',
            action: 'tokennfttx',
            startblock: nft.blockNumber,
            endblock: nft.blockNumber,
            contractaddress: nft.to,
            sort: 'desc',
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