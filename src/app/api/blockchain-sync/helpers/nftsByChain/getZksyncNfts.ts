import axios from "axios";
import { getAddress } from "ethers";
import { NftBlockchainDataForSync } from "../types";
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

interface TokensResponse {
    result: TransactionLog[]
    status: '0' | '1'
}

export async function getZksyncNfts(walletAddress: string, contracts: string[]) {
    const data = await axios<TransactionsResponse>(
      `https://block-explorer-api.mainnet.zksync.io/api`, {
        params: {
            module: 'account',
            action: 'txlist',
            offset: 100,
            sort: 'desc',
            address: walletAddress
        }
      }
    );
        
    const nfts: NftBlockchainDataForSync[] = [];
    const bridgedTokens: number[] = [];
    
    for (const nft of data.data.result) {
        const isCorrectContract = nft?.to && contracts.includes(getAddress(nft.to).toLowerCase());
        if (!isCorrectContract) {
            continue
        }

        const txData = await axios<TokensResponse>('https://block-explorer-api.mainnet.zksync.io/api', {
            params: {
              module: 'logs',
              action: 'getLogs',
              fromBlock: nft.blockNumber,
              toBlock: nft.blockNumber,
              address: nft.to,
            },
          });

        // if the status is zero, then we have exhausted the request limit
        if (txData.data.status === '0') {
            break;
        }

        const tokenId = getTokensIdFromLogs(txData.data.result)

        if (!tokenId) {
            continue
        }

        // in mint action we have 2 log messages and 3 messages for bridge
        if (txData.data.result.length === 2) {
            nfts.push({
              tokenId,
              transactionHash: nft.hash,
              mintTime: new Date(+nft.timeStamp * 1000).valueOf(),
            });
        } else {
            bridgedTokens.push(tokenId);
        }
    }

    const nftsFromWallet = nfts.filter((({ tokenId }) => {
        const bridgedTokenIdx = bridgedTokens.findIndex((token) => token === tokenId);

        if (bridgedTokenIdx === -1) {
            return true
        }

        bridgedTokens.splice(bridgedTokenIdx, 1)
    }))

    return nftsFromWallet;
}