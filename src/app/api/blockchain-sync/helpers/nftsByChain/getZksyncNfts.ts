import axios from "axios";
import { getAddress } from "ethers";
import { NftBlockchainDataForSync } from "../types";
import { getTokenIdFromLogs } from "../../../../../utils/getTokenIdFromLogs";
import { TransactionLog } from "../../../../../common/types";
import { excludeBridgedNfts} from "../excludeBridgedNfts"

const API_URL = 'https://block-explorer-api.mainnet.zksync.io/api'

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
        API_URL, {
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

        const txData = await axios<TokensResponse>(API_URL, {
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

        const tokenId = getTokenIdFromLogs(txData.data.result)

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

    const nftsFromWallet = excludeBridgedNfts(nfts, bridgedTokens) 

    return nftsFromWallet;
}