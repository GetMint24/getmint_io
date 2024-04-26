import { NetworkName } from "../common/enums/NetworkName"

export enum ChainName {
    Arbitrum = 'Arbitrum One',
    ArbitrumNova = 'Arbitrum Nova',
    Base = 'Base',
    LineaMainnet = 'Linea Mainnet',
    Optimism = 'OP Mainnet',
    Avalanche = 'Avalanche',
    Zora = 'Zora',
    Scroll = 'Scroll',
    Polygon = 'Polygon',
    PolygonzkEVM = 'Polygon zkEVM',
    Mantle = 'Mantle',
    ZkSync = 'zkSync Era',
    BSC = 'BNB Smart Chain',
    Celo = 'Celo',
    Gnosis = 'Gnosis',
    Core = 'Core Dao',
    Fantom = 'Fantom'
}

const chainNetworkByChainName: Record<ChainName, NetworkName> = {
    [ChainName.Arbitrum]: NetworkName.Arbitrum,
    [ChainName.ArbitrumNova]: NetworkName.ArbitrumNova,
    [ChainName.Base]: NetworkName.Base,
    [ChainName.LineaMainnet]: NetworkName.LineaMainnet,
    [ChainName.Optimism]: NetworkName.Optimism,
    [ChainName.Avalanche]: NetworkName.Avalanche,
    [ChainName.Zora]: NetworkName.Zora,
    [ChainName.Scroll]: NetworkName.Scroll,
    [ChainName.Polygon]: NetworkName.Polygon,
    [ChainName.PolygonzkEVM]: NetworkName.PolygonzkEVM,
    [ChainName.Mantle]: NetworkName.Mantle,
    [ChainName.ZkSync]: NetworkName.ZkSync,
    [ChainName.BSC]: NetworkName.BSC,
    [ChainName.Celo]: NetworkName.Celo,
    [ChainName.Gnosis]: NetworkName.Gnosis,
    [ChainName.Core]: NetworkName.Core,
    [ChainName.Fantom]: NetworkName.Fantom,
}

export const getChainNetworkByChainName = (name: string) => {
    return chainNetworkByChainName[name as ChainName]
}