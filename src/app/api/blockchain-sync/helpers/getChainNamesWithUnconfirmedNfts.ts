import { Chain } from '@prisma/client';

export function getChainNamesWithUnconfirmedNfts(unconfirmedNfts: { chain: Chain }[]) {
  const chainNames = new Set<string>();

  unconfirmedNfts.forEach((nft) => {
    chainNames.add(nft.chain.name);
  });

  return Array.from(chainNames);
}
