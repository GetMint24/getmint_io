import { NetworkName } from "../common/enums/NetworkName";

const paths: Record<NetworkName, string> = {
    [NetworkName.Arbitrum]: '/svg/chains/arbitrum.svg',
    [NetworkName.ArbitrumNova]: '/svg/chains/nova.svg',
    [NetworkName.Base]: '/svg/chains/base.svg',
    [NetworkName.PolygonzkEVM]: '/svg/chains/polygon-zkevm.svg',
    [NetworkName.Polygon]: '/svg/chains/polygon-zkevm.svg',
    [NetworkName.Avalanche]: '/svg/chains/avalanche.svg',
    [NetworkName.LineaMainnet]: '/svg/chains/linea.svg',
    [NetworkName.Optimism]: '/svg/chains/optimism.svg',
    [NetworkName.Scroll]: '/svg/chains/scroll.svg',
    [NetworkName.Zora]: '/svg/chains/zora.svg',
    [NetworkName.Mantle]: '/svg/chains/mantle.svg',
    [NetworkName.ZkSync]: '/svg/chains/zksync.svg',
    [NetworkName.BSC]: '/svg/chains/bnb.svg',
};

export function getChainLogo(network: string) {
    if (network) {
        return paths[network as NetworkName] || '';
    }

    return '';
}