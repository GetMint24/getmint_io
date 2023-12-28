import { CryptoAddress } from "./types";
import { NetworkName } from "./enums/NetworkName";

export const CONTRACT_ADDRESS: Record<NetworkName, CryptoAddress> = {
    [NetworkName.Base]: '0x991fC265f163fc33328FBD2b7C8aa9B77840Ed42',
    [NetworkName.ArbitrumNova]: '0x991fC265f163fc33328FBD2b7C8aa9B77840Ed42',
    [NetworkName.LineaMainnet]: '0x991fC265f163fc33328FBD2b7C8aa9B77840Ed42',
    [NetworkName.Optimism]: '0x991fC265f163fc33328FBD2b7C8aa9B77840Ed42',
    [NetworkName.PolygonzkEVM]: '0x991fC265f163fc33328FBD2b7C8aa9B77840Ed42',
    [NetworkName.Polygon]: '0x991fC265f163fc33328FBD2b7C8aa9B77840Ed42',
    [NetworkName.Zora]: '0x991fC265f163fc33328FBD2b7C8aa9B77840Ed42',
    [NetworkName.Scroll]: '0x991fC265f163fc33328FBD2b7C8aa9B77840Ed42',
    [NetworkName.Mantle]: '0x991fC265f163fc33328FBD2b7C8aa9B77840Ed42',
    [NetworkName.Arbitrum]: '0x809E8c06e6110CD6a055a7d2044EF7e0B29Ce2e3',
    [NetworkName.Avalanche]: '0x7a9ed9A5EF8dF626Bf934AaCe84c66267b37842c',
    [NetworkName.ZkSync]: '0x569aA521b05752D22de8B3DBb91D92f65baa7E6f',
    [NetworkName.BSC]: '0x991fC265f163fc33328FBD2b7C8aa9B77840Ed42'
};

export const NFT_COST = BigInt(0);

export const TWEET_CONTENT = "Just minted my own NFT on @GetMint_io 🌟 Joining to the creative wave of NFT makers on the blockchain!\nCheck it out and mint yours - the fun's just starting!";