import { ChainName } from '../../../../utils/getChainNetworkByName';

import { NftBlockchainDataForSync } from './types';
import { 
  getAvalancheNfts,
  getCeloNfts, 
  getCoreNfts, 
  getGnosisNfts, 
  getMantleNfts, 
  getZksyncNfts, 
  getZoraNfts 
} from './nftsByChain';
import { excludeBridgedNfts } from './excludeBridgedNfts';
import axios from 'axios';
import { getAddress } from 'ethers';
import { isStartWithSome } from '../../../../utils/isStartWithSome';
import { contractFuncNamesForBridge } from '../../../../utils/contractActionNames';

const getNftsByChainName: Record<
  string,
  (walletAddress: string, contracts: string[]) => Promise<NftBlockchainDataForSync[]>
> = {
  [ChainName.Zora]: getZoraNfts,
  [ChainName.ArbitrumNova]: getCommonChainNfts('https://api-nova.arbiscan.io/api', process.env.ARBITRUM_NOVA_API_KEY),
  [ChainName.Celo]: getCeloNfts,
  [ChainName.Scroll]: getCommonChainNfts('https://api.scrollscan.com/api', process.env.SCROLL_API_KEY),
  [ChainName.Mantle]: getMantleNfts,
  [ChainName.PolygonzkEVM]: getCommonChainNfts('https://api-zkevm.polygonscan.com/api', process.env.POLYGON_ZKEVM_API_KEY),
  [ChainName.Core]: getCoreNfts,
  [ChainName.ZkSync]: getZksyncNfts,
  [ChainName.Polygon]: getCommonChainNfts('https://api.polygonscan.com/api', process.env.POLYGON_API_KEY),
  [ChainName.BSC]: getCommonChainNfts('https://api.bscscan.com/api', process.env.BSC_API_KEY),
  [ChainName.Arbitrum]: getCommonChainNfts('https://api.arbiscan.io/api', process.env.ARBITRUM_API_KEY),
  [ChainName.Avalanche]: getAvalancheNfts,
  [ChainName.Base]: getCommonChainNfts('https://api.basescan.org/api', process.env.BASE_API_KEY),
  [ChainName.Fantom]: getCommonChainNfts('https://api.ftmscan.com/api', process.env.FANTOM_API_KEY),
  [ChainName.Gnosis]: getGnosisNfts,
  [ChainName.LineaMainnet]: getCommonChainNfts('https://api.lineascan.build/api', process.env.LINEA_API_KEY),
  [ChainName.Optimism]: getCommonChainNfts('https://api-optimistic.etherscan.io/api', process.env.OPTIMISM_API_KEY)
} as const;

export async function getNftsByChainAndContract(
  walletAddress: string,
  contracts: string[],
  chainNames: string[]
) {
  const nftsByChainName: Record<string, NftBlockchainDataForSync[]> = {};

  const data = await Promise.allSettled<NftBlockchainDataForSync[]>(
    chainNames.map((name) => getNftsByChainName[name](walletAddress, contracts))
  );

  data.forEach((chainNfts, idx) => {
    if (chainNfts.status === 'fulfilled') {
      nftsByChainName[chainNames[idx]] = chainNfts.value;
    }
  });

  return nftsByChainName;
}

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

function getCommonChainNfts(url: string, apikey: string | undefined) {
  return async (walletAddress: string, contracts: string[]) => {
    const data = await axios<TransactionsResponse>(url, {
      params: {
        module: 'account',
        action: 'txlist',
        address: walletAddress,
        sort: 'desc',
        apikey
      },
    });
  
    const nfts: NftBlockchainDataForSync[] = [];
    const bridgedTokens: number[] = [];
  
    for (const nft of data.data.result) {
        if (!nft?.to || !contracts.includes(getAddress(nft.to).toLowerCase())) {
            continue
        }
  
        const txData = await axios<TokensResponse>(url, {
          params: {
            module: 'account',
            action: 'tokennfttx',
            startblock: nft.blockNumber,
            endblock: nft.blockNumber,
            contractaddress: nft.to,
            sort: 'desc',
            apikey
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
    
    const nftsFromWallet = excludeBridgedNfts(nfts, bridgedTokens) 
  
    return nftsFromWallet;
  };
}
