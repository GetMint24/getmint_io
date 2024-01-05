"use client";

import { useEffect, useState } from "react";
import { Flex, notification, Spin } from "antd";
import clsx from "clsx";
import CostLabel from "../../../../../components/CostLabel/CostLabel";
import Button from "../../../../../components/ui/Button/Button";
import ChainLabel from "../../../../../components/ChainLabel/ChainLabel";
import ChainSelect from "../../../../../components/ChainSelect/ChainSelect";

import styles from "./BridgeForm.module.css";
import ChainStore from "../../../../../store/ChainStore";
import { NFTDto } from "../../../../../common/dto/NFTDto";
import { ChainDto } from "../../../../../common/dto/ChainDto";
import { bridgeNFT } from "../../../../../core/contractController";
import { CONTRACT_ADDRESS, UnailableNetworks } from "../../../../../common/constants";
import { NetworkName } from "../../../../../common/enums/NetworkName";
import ApiService from "../../../../../services/ApiService";
import { useNetwork, useSwitchNetwork } from "wagmi";


interface Props {
    nft: NFTDto;
    onBridge: () => void;
    className?: string;
}

interface SubmittedData {
    previousChain: ChainDto;
    nextChain: ChainDto;
}

export default function BridgeForm({ className, nft, onBridge }: Props) {
    const [submittedData, setSubmittedData] = useState<SubmittedData | null>(null);
    const [_chains, setChains] = useState<ChainDto[]>([]);
    const [selectedChain, setSelectedChain] = useState<string>();
    const [isPending , setIsPending] = useState<boolean>(false);

    const { chain: currentChain } = useNetwork();
    const { switchNetworkAsync } = useSwitchNetwork();

    useEffect(() => {
        if (ChainStore.chains.length && nft) {
            const _chains = ChainStore.chains
                .filter(x => x.id !== nft?.chainId)
                .filter(x => !UnailableNetworks[x.network as NetworkName].includes(nft.chainNetwork as NetworkName));

            setChains(_chains);
            setSelectedChain(_chains?.[0]?.id);
        }
    }, [ChainStore.chains, nft]);

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
                notification.error({ message: 'Something went wrong :(', duration: 10000 });
                return;
            }

            const result = await bridgeNFT({
                contractAddress: CONTRACT_ADDRESS[_currentNetwork as NetworkName],
                chainToSend
            }, nft.tokenId, false);

            if (result.result) {
                notification.success({
                    message: result.message,
                    duration: 10000
                });

                await ApiService.bridgeNFT({
                    transactionHash: result.transactionHash,
                    previousChainNetwork: nft?.chainNetwork!,
                    nextChainNetwork: chainToSend?.network!,
                    nftId: nft.id
                });

                setSubmittedData({
                    previousChain: ChainStore.getChainById(nft.chainId)!,
                    nextChain: ChainStore.getChainById(chainToSend?.id!)!
                });

                onBridge();
            } else {
                notification.warning({
                    message: result.message,
                    duration: 10000
                });
            }
        } catch (e) {
            console.error(e);
            notification.error({ message: 'Something went wrong :(', duration: 10000 });
        } finally {
            setIsPending(false);
        }
    };

    if (submittedData) {
        return (
            <Flex vertical gap={8} className={className}>
                <Flex gap={4} align="center" className={clsx(styles.bridgeTitle, styles.successful)}>
                    <img src="/svg/ui/successful.svg" alt="" />
                    <span>Successful bridge</span>
                    <CostLabel cost={10} success />
                </Flex>

                <Flex align="center" className={styles.bridgeScheme}>
                    <ChainLabel network={submittedData.previousChain.network} label={submittedData.previousChain.name} justify="center" className={styles.label} />
                    <img src="/svg/scheme-arrow.svg" alt="" />
                    <ChainLabel network={submittedData.nextChain.network} label={submittedData.nextChain.name} justify="center" className={styles.label} />
                </Flex>
            </Flex>
        )
    }

    return (
        <Flex vertical gap={12} className={className}>
            <Flex gap={8} align="center" className={styles.bridgeTitle}>
                <span>Bridge your NFT</span>
                <CostLabel cost={10} />
            </Flex>

            {/*<RefuelSwitch className={styles.switch} />*/}

            <div className={clsx(styles.footer, isPending && styles.footerPending)}>
                <Flex gap={8} className={styles.formActions}>
                    <ChainSelect chains={_chains} value={selectedChain} className={styles.dropdown} onChange={setSelectedChain} />
                    <Button className={styles.sendBtn} onClick={handleSubmit}>Send</Button>
                </Flex>

                {isPending && <Spin className={styles.pending} />}
            </div>
        </Flex>
    )
}