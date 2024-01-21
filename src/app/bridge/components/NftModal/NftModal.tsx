import { observer } from "mobx-react-lite";
import { Flex, notification, Spin } from "antd";
import { useEffect, useState } from "react";
import clsx from "clsx";

import NftStore from "../../../../store/NftStore";
import UiModal from "../../../../components/ui/Modal/Modal";
import Button from "../../../../components/ui/Button/Button";
import RefuelSwitch from "../../../../components/RefuelSwitch/RefuelSwitch";
import ChainSelect from "../../../../components/ChainSelect/ChainSelect";
import PinataImage from "../../../../components/PinataImage";

import styles from "./NftModal.module.css";
import ApiService from "../../../../services/ApiService";
import ChainStore from "../../../../store/ChainStore";
import { ChainDto } from "../../../../common/dto/ChainDto";
import { SuccessfulBridgeData } from "../../types";
import { bridgeNFT, estimateBridge } from "../../../../core/contractController";
import { CONTRACT_ADDRESS, DEFAULT_REFUEL_COST_USD, UnailableNetworks } from "../../../../common/constants";
import { NetworkName } from "../../../../common/enums/NetworkName";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import AppStore from "../../../../store/AppStore";

interface Props {
    onSubmit(data: SuccessfulBridgeData): void;
}

function NftModal({ onSubmit }: Props) {
    const nft = NftStore.selectedNft();
    const { account } = AppStore;
    const [_chains, setChains] = useState<ChainDto[]>([]);
    const [selectedChain, setSelectedChain] = useState<string>();
    const [isPending , setIsPending] = useState<boolean>(false);
    const [refuelEnabled, setRefuelEnable] = useState<boolean>(false);
    const [refuelCost, setRefuelCost] = useState(DEFAULT_REFUEL_COST_USD);
    const [bridgeCost, setBridgeCost] = useState<string | null>();

    const { chain: currentChain } = useNetwork();
    const { switchNetworkAsync } = useSwitchNetwork();
    const { address } = useAccount();

    useEffect(() => {
        if (ChainStore.chains.length && nft) {
            const _chains = ChainStore.chains
                .filter(x => x.id !== nft?.chainId)
                .filter(x => !UnailableNetworks[x.network as NetworkName].includes(nft.chainNetwork as NetworkName));
            setChains(_chains);
            setSelectedChain(_chains?.[0]?.id);
        }
    }, [ChainStore.chains, nft]);

    const estimateBridgeFee = async (selectedChain: string) => {
        if (nft) {
            const chain = ChainStore.chains.find(c => c.id === selectedChain);

            if (chain) {
                let _currentNetwork: string = currentChain?.network!;

                if (currentChain?.network !== nft?.chainNetwork) {
                    const res = await switchNetworkAsync?.(nft?.chainNativeId);
                    if (res) {
                        _currentNetwork = res.network;
                    }
                }

                const bridgeFee = await estimateBridge({
                    contractAddress: CONTRACT_ADDRESS[_currentNetwork as NetworkName],
                    chainToSend: {
                        id: chain.chainId,
                        name: chain.name,
                        network: chain.network,
                        lzChain: chain.lzChain
                    },
                    account,
                    accountAddress: address!
                }, 0, refuelEnabled, refuelCost);

                setBridgeCost(bridgeFee);
            }
        }
    };

    useEffect(() => {
        if (selectedChain) {
            estimateBridgeFee(selectedChain);
        }
    }, [selectedChain, refuelEnabled, refuelCost]);

    if (!nft) {
        return null;
    }

    const handleClose = () => {
        NftStore.setNft(null);
    };

    const handleSubmit = async () => {
        try {
            setIsPending(true);

            const chainToSend = ChainStore.getChainById(selectedChain!);
            let _currentNetwork: string = currentChain?.network!;

            if (currentChain?.network !== nft.chainNetwork) {
                const res = await switchNetworkAsync?.(nft.chainNativeId);
                if (res) {
                    _currentNetwork = res.network;
                }
            }

            if (!chainToSend) {
                notification.error({ message: 'Something went wrong :(' });
                return;
            }

            const result = await bridgeNFT({
                contractAddress: CONTRACT_ADDRESS[_currentNetwork as NetworkName],
                chainToSend: {
                    id: chainToSend.chainId,
                    name: chainToSend.name,
                    network: chainToSend.network,
                    lzChain: chainToSend.lzChain
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

                onSubmit({
                    nftId: nft.id,
                    previousChain: ChainStore.getChainById(nft.chainId)!,
                    nextChain: ChainStore.getChainById(chainToSend?.id!)!
                });
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

    return (
        <UiModal
            open={!!nft}
            title={nft?.name}
            onClose={handleClose}
            width={742}
            footer={
                nft && (
                    <Flex gap={12} className={clsx(styles.footer, isPending && styles.footerPending)}>
                        <RefuelSwitch
                            refuel={refuelCost}
                            onChangeRefuelGas={setRefuelCost}
                            checked={refuelEnabled}
                            onChange={setRefuelEnable}
                            className={styles.switch}
                        />

                        <Flex gap={8} flex={1} className={styles.actions}>
                            <ChainSelect
                                chains={_chains}
                                value={selectedChain}
                                onChange={setSelectedChain}
                                className={styles.dropdown}
                                bridgeCost={bridgeCost}
                            />
                            <Button className={styles.sendBtn} onClick={handleSubmit}>Send</Button>
                        </Flex>
                        {isPending && <Spin className={styles.pending} />}
                    </Flex>
                )
            }
        >
            {nft && (
                <>
                    <Flex align="center" justify="center" className={styles.image}>
                        <PinataImage hash={nft.pinataImageHash} name={nft.name} />
                    </Flex>
                    <div className={styles.description}>{nft.description}</div>
                </>
            )}
        </UiModal>
    )
}

export default observer(NftModal);