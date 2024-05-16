import axios from "axios";
import { getAddress } from "ethers";
import { getTokenIdFromLogs } from "../../../../../utils/getTokenIdFromLogs";
import { TransactionLog } from "../../../../../common/types";
import { excludeBridgedNfts} from "../excludeBridgedNfts"

const API_URL = 'https://openapi.coredao.org/api'

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

export async function getCoreNfts(walletAddress: string, contracts: string[]) {
    const data = await axios<TransactionsResponse>(API_URL, {
      params: {
        module: 'account',
        action: 'txlist',
        address: walletAddress,
        sort: 'desc',
        offset: 50,
        apikey: process.env.CORE_API_KEY,
      },
    });
  
    const nfts = [];
    const bridgedTokens: number[] = [];

    for (const nft of data.data.result) {
        if (!nft?.to || !contracts.includes(getAddress(nft.to).toLowerCase())) {
            continue
        }

        const txData = await axios<TransactionsInfoResponse>(API_URL, {
          params: {
            module: 'proxy',
            action: 'eth_getTransactionReceipt',
            txhash: nft.hash,
            apikey: process.env.CORE_API_KEY,
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
              mintTime: new Date(nft.timeStamp).valueOf(),
            });
        } else {
            bridgedTokens.push(tokenId);
        }
    }

    const nftsFromWallet = excludeBridgedNfts(nfts, bridgedTokens) 

    return nftsFromWallet;
}