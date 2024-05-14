import axios from "axios";
import { getAddress } from "ethers";
import { getTokensIdFromLogs } from "../../../../../utils/getTokensIdFromLogs";
import { TransactionLog } from "../../../../../common/types";

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
    const data = await axios<TransactionsResponse>('https://openapi.coredao.org/api', {
      params: {
        module: 'account',
        action: 'txlist',
        address: walletAddress,
        sort: 'desc',
        offset: 50,
        apikey: 'de1d39af36bb435eb1b17d8565a44a3b',
      },
    });
  
    const nfts = [];
    const bridgedTokens: number[] = [];

    for (const nft of data.data.result) {
        if (!nft?.to || !contracts.includes(getAddress(nft.to).toLowerCase())) {
            continue
        }

        const txData = await axios<TransactionsInfoResponse>('https://openapi.coredao.org/api', {
          params: {
            module: 'proxy',
            action: 'eth_getTransactionReceipt',
            txhash: nft.hash,
            apikey: 'de1d39af36bb435eb1b17d8565a44a3b',
          },
        });
        const tokenId = getTokensIdFromLogs(txData.data.result.logs)

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

    const nftsFromWallet = nfts.filter((({tokenId}) => {
        const bridgedTokenIdx = bridgedTokens.findIndex((token) => token === tokenId);

        if (bridgedTokenIdx === -1) {
            return true
        }

        bridgedTokens.splice(bridgedTokenIdx, 1)
    }))

    return nftsFromWallet;
}