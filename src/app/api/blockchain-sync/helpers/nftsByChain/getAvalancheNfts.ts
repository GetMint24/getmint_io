import Moralis from 'moralis';
import { EvmChain } from '@moralisweb3/common-evm-utils';
import { NftBlockchainDataForSync } from '../types';
import { excludeBridgedNfts } from '../excludeBridgedNfts';

Moralis.start({ apiKey: process.env.MORALIS_API_KEY });

export async function getAvalancheNfts(walletAddress: string, contracts: string[]) {
    const response = await Moralis.EvmApi.nft.getWalletNFTTransfers({
      address: walletAddress,
      chain: EvmChain.AVALANCHE,
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

    const nftsFromWallet = excludeBridgedNfts(nfts, bridgedTokens)  
    
    return nftsFromWallet;
}