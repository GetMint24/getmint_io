"use client";

import { useState } from "react";
import { Flex } from "antd";
import clsx from "clsx";
import CostLabel from "../../../../../components/CostLabel/CostLabel";
import RefuelSwitch from "../../../../../components/RefuelSwitch/RefuelSwitch";
import WalletActions from "../../../../../components/WalletActions/WalletActions";
import Button from "../../../../../components/ui/Button/Button";
import ChainLabel from "../../../../../components/ChainLabel/ChainLabel";

import styles from "./BridgeForm.module.css";


interface Props {
    className?: string;
}

export default function BridgeForm({ className }: Props) {
    // TODO: delete when actions are known
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = () => {
        setIsSubmitted(true);
    };

    if (isSubmitted) {
        return (
            <Flex vertical gap={8} className={className}>
                <Flex gap={4} align="center" className={clsx(styles.bridgeTitle, styles.successful)}>
                    <img src="/svg/ui/successful.svg" />
                    <span>Successful bridge</span>
                    <CostLabel cost={10} success />
                </Flex>

                <Flex align="center" className={styles.bridgeScheme}>
                    <ChainLabel network="base" label="Base network" justify="center" className={styles.label} />
                    <img src="/svg/scheme-arrow.svg" />
                    <ChainLabel network="base" label="Arbitrum One" justify="center" className={styles.label} />
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

            <RefuelSwitch className={styles.switch} />

            <Flex gap={8} className={styles.formActions}>
                <WalletActions className={styles.dropdown} />
                <Button className={styles.sendBtn} onClick={handleSubmit}>Send</Button>
            </Flex>
        </Flex>
    )
}