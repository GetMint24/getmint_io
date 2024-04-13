// import { NetworkName } from '../../common/enums/NetworkName';

const DEFAULT_MULTIPLIER = 20;

// const multiplierByNetworkName: Record<NetworkName, number> = {
//   [NetworkName.Base]: DEFAULT_MULTIPLIER,
//   [NetworkName.ArbitrumNova]: DEFAULT_MULTIPLIER,
//   [NetworkName.Arbitrum]: 20,
//   [NetworkName.Avalanche]: DEFAULT_MULTIPLIER,
//   [NetworkName.LineaMainnet]: DEFAULT_MULTIPLIER,
//   [NetworkName.Mantle]: DEFAULT_MULTIPLIER,
//   [NetworkName.Optimism]: DEFAULT_MULTIPLIER,
//   [NetworkName.Polygon]: DEFAULT_MULTIPLIER,
//   [NetworkName.PolygonzkEVM]: DEFAULT_MULTIPLIER,
//   [NetworkName.Scroll]: DEFAULT_MULTIPLIER,
//   [NetworkName.Zora]: DEFAULT_MULTIPLIER,
//   [NetworkName.ZkSync]: DEFAULT_MULTIPLIER,
//   [NetworkName.BSC]: DEFAULT_MULTIPLIER,
//   [NetworkName.Celo]: DEFAULT_MULTIPLIER,
//   [NetworkName.Gnosis]: DEFAULT_MULTIPLIER,
// };

export const getGasLimitForBridge = (gasLimit: bigint) => {
    return (gasLimit * BigInt(100 + DEFAULT_MULTIPLIER)) / BigInt(100);
};
