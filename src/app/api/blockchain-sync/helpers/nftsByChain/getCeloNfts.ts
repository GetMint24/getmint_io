import axios from "axios";
import { getAddress } from "ethers";
import { getTokenIdFromLogs } from "../../../../../utils/getTokenIdFromLogs";
import { TransactionLog } from "../../../../../common/types";
import { excludeBridgedNfts} from "../excludeBridgedNfts"

const API_URL = 'https://explorer.celo.org/mainnet/api'

interface TransactionsResponse {
    result: {
        to: string;
        blockNumber: string;
        functionName: string;
        hash: string;
        timeStamp: string;
    }[]
}

interface TransactionsInfoResponse {
    result: {
        logs: TransactionLog[];
    }
}

export async function getCeloNfts(walletAddress: string, contracts: string[]) {
    const data = await axios<TransactionsResponse>(API_URL, {
      params: {
        address: walletAddress,
        sort: 'desc',
        action: 'txlist',
        module: 'account',
      },
    });
  
    const nfts = []
    const bridgedTokens: number[] = [];
  
    for (const nft of data.data.result) {
        if (!nft?.to || !contracts.includes(getAddress(nft.to).toLowerCase())) {
            continue
        }
  
        const txData = await axios<TransactionsInfoResponse>(API_URL, {
          params: {
            module: 'transaction',
            action: 'gettxinfo',
            txhash: nft.hash
          },
        });
        const tokenId = getTokenIdFromLogs(txData.data.result.logs)
  
        if (!tokenId) {
            continue
        }
        
        // in mint action we have 2 log messages and 7 messages for bridge
        if (txData.data.result.logs.length === 2) {
            nfts.push({
              tokenId,
              transactionHash: nft.hash,
              mintTime: new Date(+nft.timeStamp * 1000).valueOf(),
            });
        } else {
            bridgedTokens.push(tokenId);
        }
    }

    const nftsFromWallet = excludeBridgedNfts(nfts, bridgedTokens) 
  
    return nftsFromWallet;
}