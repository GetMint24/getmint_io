import { Chain, Nft } from '@prisma/client';

interface NftWithChain extends Nft {
  chain: Chain;
}

type ConfirmedNftTokenIdsByChainName = Record<string, number[]>;

export function getUnconfirmedNftsAndConfirmedTokenIds(nfts: NftWithChain[]) {
  const unconfirmedNfts: NftWithChain[] = [];
  const confirmedNftTokenIdsByChainName: ConfirmedNftTokenIdsByChainName = {};

  nfts.forEach((nft) => {
    if (nft.tokenId) {
      return;
    }

    unconfirmedNfts.push(nft);

    if (confirmedNftTokenIdsByChainName[nft.chain.name]) {
      return;
    }

    confirmedNftTokenIdsByChainName[nft.chain.name] = nfts.reduce(
      (res: number[], { chain, tokenId }) => {
        if (nft.chain.name === chain.name && tokenId) {
          res.push(tokenId);
        }

        return res;
      },
      []
    );
  });

  return {
    unconfirmedNfts,
    confirmedNftTokenIdsByChainName,
  };
}
