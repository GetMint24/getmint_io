"use client";

import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useAccount } from "wagmi";
import { Flex } from "antd";

import Card from "../../components/ui/Card/Card";
import CostLabel from "../../components/CostLabel/CostLabel";
import NftList from "./components/NftList/NftList";
import NftStore from "../../store/NftStore";
import ChainStore from "../../store/ChainStore";

import styles from "./page.module.css";
import NetworkTypeTabs from "../../components/NetworkTypeTabs/NetworkTypeTabs";

function Page() {
    const { address } = useAccount();

    useEffect(() => {
        ChainStore.getChains();
    }, []);

    useEffect(() => {
        NftStore.getNfts();
    }, [address]);

    return (
        <Card title={(
            <Flex justify="space-between" wrap="wrap">
                <div className={styles.title}>
                    <span className={styles.titleLabel}>Bridge NFT</span>
                    <CostLabel cost={10} size="large" />
                </div>

                <NetworkTypeTabs selected={NftStore.currentNetworkType} onSelect={(type) => {
                    NftStore.setSelectedNetworkType(type);
                    NftStore.getNfts();
                }} />
            </Flex>
        )}>
            <div>Your NFT</div>
            <NftList />
        </Card>
    )
}

export default observer(Page);