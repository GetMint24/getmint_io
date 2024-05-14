import { useEffect, useState } from "react";
import { useAccount, useSwitchChain } from "wagmi";
import { notification } from "antd";
import { NFTDto } from "./dto/NFTDto";
import { bridgeNFT, estimateBridge, EstimationBridgeType } from "../core/contractController";
import { ChainDto } from "./dto/ChainDto";
import ChainStore from "../store/ChainStore";
import AppStore from "../store/AppStore";
import {
    DEFAULT_REFUEL_COST_USD,
    getContractAddress,
    HyperlaneAvailableNetworks, LZAvailableNetworks,
    UnailableLZNetworks
} from "./constants";
import { NetworkName } from "./enums/NetworkName";
import ApiService from "../services/ApiService";
import { BridgeType } from "./enums/BridgeType";
import { getChainNetworkByChainName } from "../utils/getChainNetworkByName";

interface SubmittedData {
    previousChain: ChainDto;
    nextChain: ChainDto;
}

export function useBridge(nft: NFTDto, onAfterBridge?: (previousChain?: ChainDto, nextChain?: ChainDto) => void) {
    const [selectedChain, setSelectedChain] = useState<string>();
    const [refuelCost, setRefuelCost] = useState(DEFAULT_REFUEL_COST_USD);
    const [refuelEnabled, setRefuelEnable] = useState<boolean>(false);
    const [_chains, setChains] = useState<ChainDto[]>([]);
    const [isPending , setIsPending] = useState<boolean>(false);
    const [submittedData, setSubmittedData] = useState<SubmittedData | null>(null);
    const [bridgePriceList, setBridgePriceList] = useState<EstimationBridgeType>([]);
    const { chains } = ChainStore;
    const { account } = AppStore;

    const { switchChainAsync } = useSwitchChain();
    const { address, chain: currentChain } = useAccount();

    const isNeedChangeChain = nft.chainNativeId !== currentChain?.id;

    const switchNetwork = async () => {
        await switchChainAsync?.({
            chainId: nft?.chainNativeId
        });
    };

    const estimateBridgeFee = async (selectedChain: string) => {
        if (nft) {
            const nftChain = ChainStore.chains.find(c => c.chainId === nft.chainNativeId);
            const chain = ChainStore.chains.find(c => c.id === selectedChain);

            if (chain && currentChain && nft?.tokenId) {
                let _currentNetwork = getChainNetworkByChainName(currentChain.name) 

                const priceList = await estimateBridge(_chains, nftChain?.token!, {
                    contractAddress: getContractAddress(nft.networkType, _currentNetwork),
                    chainToSend: {
                        id: chain.chainId,
                        name: chain.name,
                        network: chain.network,
                        lzChain: chain.lzChain,
                        hyperlaneChain: chain.hyperlaneChain,
                        token: chain.token
                    },
                    networkType: nft.networkType,
                    account,
                    accountAddress: address!
                }, nft.tokenId, refuelEnabled, refuelCost);

                setBridgePriceList(priceList);
            }
        }
    };

    const onBridge = async () => {
        if (!currentChain) {
            return 
        }

        try {
            setIsPending(true);
            const chainToSend = ChainStore.getChainById(selectedChain!);
            let _currentNetwork: string = getChainNetworkByChainName(currentChain.name) 

            if (_currentNetwork !== nft.chainNetwork) {
                const res = await switchChainAsync?.({
                    chainId: nft.chainNativeId
                });

                if (res) {
                    _currentNetwork = getChainNetworkByChainName(res.name);
                }
            }

            if (!chainToSend || !nft.tokenId) {
                notification.error({ message: 'Something went wrong :(' });
                return;
            }

            const result = await bridgeNFT({
                contractAddress: getContractAddress(nft.networkType, _currentNetwork as NetworkName),
                networkType: nft.networkType,
                chainToSend: {
                    id: chainToSend.chainId,
                    name: chainToSend.name,
                    network: chainToSend.network,
                    lzChain: chainToSend.lzChain,
                    hyperlaneChain: chainToSend.hyperlaneChain,
                    token: chainToSend.token
                },
                account,
                accountAddress: address!
            }, nft.tokenId, refuelEnabled, refuelCost);

            if (result.result) {
                notification.success({
                    message: result.message
                });

                await ApiService.bridgeNFT({
                    transactionHash: result.transactionHash,
                    previousChainNetwork: nft?.chainNetwork!,
                    nextChainNetwork: chainToSend?.network!,
                    nftId: nft.id
                });

                const previousChain = ChainStore.getChainById(nft.chainId)!;
                const nextChain = ChainStore.getChainById(chainToSend?.id!)!;

                setSubmittedData({
                    previousChain,
                    nextChain,
                });

                onAfterBridge?.(previousChain, nextChain);
            } else {
                notification.warning({
                    message: result.message
                });
            }
        } catch (e) {
            console.error(e);
            notification.error({ message: 'Something went wrong :(' });
        } finally {
            setIsPending(false);
        }
    };

    useEffect(() => {
        if (chains.length && nft) {
            let _chains = chains.filter(x => x.id !== nft.chainId);

            if (nft.networkType === BridgeType.LayerZero) {
                _chains = _chains
                    .filter(x => LZAvailableNetworks.includes(x.network as NetworkName))
                    .filter(x => !UnailableLZNetworks[x.network as NetworkName].includes(nft.chainNetwork as NetworkName));
            }

            if (nft.networkType === BridgeType.Hyperlane) {
                _chains = _chains.filter(x => HyperlaneAvailableNetworks.includes(x.network as NetworkName));
            }

            setChains(_chains);
            setSelectedChain(_chains[0].id);
        }
    }, [chains, nft]);

    useEffect(() => {
        if (selectedChain && nft.chainNativeId === currentChain?.id) {
            estimateBridgeFee(selectedChain);
        }
    }, [selectedChain, refuelEnabled, refuelCost, _chains, currentChain, nft]);

    return {
        chains: _chains,
        refuelCost,
        refuelEnabled,
        selectedChain,
        isPending,
        submittedData,
        bridgePriceList,
        isNeedChangeChain,
        switchNetwork,
        onChangeChain: setSelectedChain,
        onChangeRefuelEnabled: setRefuelEnable,
        onChangeRefuelGas: setRefuelCost,
        onBridge,
    };
}