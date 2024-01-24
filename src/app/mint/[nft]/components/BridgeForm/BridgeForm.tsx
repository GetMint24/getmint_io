"use client";

import React from "react";
import { Flex, Spin } from "antd";
import clsx from "clsx";
import styles from "./BridgeForm.module.css";

import CostLabel from "../../../../../components/CostLabel/CostLabel";
import Button from "../../../../../components/ui/Button/Button";
import ChainLabel from "../../../../../components/ChainLabel/ChainLabel";
import ChainSelect from "../../../../../components/ChainSelect/ChainSelect";
import { NFTDto } from "../../../../../common/dto/NFTDto";
import RefuelSwitch from "../../../../../components/RefuelSwitch/RefuelSwitch";
import { useBridge } from "../../../../../common/useBridge";


interface Props {
    nft: NFTDto;
    onAfterBridge: () => void;
    className?: string;
}

export default function BridgeForm({ className, nft, onAfterBridge }: Props) {
    const {
        bridgePriceList,
        chains,
        refuelCost,
        refuelEnabled,
        selectedChain,
        submittedData,
        isPending,
        isNeedChangeChain,
        switchNetwork,
        onChangeChain,
        onChangeRefuelEnabled,
        onChangeRefuelGas,
        onBridge
    } = useBridge(nft, onAfterBridge);

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

            <RefuelSwitch
                refuel={refuelCost}
                onChangeRefuelGas={onChangeRefuelGas}
                checked={refuelEnabled}
                onChange={onChangeRefuelEnabled}
                className={styles.switch}
            />

            <div className={clsx(styles.footer, isPending && styles.footerPending)}>
                <Flex gap={8} className={styles.formActions}>
                    <ChainSelect
                        chains={chains}
                        value={selectedChain}
                        className={styles.dropdown}
                        onChange={onChangeChain}
                        priceList={bridgePriceList}
                    />
                    {isNeedChangeChain
                        ? <Button className={styles.sendBtn} onClick={switchNetwork}>Switch network</Button>
                        : <Button className={styles.sendBtn} onClick={onBridge}>Send</Button>
                    }
                </Flex>

                {isPending && <Spin className={styles.pending} />}
            </div>
        </Flex>
    )
}