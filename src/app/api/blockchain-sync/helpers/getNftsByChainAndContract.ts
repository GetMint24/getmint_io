import { ChainName } from '../../../../utils/getChainNetworkByName';
import Moralis from 'moralis';
import { EvmChain } from '@moralisweb3/common-evm-utils';
import { NftBlockchainDataForSync } from './types';
import { getCeloNfts, getCoreNfts, getMantleNfts, getPolygonZKEVMNfts, getScrollNfts, getZksyncNfts, getZoraNfts } from './nftsByChain';
import { getArbitrumNovaNfts } from './nftsByChain/getArbitrumNovaNfts';

Moralis.start({
  apiKey:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjcwOGY1ZTRkLTgxMmQtNGM0MC04YmEwLTQ4Yzg0ZTc0N2E1NyIsIm9yZ0lkIjoiMzkxMDgyIiwidXNlcklkIjoiNDAxODUyIiwidHlwZUlkIjoiY2QzMDY4ODMtNmMxZC00ODIwLWFlYjktMTg3ZDI3MzQwY2IyIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MTQ5ODYwOTIsImV4cCI6NDg3MDc0NjA5Mn0.j0wn0HW2SThU4RjTcVjr_LzT1kzpqBoel14mh5tOQ-w',
});

const getNftsByChainName: Record<
  string,
  (walletAddress: string, contracts: string[]) => Promise<NftBlockchainDataForSync[]>
> = {
  [ChainName.Zora]: getZoraNfts,
  [ChainName.ArbitrumNova]: getArbitrumNovaNfts,
  [ChainName.Celo]: getCeloNfts,
  [ChainName.Scroll]: getScrollNfts,
  [ChainName.Mantle]: getMantleNfts,
  [ChainName.PolygonzkEVM]: getPolygonZKEVMNfts,
  [ChainName.Core]: getCoreNfts,
  [ChainName.ZkSync]: getZksyncNfts,
  [ChainName.Polygon]: getCommonChainNfts(EvmChain.POLYGON),
  [ChainName.BSC]: getCommonChainNfts(EvmChain.BSC),
  [ChainName.Arbitrum]: getCommonChainNfts(EvmChain.ARBITRUM),
  [ChainName.Avalanche]: getCommonChainNfts(EvmChain.AVALANCHE),
  [ChainName.Base]: getCommonChainNfts(EvmChain.BASE),
  [ChainName.Fantom]: getCommonChainNfts(EvmChain.FANTOM),
  [ChainName.Gnosis]: getCommonChainNfts(EvmChain.GNOSIS),
  [ChainName.LineaMainnet]: getCommonChainNfts(EvmChain.LINEA),
  [ChainName.Optimism]: getCommonChainNfts(EvmChain.OPTIMISM),
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

function getCommonChainNfts(chain: EvmChain) {
  return async (walletAddress: string, contracts: string[]) => {
    const response = await Moralis.EvmApi.nft.getWalletNFTTransfers({
      address: walletAddress,
      chain,
      contractAddresses: contracts,
    });

    const bridgedTokens: number[] = [];
    const nfts: NftBlockchainDataForSync[] = [];

    response.toJSON().result.forEach((transaction) => {
      if (!transaction.from_address) {
        return
      }

      if (transaction.from_address.toLocaleLowerCase() === walletAddress.toLocaleLowerCase()) {
        bridgedTokens.push(+transaction.token_id)
      } else {
        nfts.push({
          tokenId: +transaction.token_id,
          transactionHash: transaction.transaction_hash,
          mintTime: new Date(transaction.block_timestamp).valueOf(),
        })
      }
    })

    const nftsFromWallet = nfts.filter((({ tokenId }) => {
      const bridgedTokenIdx = bridgedTokens.findIndex((token) => token === tokenId);

      if (bridgedTokenIdx === -1) {
          return true
      }

      bridgedTokens.splice(bridgedTokenIdx, 1)
    }))

    return nftsFromWallet;
  };
}